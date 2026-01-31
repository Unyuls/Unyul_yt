import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ===== RATE LIMITING & DDOS PROTECTION =====
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const blockedIPs = new Map<string, number>(); // IP -> blocked until timestamp
const suspiciousPatterns = new Map<string, number>(); // Track suspicious activity

// Configuration
const RATE_LIMIT = {
  WINDOW_MS: 60000, // 1 minute
  MAX_REQUESTS: 60, // 60 requests per minute
  BAN_THRESHOLD: 5, // Ban after 5 violations
  BAN_DURATION: 3600000, // 1 hour ban
};

// ===== MALICIOUS PATTERN DETECTION =====
const MALICIOUS_PATTERNS = [
  // Gambling/Casino patterns (Indonesian & English)
  /jud[io]l/gi,
  /slot\s*online/gi,
  /poker\s*online/gi,
  /casino\s*online/gi,
  /togel/gi,
  /bandar/gi,
  /maxwin/gi,
  /gacor/gi,
  /deposit/gi,
  /bonus.*slot/gi,

  // Script injection patterns
  /<script[^>]*>.*?<\/script>/gi,
  /javascript:/gi,
  /onerror\s*=/gi,
  /onload\s*=/gi,
  /eval\s*\(/gi,
  /document\.write/gi,
  /innerHTML/gi,
  /outerHTML/gi,

  // SQL Injection patterns
  /(\bunion\b.*\bselect\b|\bselect\b.*\bfrom\b|\binsert\b.*\binto\b|\bdelete\b.*\bfrom\b|\bdrop\b.*\btable\b)/gi,
  /('|(--|;|\/\*|\*\/))/g,

  // XSS patterns
  /(<|%3C).*script.*(>|%3E)/gi,
  /(<|%3C).*iframe.*(>|%3E)/gi,
  /(<|%3C).*object.*(>|%3E)/gi,
  /(<|%3C).*embed.*(>|%3E)/gi,

  // File upload exploits
  /\.php$/gi,
  /\.asp$/gi,
  /\.jsp$/gi,
  /\.exe$/gi,
  /\.sh$/gi,
  /\.bat$/gi,
  /\.cmd$/gi,

  // Path traversal
  /\.\.[\/\\]/g,
  /etc[\/\\]passwd/gi,
  /windows[\/\\]system32/gi,
];

// Suspicious User-Agent patterns
const SUSPICIOUS_USER_AGENTS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  /curl/i,
  /wget/i,
  /python/i,
];

// ===== SECURITY HEADERS =====
const securityHeaders = {
  // Content Security Policy - CRITICAL for preventing script injection
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "media-src 'self' https:",
    "connect-src 'self' https://www.googleapis.com https://youtube.googleapis.com",
    "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "upgrade-insecure-requests",
  ].join("; "),

  // Prevent clickjacking
  "X-Frame-Options": "SAMEORIGIN",

  // Prevent MIME type sniffing
  "X-Content-Type-Options": "nosniff",

  // XSS Protection
  "X-XSS-Protection": "1; mode=block",

  // Referrer Policy
  "Referrer-Policy": "strict-origin-when-cross-origin",

  // Permissions Policy
  "Permissions-Policy": "geolocation=(), microphone=(), camera=(), payment=()",

  // Strict Transport Security
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",

  // Remove server information
  "X-Powered-By": "Unknown",
};

// ===== HELPER FUNCTIONS =====
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return "unknown";
}

function isIPBlocked(ip: string): boolean {
  const blockedUntil = blockedIPs.get(ip);
  if (!blockedUntil) return false;

  if (Date.now() > blockedUntil) {
    blockedIPs.delete(ip);
    return false;
  }

  return true;
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record || now > record.resetTime) {
    requestCounts.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT.WINDOW_MS,
    });
    return true;
  }

  record.count++;

  if (record.count > RATE_LIMIT.MAX_REQUESTS) {
    // Track violations
    const violations = (suspiciousPatterns.get(ip) || 0) + 1;
    suspiciousPatterns.set(ip, violations);

    // Ban if threshold exceeded
    if (violations >= RATE_LIMIT.BAN_THRESHOLD) {
      blockedIPs.set(ip, now + RATE_LIMIT.BAN_DURATION);
      console.warn(`🚨 IP BANNED: ${ip} - Too many rate limit violations`);
    }

    return false;
  }

  return true;
}

function containsMaliciousContent(text: string): boolean {
  return MALICIOUS_PATTERNS.some((pattern) => pattern.test(text));
}

function isSuspiciousUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return true;

  // Allow legitimate search engines
  if (/googlebot|bingbot|yandex|duckduckbot/i.test(userAgent)) {
    return false;
  }

  return SUSPICIOUS_USER_AGENTS.some((pattern) => pattern.test(userAgent));
}

function sanitizeInput(text: string): string {
  return text
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// ===== MAIN MIDDLEWARE =====
export function middleware(request: NextRequest) {
  const ip = getClientIP(request);
  const userAgent = request.headers.get("user-agent");
  const url = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams.toString();

  // 1. Check if IP is blocked
  if (isIPBlocked(ip)) {
    console.warn(`🚫 Blocked request from banned IP: ${ip}`);
    return new NextResponse("Access Denied - IP Banned", { status: 403 });
  }

  // 2. Rate limiting & DDOS protection
  if (!checkRateLimit(ip)) {
    console.warn(`⚠️ Rate limit exceeded: ${ip} on ${url}`);
    return new NextResponse("Too Many Requests - Rate Limit Exceeded", {
      status: 429,
      headers: {
        "Retry-After": "60",
      },
    });
  }

  // 3. Check for suspicious User-Agent (but don't block, just log)
  if (isSuspiciousUserAgent(userAgent)) {
    console.warn(`🤖 Suspicious User-Agent detected: ${ip} - ${userAgent}`);
    // Track but don't block - could be legitimate
    const suspicious = (suspiciousPatterns.get(ip) || 0) + 0.5;
    suspiciousPatterns.set(ip, suspicious);
  }

  // 4. Scan URL and query parameters for malicious patterns
  const fullURL = url + (searchParams ? "?" + searchParams : "");
  if (containsMaliciousContent(fullURL)) {
    console.error(`🚨 MALICIOUS CONTENT DETECTED in URL: ${ip} - ${fullURL}`);

    // Ban immediately for malicious content
    blockedIPs.set(ip, Date.now() + RATE_LIMIT.BAN_DURATION * 24); // 24-hour ban

    return new NextResponse("Forbidden - Malicious Content Detected", {
      status: 403,
    });
  }

  // 5. Scan POST/PUT request bodies
  if (request.method === "POST" || request.method === "PUT") {
    const contentType = request.headers.get("content-type") || "";

    // Check for suspicious content types
    if (
      !contentType.includes("application/json") &&
      !contentType.includes("application/x-www-form-urlencoded") &&
      !contentType.includes("multipart/form-data") &&
      !contentType.includes("text/plain")
    ) {
      console.warn(`🚨 Suspicious content-type: ${ip} - ${contentType}`);
      return new NextResponse("Forbidden - Invalid Content Type", {
        status: 403,
      });
    }
  }

  // 6. Block direct access to sensitive files
  const sensitivePatterns = [
    /\.env/i,
    /\.git/i,
    /\.config/i,
    /node_modules/i,
    /package\.json/i,
    /\.next/i,
  ];

  if (sensitivePatterns.some((pattern) => pattern.test(url))) {
    console.error(`🚨 Attempted access to sensitive file: ${ip} - ${url}`);
    return new NextResponse("Forbidden", { status: 403 });
  }

  // 7. Add security headers to response
  const response = NextResponse.next();

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Add custom security headers
  response.headers.set("X-Client-IP", ip);
  response.headers.set("X-Request-ID", crypto.randomUUID());

  return response;
}

// ===== MIDDLEWARE CONFIG =====
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
