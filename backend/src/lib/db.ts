import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from environment variables");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB connected successfully to: ${conn.connection.host}`);
    return conn;
  } catch (error: any) {
    console.error("MongoDB connection error details:", {
      message: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

export default connectDB;
