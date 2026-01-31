/**
 * SECURITY UTILITIES
 * Comprehensive security functions for input validation, sanitization, and protection
 */

// ===== INPUT SANITIZATION =====
/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (!input) return "";

  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .replace(/`/g, "&#x60;")
    .replace(/=/g, "&#x3D;");
}

/**
 * Sanitize HTML content more aggressively
 */
export function sanitizeHTML(html: string): string {
  if (!html) return "";

  // Remove all script tags and their content
  let clean = html.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    "",
  );

  // Remove event handlers
  clean = clean.replace(/on\w+\s*=\s*["'][^"']*["']/gi, "");
  clean = clean.replace(/on\w+\s*=\s*[^\s>]*/gi, "");

  // Remove javascript: protocol
  clean = clean.replace(/javascript:/gi, "");

  // Remove data: protocol (can be used for XSS)
  clean = clean.replace(/data:text\/html/gi, "");

  // Remove iframe, object, embed tags
  clean = clean.replace(/<(iframe|object|embed|applet)[^>]*>.*?<\/\1>/gi, "");

  return clean;
}

/**
 * Validate and sanitize URL to prevent XSS and injection
 */
export function sanitizeURL(url: string): string | null {
  if (!url) return null;

  try {
    const urlObj = new URL(url);

    // Only allow http and https protocols
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return null;
    }

    // Block suspicious patterns in URL
    const suspicious = [
      /javascript:/gi,
      /data:/gi,
      /vbscript:/gi,
      /file:/gi,
      /<script/gi,
      /onerror/gi,
      /onload/gi,
    ];

    if (suspicious.some((pattern) => pattern.test(url))) {
      return null;
    }

    return urlObj.toString();
  } catch {
    return null;
  }
}

// ===== CONTENT VALIDATION =====
/**
 * Check if content contains gambling/casino related keywords (Indonesian context)
 */
export function containsGamblingContent(text: string): boolean {
  const gamblingPatterns = [
    /jud[io]l/gi,
    /slot\s*online/gi,
    /poker\s*online/gi,
    /casino\s*online/gi,
    /togel/gi,
    /bandar/gi,
    /maxwin/gi,
    /gacor/gi,
    /slot\s*gacor/gi,
    /bonus.*slot/gi,
    /depo/gi,
    /withdraw/gi,
    /jackpot/gi,
    /scatter/gi,
    /rtp\s*\d+/gi,
    /slot88/gi,
    /pragmatic.*play/gi,
  ];

  return gamblingPatterns.some((pattern) => pattern.test(text));
}

/**
 * Check if content contains malicious scripts
 */
export function containsMaliciousScript(text: string): boolean {
  const scriptPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /onerror\s*=/gi,
    /onload\s*=/gi,
    /onclick\s*=/gi,
    /eval\s*\(/gi,
    /document\.write/gi,
    /innerHTML/gi,
    /outerHTML/gi,
    /setTimeout/gi,
    /setInterval/gi,
    /Function\s*\(/gi,
  ];

  return scriptPatterns.some((pattern) => pattern.test(text));
}

/**
 * Check if content contains SQL injection attempts
 */
export function containsSQLInjection(text: string): boolean {
  const sqlPatterns = [
    /(\bunion\b.*\bselect\b)/gi,
    /(\bselect\b.*\bfrom\b)/gi,
    /(\binsert\b.*\binto\b)/gi,
    /(\bdelete\b.*\bfrom\b)/gi,
    /(\bdrop\b.*\btable\b)/gi,
    /(\bupdate\b.*\bset\b)/gi,
    /(--|;|\/\*|\*\/)/g,
    /('\s*or\s*'1'\s*=\s*'1)/gi,
    /('\s*or\s*1\s*=\s*1)/gi,
  ];

  return sqlPatterns.some((pattern) => pattern.test(text));
}

/**
 * Comprehensive malicious content check
 */
export function isMaliciousContent(text: string): {
  isMalicious: boolean;
  reason?: string;
} {
  if (containsGamblingContent(text)) {
    return { isMalicious: true, reason: "Gambling content detected" };
  }

  if (containsMaliciousScript(text)) {
    return { isMalicious: true, reason: "Malicious script detected" };
  }

  if (containsSQLInjection(text)) {
    return { isMalicious: true, reason: "SQL injection attempt detected" };
  }

  return { isMalicious: false };
}

// ===== FILE VALIDATION =====
/**
 * Validate file upload to prevent malware
 */
export function validateFile(file: File): {
  isValid: boolean;
  error?: string;
} {
  // Allowed file types
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "video/mp4",
    "video/webm",
    "application/pdf",
  ];

  // Dangerous extensions
  const dangerousExtensions = [
    ".exe",
    ".bat",
    ".cmd",
    ".sh",
    ".ps1",
    ".vbs",
    ".js",
    ".jar",
    ".php",
    ".asp",
    ".aspx",
    ".jsp",
    ".py",
    ".rb",
    ".pl",
  ];

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: "File type not allowed" };
  }

  // Check file extension
  const fileName = file.name.toLowerCase();
  if (dangerousExtensions.some((ext) => fileName.endsWith(ext))) {
    return { isValid: false, error: "Dangerous file extension detected" };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return { isValid: false, error: "File size exceeds limit (10MB)" };
  }

  // Check for double extensions (e.g., image.jpg.exe)
  const parts = fileName.split(".");
  if (parts.length > 2) {
    const secondToLast = "." + parts[parts.length - 2];
    if (dangerousExtensions.includes(secondToLast)) {
      return { isValid: false, error: "Double extension detected" };
    }
  }

  return { isValid: true };
}

// ===== RATE LIMITING HELPERS =====
/**
 * Simple in-memory rate limiter
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private limit: number;
  private windowMs: number;

  constructor(limit: number = 100, windowMs: number = 60000) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  check(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Get existing requests for this identifier
    let requests = this.requests.get(identifier) || [];

    // Filter out old requests
    requests = requests.filter((time) => time > windowStart);

    // Check if limit exceeded
    if (requests.length >= this.limit) {
      return false;
    }

    // Add current request
    requests.push(now);
    this.requests.set(identifier, requests);

    // Clean up old entries periodically
    if (Math.random() < 0.01) {
      this.cleanup(windowStart);
    }

    return true;
  }

  private cleanup(windowStart: number) {
    for (const [identifier, requests] of this.requests.entries()) {
      const validRequests = requests.filter((time) => time > windowStart);
      if (validRequests.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, validRequests);
      }
    }
  }
}

// ===== SECURITY LOGGING =====
export interface SecurityLog {
  timestamp: number;
  type: "suspicious" | "blocked" | "warning";
  ip: string;
  reason: string;
  details?: any;
}

class SecurityLogger {
  private logs: SecurityLog[] = [];
  private maxLogs: number = 1000;

  log(log: Omit<SecurityLog, "timestamp">) {
    this.logs.push({
      ...log,
      timestamp: Date.now(),
    });

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console log for monitoring
    console.warn(
      `[SECURITY ${log.type.toUpperCase()}] ${log.ip}: ${log.reason}`,
    );
  }

  getLogs(limit: number = 100): SecurityLog[] {
    return this.logs.slice(-limit);
  }

  clearOldLogs(olderThanMs: number = 86400000) {
    const cutoff = Date.now() - olderThanMs;
    this.logs = this.logs.filter((log) => log.timestamp > cutoff);
  }
}

export const securityLogger = new SecurityLogger();

// ===== CSRF PROTECTION =====
/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  return crypto.randomUUID();
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(
  token: string,
  expectedToken: string,
): boolean {
  return token === expectedToken;
}

// ===== EXPORTS =====
export const security = {
  sanitizeInput,
  sanitizeHTML,
  sanitizeURL,
  containsGamblingContent,
  containsMaliciousScript,
  containsSQLInjection,
  isMaliciousContent,
  validateFile,
  generateCSRFToken,
  validateCSRFToken,
  RateLimiter,
  securityLogger,
};

export default security;
