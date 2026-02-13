import mongoose from "mongoose";
import { ENV_CONFIG } from "./env-config.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV_CONFIG.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB Disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error(`MongoDB Error: ${err.message}`);
});
