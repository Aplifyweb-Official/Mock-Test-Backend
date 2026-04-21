import express from "express";
import dotenv from "dotenv";
import cors from "cors";
<<<<<<< HEAD:src/server.js
=======
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js"; // ✅ added
>>>>>>> duckb:server.js

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ connect routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});