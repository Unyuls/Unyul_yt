export interface EnvValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateEnvironment(): EnvValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const required = ["YOUTUBE_API_KEY"];

  required.forEach((key) => {
    if (!process.env[key]) {
      errors.push(`Missing required environment variable: ${key}`);
    }
  });

  if (process.env.NODE_ENV === "production") {
    if (!process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://")) {
      warnings.push("Site URL should use HTTPS in production");
    }
    if (
      process.env.YOUTUBE_API_KEY === "test" ||
      process.env.YOUTUBE_API_KEY === "development"
    ) {
      errors.push("Using development API key in production!");
    }
  }

  const exposedPatterns = [
    {
      key: "NEXT_PUBLIC_",
      message:
        "Environment variables starting with NEXT_PUBLIC_ are exposed to the browser",
    },
  ];

  Object.keys(process.env).forEach((key) => {
    exposedPatterns.forEach((pattern) => {
      if (key.startsWith(pattern.key) && key.includes("SECRET")) {
        warnings.push(
          `${key}: ${pattern.message} - should not contain secrets!`,
        );
      }
    });
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function getSafeEnvInfo() {
  return {
    nodeEnv: process.env.NODE_ENV,
    nextVersion: process.env.npm_package_version,
    platform: process.platform,
    nodeVersion: process.version,
  };
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

export function validateAndLogEnvironment() {
  const validation = validateEnvironment();
  const safeInfo = getSafeEnvInfo();

  console.log("🔧 Environment Information:");
  console.log(safeInfo);

  if (validation.warnings.length > 0) {
    console.warn("\n⚠️  Environment Warnings:");
    validation.warnings.forEach((warning) => {
      console.warn(`  - ${warning}`);
    });
  }

  if (!validation.isValid) {
    console.error("\n❌ Environment Validation Failed:");
    validation.errors.forEach((error) => {
      console.error(`  - ${error}`);
    });

    if (isProduction()) {
      throw new Error("Environment validation failed in production!");
    }
  } else {
    console.log("\n✅ Environment validation passed");
  }

  return validation;
}

export default {
  validate: validateEnvironment,
  getSafeInfo: getSafeEnvInfo,
  isProduction,
  isDevelopment,
  validateAndLog: validateAndLogEnvironment,
};
