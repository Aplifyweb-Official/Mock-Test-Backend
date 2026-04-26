import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongo
    URI = process.env.MONGO_URI;

    // 🔒 Validate env
    if (!mongoURI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ DB connection failed:", (error as Error).message);

    // 🔥 Exit process (important for production)
    process.exit(1);
  }
};
