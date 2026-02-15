import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    // Check if running locally
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () =>
        console.log(`Server running on port ${PORT}`)
      );
    }
  } catch (error) {
    console.error("Server start error:", error);
  }
};

// للـ Vercel Serverless
export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Handler error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
}

// للـ Local Development
if (process.env.NODE_ENV !== 'production') {
  startServer();
}