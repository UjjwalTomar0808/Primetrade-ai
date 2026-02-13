import express from "express";
import cors from "cors";
import { ENV_CONFIG } from "../config/env-config.js";
import { errorHandler, notFoundHandler } from "../helpers/error.helper.js";

// Import routes
import authRoutes from "../routes/auth.routes.js";
import userRoutes from "../routes/user.routes.js";
import taskRoutes from "../routes/task.routes.js";

export const globalMiddleware = (app) => {
  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS middleware
  app.use(
    cors({
      origin: ENV_CONFIG.CORS_ORIGIN || "http://localhost:3000",
      credentials: true,
    })
  );

  // Request logging middleware
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
    next();
  });

  // Routes middleware
  appRoutesMiddleware(app);

  // Error handling middleware (must be last)
  app.use(notFoundHandler);
  app.use(errorHandler);
};

const appRoutesMiddleware = (app) => {
  // Server running status check route
  app.get("/", (req, res) => {
    res.json({
      success: true,
      message: "Backend API is running",
      environment: ENV_CONFIG.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  });

  // API v1 routes
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/tasks", taskRoutes);
};
