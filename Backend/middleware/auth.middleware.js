import { verifyToken } from "../helpers/jwt.helper.js";
import { ApiError, asyncHandler } from "../helpers/error.helper.js";
import User from "../models/User.js";

// Middleware to verify JWT token and authenticate user
export const authenticate = asyncHandler(async (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(
      401,
      "No token provided. Please login to access this resource"
    );
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "Invalid token format");
  }

  try {
    // Verify token
    const decoded = verifyToken(token);

    // Get user from database
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      throw new ApiError(401, "User not found. Token is invalid");
    }

    if (!user.isActive) {
      throw new ApiError(403, "Account is deactivated. Please contact support");
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(401, error.message || "Authentication failed");
  }
});

// Middleware to check if user is admin
export const isAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Please authenticate first");
  }

  if (req.user.role !== "admin") {
    throw new ApiError(403, "Access denied. Admin privileges required");
  }

  next();
});

// Optional authentication - doesn't throw error if no token, Useful for routes that work with or without authentication
export const optionalAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId).select("-password");

      if (user && user.isActive) {
        req.user = user;
      }
    } catch (error) {
      // Silently fail - user remains unauthenticated
    }
  }

  next();
});
