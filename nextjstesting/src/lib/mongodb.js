import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  try {
    if (isConnected) {
      console.log("MongoDB already connected");
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "nextjstesting", // change this to your database name
    });

    isConnected = conn.connections[0].readyState;

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.log("MongoDB Connection Failed:", error);
  }
}
