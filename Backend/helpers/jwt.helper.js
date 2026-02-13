import jwt from "jsonwebtoken";
import { ENV_CONFIG } from "../config/env-config.js";

/**
 * Generate JWT token
 * @param {object} payload - Data to encode in token (e.g., user id)
 * @param {string} expiresIn - Token expiration time (default: 7d)
 * @returns {string} - JWT token
 */
export const generateToken = (payload, expiresIn = ENV_CONFIG.JWT_EXPIRES_IN) => {
  try {
    const token = jwt.sign(payload, ENV_CONFIG.JWT_SECRET, {
      expiresIn,
    });
    return token;
  } catch (error) {
    throw new Error("Error generating token");
  }
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {object} - Decoded token payload
 */
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, ENV_CONFIG.JWT_SECRET);
    return decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token expired");
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    }
    throw new Error("Token verification failed");
  }
};