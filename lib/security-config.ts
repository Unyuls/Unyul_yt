export const SECURITY_CONFIG = {
  rateLimit: {
    api: {
      windowMs: 60000,
      maxRequests: 60,
    },

    auth: {
      windowMs: 60000,
      maxRequests: 5,
    },

    upload: {
      windowMs: 60000,
      maxRequests: 10,
    },

    ban: {
      threshold: 5,
      duration: 3600000,
    },
  },

  contentSecurity: {
    maxLength: {
      comment: 1000,
      message: 500,
      bio: 200,
      url: 2048,
    },

    upload: {
      maxFileSize: 10 * 1024 * 1024,
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

    threats: {
      blockThreshold: 50,
      warnThreshold: 25,
    },
  },

  ddos: {
    maxConnectionsPerIP: 100,

    burstDetection: {
      windowMs: 1000,
      maxBurst: 20,
    },

    autoBan: true,
    autoBanDuration: 86400000,
  },

  blocklist: {
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

    blockedUserAgents: [
      "scrapy",
      "nutch",
      "bot",
      "crawler",
      "spider",
      "!googlebot",
      "!bingbot",
      "!yandex",
      "!duckduckbot",
    ],
  },

  headers: {
    csp: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
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
        "https://youtu.be",
      ],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      upgradeInsecureRequests: [],
    },

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

  monitoring: {
    logRetentionDays: 7,
    maxLogs: 10000,

    alerts: {
      suspiciousActivityThreshold: 10,
      blockedRequestsThreshold: 50,
      highThreatScoreThreshold: 75,
    },
  },

  whitelist: {
    ips: [],
    paths: ["/api/health", "/api/status"],
  },
};

export default SECURITY_CONFIG;
