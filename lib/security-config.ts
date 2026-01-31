/**
 * SECURITY CONFIGURATION
 * Central configuration for all security settings
 */

export const SECURITY_CONFIG = {
  // ===== RATE LIMITING =====
  rateLimit: {
    // General API rate limit
    api: {
      windowMs: 60000, // 1 minute
      maxRequests: 60,
    },

    // Stricter limit for sensitive endpoints
    auth: {
      windowMs: 60000,
      maxRequests: 5,
    },

    // Upload rate limit
    upload: {
      windowMs: 60000,
      maxRequests: 10,
    },

    // Ban settings
    ban: {
      threshold: 5, // Violations before ban
      duration: 3600000, // 1 hour
    },
  },

  // ===== CONTENT SECURITY =====
  contentSecurity: {
    // Maximum content length
    maxLength: {
      comment: 1000,
      message: 500,
      bio: 200,
      url: 2048,
    },

    // File upload restrictions
    upload: {
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "video/mp4",
        "video/webm",
      ],
      allowedExtensions: [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".mp4",
        ".webm",
      ],
    },

    // Threat detection thresholds
    threats: {
      blockThreshold: 50, // Score above this = auto block
      warnThreshold: 25, // Score above this = warning
    },
  },

  // ===== DDOS PROTECTION =====
  ddos: {
    // Connection limits
    maxConnectionsPerIP: 100,

    // Request pattern detection
    burstDetection: {
      windowMs: 1000, // 1 second
      maxBurst: 20, // Max requests in 1 second
    },

    // Automatic ban on DDOS detection
    autoBan: true,
    autoBanDuration: 86400000, // 24 hours
  },

  // ===== BLOCKED PATTERNS =====
  blocklist: {
    // Gambling keywords (Indonesian)
    gambling: [
      "judol",
      "judi online",
      "slot gacor",
      "togel",
      "bandar",
      "maxwin",
      "rtp",
      "scatter",
      "casino online",
      "poker online",
      "sabung ayam",
    ],

    // Suspicious file extensions
    dangerousExtensions: [
      ".exe",
      ".bat",
      ".cmd",
      ".sh",
      ".ps1",
      ".vbs",
      ".jar",
      ".php",
      ".asp",
      ".aspx",
      ".jsp",
    ],

    // Blocked User-Agents (bots)
    blockedUserAgents: [
      "scrapy",
      "nutch",
      "bot",
      "crawler",
      "spider",
      // But allow legitimate search engines
      "!googlebot",
      "!bingbot",
      "!yandex",
      "!duckduckbot",
    ],
  },

  // ===== HEADERS =====
  headers: {
    // Content Security Policy
    csp: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // For Next.js
        "'unsafe-eval'", // For Next.js dev
        "https://www.googletagmanager.com",
        "https://www.google-analytics.com",
      ],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      mediaSrc: ["'self'", "https:"],
      connectSrc: [
        "'self'",
        "https://www.googleapis.com",
        "https://youtube.googleapis.com",
      ],
      frameSrc: [
        "'self'",
        "https://www.youtube.com",
        "https://www.youtube-nocookie.com",
      ],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      upgradeInsecureRequests: [],
    },

    // Other security headers
    xFrameOptions: "SAMEORIGIN",
    xContentTypeOptions: "nosniff",
    xXSSProtection: "1; mode=block",
    referrerPolicy: "strict-origin-when-cross-origin",
    permissionsPolicy: {
      geolocation: [],
      microphone: [],
      camera: [],
      payment: [],
    },
    strictTransportSecurity: {
      maxAge: 31536000,
      includeSubDomains: true,
    },
  },

  // ===== MONITORING =====
  monitoring: {
    // Log retention
    logRetentionDays: 7,
    maxLogs: 10000,

    // Alert thresholds
    alerts: {
      suspiciousActivityThreshold: 10, // Events per hour
      blockedRequestsThreshold: 50, // Blocked requests per hour
      highThreatScoreThreshold: 75,
    },
  },

  // ===== WHITELISTS =====
  whitelist: {
    // IPs that bypass rate limiting (if needed)
    ips: [
      // Add trusted IPs here
    ],

    // Paths that bypass some security checks
    paths: ["/api/health", "/api/status"],
  },
};

export default SECURITY_CONFIG;
