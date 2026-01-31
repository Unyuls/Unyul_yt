/**
 * NEXT.JS CONFIG WITH SECURITY ENHANCEMENTS
 * Enhanced Next.js configuration with security headers and optimizations
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Strict mode for better error handling
  reactStrictMode: true,

  // Security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: [
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
          },
          // Prevent clickjacking
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          // Prevent MIME type sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // XSS Protection
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // Referrer Policy
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Permissions Policy
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=(), payment=()",
          },
          // Hide powered by header
          {
            key: "X-Powered-By",
            value: "Unknown",
          },
        ],
      },
    ];
  },

  // Image optimization configuration
  images: {
    domains: [
      "i.ytimg.com", // YouTube thumbnails
      "yt3.googleusercontent.com", // YouTube profile images
    ],
    formats: ["image/webp", "image/avif"],
  },

  // Redirect HTTP to HTTPS in production
  async redirects() {
    return [
      // Add custom redirects here if needed
    ];
  },

  // Environment variable validation
  env: {
    SITE_NAME: "Unyul Web",
  },

  // Experimental features
  experimental: {
    // Add experimental features here if needed
  },

  // Disable X-Powered-By header
  poweredByHeader: false,

  // Compress responses
  compress: true,

  // Generate etags
  generateEtags: true,

  // Page extensions
  pageExtensions: ["tsx", "ts", "jsx", "js"],
};

export default nextConfig;
