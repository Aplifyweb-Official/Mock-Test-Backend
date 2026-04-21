import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.ts";

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;