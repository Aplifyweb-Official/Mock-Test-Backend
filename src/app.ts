import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "mongo-sanitize";
import xss from "xss-clean";

import authRoutes from "./modules/auth/auth.routes.ts";
import testRoutes from "./modules/test/test.routes.ts";
import attemptRoutes from "./modules/attempt/attempt.routes.ts";
import { errorHandler } from "./middlewares/error.middleware.ts";

const app = express();

/**
 * 🔐 SECURITY MIDDLEWARES
 */

// 1. Secure headers
app.use(helmet());

// 2. Rate limiting (global)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// 3. CORS
app.use(
  cors({
    origin: "*", // ⚠️ change in production
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
app.use("/api/tests", testRoutes);
app.use("/api/attempts", attemptRoutes);

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