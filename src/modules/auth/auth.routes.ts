import express from "express";
import { register, login } from "./auth.controller.ts";
import { protect, authorize } from "../../middlewares/auth.middleware.ts";
import { validateRegister, validateLogin } from "./auth.validation.ts";

const router = express.Router();

// 🔓 Public routes
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

// 🔐 Protected route
router.get("/profile", protect, (req: any, res) => {
  res.json({
    success: true,
    message: "Profile fetched successfully",
    user: req.user,
  });
});

// 🔒 Admin only
router.get("/admin", protect, authorize("super-admin"), (req: any, res) => {
  res.json({
    success: true,
    message: "Welcome Admin",
  });
});

export default router;