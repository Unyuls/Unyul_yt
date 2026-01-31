import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const requestCounts = new Map<string, { count: number; resetTime: number }>();
const blockedIPs = new Map<string, number>();
const suspiciousPatterns = new Map<string, number>();

const RATE_LIMIT = {
  WINDOW_MS: 60000,
  MAX_REQUESTS: 60,
  BAN_THRESHOLD: 5,
  BAN_DURATION: 3600000,
};

const MALICIOUS_PATTERNS = [
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

  /<script[^>]*>.*?<\/script>/gi,
  /javascript:/gi,
  /onerror\s*=/gi,
  /onload\s*=/gi,
  /eval\s*\(/gi,
  /document\.write/gi,
  /innerHTML/gi,
  /outerHTML/gi,

  /(\bunion\b.*\bselect\b|\bselect\b.*\bfrom\b|\binsert\b.*\binto\b|\bdelete\b.*\bfrom\b|\bdrop\b.*\btable\b)/gi,
  /('|(--|;|\/\*|\*\/))/g,

  /(<|%3C).*script.*(>|%3E)/gi,
  /(<|%3C).*iframe.*(>|%3E)/gi,
  /(<|%3C).*object.*(>|%3E)/gi,
  /(<|%3C).*embed.*(>|%3E)/gi,

  /\.php$/gi,
  /\.asp$/gi,
  /\.jsp$/gi,
  /\.exe$/gi,
  /\.sh$/gi,
  /\.bat$/gi,
  /\.cmd$/gi,

  /\.\.[\/\\]/g,
  /etc[\/\\]passwd/gi,
  /windows[\/\\]system32/gi,
];
const SUSPICIOUS_USER_AGENTS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  /curl/i,
  /wget/i,
  /python/i,
];

const securityHeaders = {
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

  "X-Frame-Options": "SAMEORIGIN",

  "X-Content-Type-Options": "nosniff",

  "X-XSS-Protection": "1; mode=block",

  "Referrer-Policy": "strict-origin-when-cross-origin",

  "Permissions-Policy": "geolocation=(), microphone=(), camera=(), payment=()",

  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",

  "X-Powered-By": "Unknown",
};

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
    const violations = (suspiciousPatterns.get(ip) || 0) + 1;
    suspiciousPatterns.set(ip, violations);

    if (violations >= RATE_LIMIT.BAN_THRESHOLD) {
      blockedIPs.set(ip, now + RATE_LIMIT.BAN_DURATION);
      console.warn(`IP BANNED: ${ip} - Jangan spam anying!`);
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

export function middleware(request: NextRequest) {
  const ip = getClientIP(request);
  const userAgent = request.headers.get("user-agent");
  const url = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams.toString();

  if (isIPBlocked(ip)) {
    console.warn(`Blocked request from banned IP: ${ip}`);
    return new NextResponse("Lu dibanned anying!", { status: 403 });
  }

  if (!checkRateLimit(ip)) {
    console.warn(`Rate limit exceeded: ${ip} on ${url}`);
    return new NextResponse("Spam bangsat!", {
      status: 429,
      headers: {
        "Retry-After": "60",
      },
    });
  }

  if (isSuspiciousUserAgent(userAgent)) {
    console.warn(`Konten judol terdeteksi, dengan IP: ${ip} - ${userAgent}`);
    const suspicious = (suspiciousPatterns.get(ip) || 0) + 0.5;
    suspiciousPatterns.set(ip, suspicious);
  }

  const fullURL = url + (searchParams ? "?" + searchParams : "");
  if (containsMaliciousContent(fullURL)) {
    console.error(`Konten judol terdeteksi: ${ip} - ${fullURL}`);

    blockedIPs.set(ip, Date.now() + RATE_LIMIT.BAN_DURATION * 24);

    return new NextResponse("Forbidden - Malicious Content Detected", {
      status: 403,
    });
  }

  if (request.method === "POST" || request.method === "PUT") {
    const contentType = request.headers.get("content-type") || "";

    if (
      !contentType.includes("application/json") &&
      !contentType.includes("application/x-www-form-urlencoded") &&
      !contentType.includes("multipart/form-data") &&
      !contentType.includes("text/plain")
    ) {
      console.warn(`Konten judol terdeteksi: ${ip} - ${contentType}`);
      return new NextResponse("Forbidden - Invalid Content Type", {
        status: 403,
      });
    }
  }

  const sensitivePatterns = [
    /\.env/i,
    /\.git/i,
    /\.config/i,
    /node_modules/i,
    /package\.json/i,
    /\.next/i,
  ];

  if (sensitivePatterns.some((pattern) => pattern.test(url))) {
    console.error(`File sensitif terdeteksi: ${ip} - ${url}`);
    return new NextResponse("Forbidden", { status: 403 });
  }

  const response = NextResponse.next();

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  response.headers.set("X-Client-IP", ip);
  response.headers.set("X-Request-ID", crypto.randomUUID());

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
