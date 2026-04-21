import mongoose from "mongoose";

console.log("DB file loaded..."); // ✅ check import

const connectDB = async () => {
  console.log("Connecting to DB..."); // ✅ check function call

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("DB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;