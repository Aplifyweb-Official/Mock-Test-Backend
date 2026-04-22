import express from "express";
import { register, login } from "./auth.controller.js";
import { protect, authorize } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.js";
import { registerSchema, loginSchema } from "./auth.validation.js";
import { authLimiter } from "../../middlewares/rateLimiter.js";
import type { Request, Response } from "express";

const router = express.Router();

// 🔓 Public routes
router.post("/register", validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);

// 🔐 Protected route
router.get(
  "/profile",
  protect,
  (req: Request & { user?: any }, res: Response) => {
    res.json({
      success: true,
      message: "Profile fetched successfully",
      data: req.user,
    });
  }
);

// 🔒 Admin only
router.get(
  "/admin",
  protect,
  authorize("super-admin"),
  (_req: Request, res: Response) => {
    res.json({
      success: true,
      message: "Welcome Admin",
    });
  }
);

export default router;