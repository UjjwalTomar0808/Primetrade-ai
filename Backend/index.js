import express from "express";
import { ENV_CONFIG } from "./config/env-config.js";
import { connectDB } from "./config/db-config.js";
import { globalMiddleware as middleware } from "./middleware/index.js";
import path from "path";

const app = express();
const PORT = ENV_CONFIG.PORT;

// Apply middleware
middleware(app);
const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

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
