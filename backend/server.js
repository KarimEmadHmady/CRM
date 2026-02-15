import mongoose from "mongoose";
import app from "./src/app.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // Increased from 10000 to 30000
      socketTimeoutMS: 45000, // Keep socket timeout at 45 seconds
      bufferMaxEntries: 0, // Disable buffering
      bufferCommands: false, // Disable buffering
    });

    console.log("MongoDB connected ✅");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server start error:", error);
  }
};

startServer();
