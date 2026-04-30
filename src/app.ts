import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "mongo-sanitize";
import { errorHandler } from "./middlewares/error.middleware.js";
import testRoutes from "./modules/tests/test.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import { globalLimiter } from "./middlewares/rateLimiter.js";
import userRoutes from "./modules/users/user.routes.js";
import batchRoutes from "./modules/batches/batch.routes.js";
import instituteRoutes from "./modules/institutes/institute.routes.js";
import questionRoutes from "./modules/questions/question.routes.js";


const app = express();

/**
 * 🔐 SECURITY MIDDLEWARES
 */

// 1. Secure headers
app.use(helmet());

// 2. Rate limiting (global)
app.use(globalLimiter);

// 3. CORS
app.use(
  cors({
    origin: "http://localhost:5173", // ⚠️ change in production
    credentials: true,
  })
);

// 4. Body parser (limit size)
app.use(express.json({ limit: "10kb" }));

// 5. NoSQL Injection Protection (SAFE VERSION)
app.use((req, _res, next) => {
  req.body = mongoSanitize(req.body); // ✅ only body
  next();
});


/**
 * 🚀 ROUTES
 */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/institute", instituteRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/questions", questionRoutes);

/**
 * 🧪 HEALTH CHECK
 */
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running...",
  });
});

/**
 * ❌ GLOBAL ERROR HANDLER (ALWAYS LAST)
 */
app.use(errorHandler);

export default app;