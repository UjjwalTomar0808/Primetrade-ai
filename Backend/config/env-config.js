import dotenv from "dotenv";

dotenv.config();

export const ENV_CONFIG = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 8080,

  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  CORS_ORIGIN: process.env.CORS_ORIGIN,

  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS) || 12,
};
