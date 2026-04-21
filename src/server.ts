import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.ts";

dotenv.config();

// connect database
connectDB();

const PORT = process.env.PORT || 5000;

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});