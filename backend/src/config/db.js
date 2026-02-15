import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
    // لو متصل بالفعل، متحاولش تتصل تاني
    if (isConnected && mongoose.connection.readyState === 1) {
        console.log("Using existing MongoDB connection ✅");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            minPoolSize: 2,
        });
        
        isConnected = db.connections[0].readyState === 1;
        console.log("MongoDB connected ✅");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        isConnected = false;
        throw error;
    }
};