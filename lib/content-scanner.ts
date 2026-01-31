/**
 * CONTENT SCANNER
 * Real-time scanner for detecting and blocking malicious content injection
 * specifically targeting gambling ads (judol) and malware
 */

export interface ScanResult {
  isClean: boolean;
  threats: Threat[];
  score: number; // 0-100, higher = more suspicious
}

export interface Threat {
  type: "gambling" | "xss" | "sql-injection" | "malware" | "phishing" | "spam";
  severity: "low" | "medium" | "high" | "critical";
  pattern: string;
  match: string;
  position?: number;
}

// ===== GAMBLING/CASINO DETECTION (Indonesian + International) =====
const GAMBLING_PATTERNS = {
  critical: [
    // Indonesian gambling terms
    { pattern: /jud[io]l\s*online/gi, description: "Online gambling" },
    { pattern: /slot\s*gacor/gi, description: "Slot gambling" },
    { pattern: /situs\s*jud[io]l/gi, description: "Gambling site" },
    { pattern: /bandar\s*togel/gi, description: "Lottery dealer" },
    { pattern: /agen\s*slot/gi, description: "Slot agent" },
    { pattern: /deposit\s*pulsa/gi, description: "Phone credit deposit" },

    // Direct gambling terms
    { pattern: /togel/gi, description: "Lottery gambling" },
    { pattern: /sabung\s*ayam/gi, description: "Cockfighting" },
    { pattern: /slot88/gi, description: "Slot88 site" },
    { pattern: /casino\s*online/gi, description: "Online casino" },
  ],
  high: [
    { pattern: /maxwin/gi, description: "Gambling winnings" },
    { pattern: /gacor/gi, description: "Hot slot machine" },
    { pattern: /rtp\s*\d{2,3}%?/gi, description: "RTP percentage" },
    { pattern: /scatter/gi, description: "Slot scatter symbol" },
    { pattern: /bonus\s*new\s*member/gi, description: "New member bonus" },
    { pattern: /depo\s*\d+/gi, description: "Deposit amount" },
    { pattern: /withdraw/gi, description: "Withdrawal" },
    { pattern: /poker\s*online/gi, description: "Online poker" },
    { pattern: /baccarat/gi, description: "Baccarat gambling" },
  ],
  medium: [
    { pattern: /jackpot/gi, description: "Jackpot" },
    { pattern: /free\s*spin/gi, description: "Free spins" },
    { pattern: /bonus\s*\d+/gi, description: "Bonus offer" },
    { pattern: /daftar\s*sekarang/gi, description: "Register now" },
    { pattern: /link\s*alternatif/gi, description: "Alternative link" },
    { pattern: /pragmatic\s*play/gi, description: "Pragmatic Play provider" },
  ],
};

// ===== XSS ATTACK PATTERNS =====
const XSS_PATTERNS = {
  critical: [
    {
      pattern: /<script[^>]*>.*?<\/script>/gi,
      description: "Script tag injection",
    },
    { pattern: /javascript:\s*/gi, description: "JavaScript protocol" },
    {
      pattern: /on\w+\s*=\s*["'][^"']*["']/gi,
      description: "Event handler injection",
    },
    { pattern: /eval\s*\(/gi, description: "Eval function" },
    { pattern: /document\.write/gi, description: "Document.write injection" },
  ],
  high: [
    { pattern: /innerHTML/gi, description: "InnerHTML manipulation" },
    { pattern: /outerHTML/gi, description: "OuterHTML manipulation" },
    { pattern: /document\.cookie/gi, description: "Cookie access" },
    { pattern: /window\.location/gi, description: "Location redirect" },
    { pattern: /<iframe[^>]*>/gi, description: "Iframe injection" },
    { pattern: /<embed[^>]*>/gi, description: "Embed tag injection" },
    { pattern: /<object[^>]*>/gi, description: "Object tag injection" },
  ],
  medium: [
    { pattern: /alert\s*\(/gi, description: "Alert function" },
    { pattern: /confirm\s*\(/gi, description: "Confirm function" },
    { pattern: /prompt\s*\(/gi, description: "Prompt function" },
    { pattern: /setTimeout/gi, description: "SetTimeout function" },
    { pattern: /setInterval/gi, description: "SetInterval function" },
  ],
};

// ===== SQL INJECTION PATTERNS =====
const SQL_INJECTION_PATTERNS = {
  critical: [
    {
      pattern: /(\bunion\b.*\bselect\b)/gi,
      description: "UNION SELECT attack",
    },
    { pattern: /(\bdrop\b.*\btable\b)/gi, description: "DROP TABLE attack" },
    { pattern: /(\bdelete\b.*\bfrom\b)/gi, description: "DELETE FROM attack" },
    {
      pattern: /('\s*or\s*'1'\s*=\s*'1)/gi,
      description: "Always true condition",
    },
    { pattern: /('\s*or\s*1\s*=\s*1)/gi, description: "Always true condition" },
  ],
  high: [
    { pattern: /(\bselect\b.*\bfrom\b)/gi, description: "SELECT FROM query" },
    { pattern: /(\binsert\b.*\binto\b)/gi, description: "INSERT INTO query" },
    { pattern: /(\bupdate\b.*\bset\b)/gi, description: "UPDATE SET query" },
    { pattern: /(--|#|\/\*)/g, description: "SQL comment" },
  ],
};

// ===== MALWARE PATTERNS =====
const MALWARE_PATTERNS = {
  critical: [
    { pattern: /\.exe\b/gi, description: "Executable file" },
    { pattern: /\.bat\b/gi, description: "Batch file" },
    { pattern: /\.cmd\b/gi, description: "Command file" },
    { pattern: /\.sh\b/gi, description: "Shell script" },
    { pattern: /\.vbs\b/gi, description: "VBScript file" },
    { pattern: /\.ps1\b/gi, description: "PowerShell script" },
  ],
  high: [
    { pattern: /base64_decode/gi, description: "Base64 decode function" },
    { pattern: /eval\s*\(.*base64/gi, description: "Base64 eval injection" },
    { pattern: /fromCharCode/gi, description: "Character code obfuscation" },
    { pattern: /\\\\x[0-9a-f]{2}/gi, description: "Hex encoded characters" },
  ],
};

// ===== PHISHING PATTERNS =====
const PHISHING_PATTERNS = {
  high: [
    {
      pattern: /verify\s*(your|account|identity)/gi,
      description: "Verification phishing",
    },
    {
      pattern: /suspended\s*account/gi,
      description: "Account suspension phishing",
    },
    { pattern: /urgent\s*action/gi, description: "Urgency phishing" },
    {
      pattern: /click\s*here\s*to\s*(verify|confirm|activate)/gi,
      description: "Click verification",
    },
  ],
  medium: [
    { pattern: /congratulations.*won/gi, description: "Prize scam" },
    { pattern: /claim\s*your\s*(prize|reward)/gi, description: "Reward scam" },
    { pattern: /limited\s*time\s*offer/gi, description: "Limited offer scam" },
  ],
};

// ===== SPAM PATTERNS =====
const SPAM_PATTERNS = {
  medium: [
    { pattern: /click\s*here/gi, description: "Generic click bait" },
    { pattern: /buy\s*now/gi, description: "Buy now spam" },
    { pattern: /act\s*now/gi, description: "Act now spam" },
    { pattern: /(viagra|cialis)/gi, description: "Pharmaceutical spam" },
  ],
};

/**
 * Scan content for threats
 */
export function scanContent(content: string): ScanResult {
  if (!content || content.trim().length === 0) {
    return { isClean: true, threats: [], score: 0 };
  }

  const threats: Threat[] = [];
  let score = 0;

  // Scan for gambling patterns
  checkPatterns(content, GAMBLING_PATTERNS, "gambling", threats);

  // Scan for XSS patterns
  checkPatterns(content, XSS_PATTERNS, "xss", threats);

  // Scan for SQL injection
  checkPatterns(content, SQL_INJECTION_PATTERNS, "sql-injection", threats);

  // Scan for malware
  checkPatterns(content, MALWARE_PATTERNS, "malware", threats);

  // Scan for phishing
  checkPatterns(content, PHISHING_PATTERNS, "phishing", threats);

  // Scan for spam
  checkPatterns(content, SPAM_PATTERNS, "spam", threats);

  // Calculate threat score
  threats.forEach((threat) => {
    switch (threat.severity) {
      case "critical":
        score += 40;
        break;
      case "high":
        score += 25;
        break;
      case "medium":
        score += 10;
        break;
      case "low":
        score += 5;
        break;
    }
  });

  // Cap score at 100
  score = Math.min(score, 100);

  return {
    isClean: threats.length === 0,
    threats,
    score,
  };
}

/**
 * Check content against pattern groups
 */
function checkPatterns(
  content: string,
  patternGroups: Record<
    string,
    Array<{ pattern: RegExp; description: string }>
  >,
  type: Threat["type"],
  threats: Threat[],
) {
  Object.entries(patternGroups).forEach(([severity, patterns]) => {
    patterns.forEach(({ pattern, description }) => {
      const matches = content.matchAll(pattern);

      for (const match of matches) {
        threats.push({
          type,
          severity: severity as Threat["severity"],
          pattern: description,
          match: match[0],
          position: match.index,
        });
      }
    });
  });
}

/**
 * Quick check if content is suspicious
 */
export function isContentSuspicious(
  content: string,
  threshold: number = 25,
): boolean {
  const result = scanContent(content);
  return result.score >= threshold;
}

/**
 * Block content if it contains critical threats
 */
export function shouldBlockContent(content: string): boolean {
  const result = scanContent(content);

  // Block if there are any critical threats
  const hasCriticalThreat = result.threats.some(
    (threat) => threat.severity === "critical",
  );

  // Or if score is very high
  const highScore = result.score >= 50;

  return hasCriticalThreat || highScore;
}

/**
 * Get detailed scan report
 */
export function getScanReport(content: string): string {
  const result = scanContent(content);

  if (result.isClean) {
    return "✅ Content is clean - no threats detected";
  }

  let report = `🚨 Threat Score: ${result.score}/100\n\n`;

  const groupedThreats = result.threats.reduce(
    (acc, threat) => {
      if (!acc[threat.type]) {
        acc[threat.type] = [];
      }
      acc[threat.type].push(threat);
      return acc;
    },
    {} as Record<string, Threat[]>,
  );

  Object.entries(groupedThreats).forEach(([type, threats]) => {
    report += `\n${type.toUpperCase()}:\n`;
    threats.forEach((threat) => {
      const emoji =
        threat.severity === "critical"
          ? "🔴"
          : threat.severity === "high"
            ? "🟠"
            : threat.severity === "medium"
              ? "🟡"
              : "🟢";
      report += `  ${emoji} [${threat.severity.toUpperCase()}] ${threat.pattern}: "${threat.match}"\n`;
    });
  });

  return report;
}

export const contentScanner = {
  scan: scanContent,
  isSuspicious: isContentSuspicious,
  shouldBlock: shouldBlockContent,
  getReport: getScanReport,
};

export default contentScanner;
