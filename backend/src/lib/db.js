import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// تحميل متغيرات البيئة من الملف الصحيح
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const connectDB = async () => {
  try {
    // طباعة للتأكد من قيمة MONGO_URI
    console.log("Attempting to connect with URI:", process.env.MONGO_URI);

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from environment variables");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connected successfully to: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("MongoDB connection error details:", {
      message: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

export default connectDB;
