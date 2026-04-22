import rateLimit from "express-rate-limit";

/**
 * 🌍 Global limiter
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});

/**
 * 🔐 Auth limiter (STRICT)
 */
export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 5, // 🔥 prevent brute force
  message: {
    success: false,
    message: "Too many login attempts, try later",
  },
});