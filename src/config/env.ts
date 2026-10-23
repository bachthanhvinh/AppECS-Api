import dotenv from "dotenv";

dotenv.config();

function checkRequiredEnvVariables(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing env variables for ${key}`);
  }

  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 8017),
  isProduction: (process.env.NODE_ENV ?? "development") === "production",
  nodeEnv: process.env.NODE_ENV ?? "development",
  logLevel: process.env.LOG_LEVEL ?? "info",
  databaseUrl: checkRequiredEnvVariables("DATABASE_URL"),
  jwtAccessSecret: checkRequiredEnvVariables("ACCESS_TOKEN_SECRET_SIGNATURE"),
  jwtAccessExpiresIn: checkRequiredEnvVariables("ACCESS_TOKEN_LIFE"),
  jwtRefreshSecret: checkRequiredEnvVariables("REFRESH_TOKEN_SECRET_SIGNATURE"),
  jwtRefreshExpiresIn: checkRequiredEnvVariables("REFRESH_TOKEN_LIFE"),
} as const;
