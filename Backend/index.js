import express from "express";
import { ENV_CONFIG } from "./config/env-config.js";
import { connectDB } from "./config/db-config.js";
import { globalMiddleware as middleware } from "./middleware/index.js";

const app = express();
const PORT = ENV_CONFIG.PORT;

// Apply middleware
middleware(app);

// Connect to database and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Environment: ${ENV_CONFIG.NODE_ENV}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
