import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

// Set global Mongoose configuration to prevent timeout errors
mongoose.set('bufferMaxEntries', 0);
mongoose.set('bufferCommands', false);

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 30000, // Increased from 10000 to 30000
            socketTimeoutMS: 45000, // Keep socket timeout at 45 seconds
            bufferMaxEntries: 0, // Disable buffering
            bufferCommands: false, // Disable buffering
        });
        console.log("MongoDB connected ✅");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}
