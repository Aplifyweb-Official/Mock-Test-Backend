import express from "express";
import { register, login } from "./auth.controller.js";
import { protect, authorize } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.js";
import { registerSchema, loginSchema } from "./auth.validation.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = express.Router();

// 🔓 Public routes
router.post("/register", validate(registerSchema), asyncHandler(register));
router.post("/login", validate(loginSchema), asyncHandler(login));

// 🔐 Protected route
router.get(
  "/profile",
  protect,
  asyncHandler((req: any, res) => {
    res.json({
      success: true,
      message: "Profile fetched successfully",
      user: req.user,
    });
  })
);

// 🔒 Admin only
router.get(
  "/admin",
  protect,
  authorize("super-admin"),
  asyncHandler((req: any, res) => {
    res.json({
      success: true,
      message: "Welcome Admin",
    });
  })
);

export default router;