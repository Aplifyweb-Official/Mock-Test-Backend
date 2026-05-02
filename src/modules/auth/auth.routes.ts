import express from "express";
import {
  registerInstitute,
  login,
  logout,
  resetPasswordController,
  changePasswordController
} from "./auth.controller.js";
import { protect, authorize } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.js";
import { registerSchema, loginSchema, resetPasswordSchema, changePasswordSchema } from "./auth.validation.js";
import { authLimiter } from "../../middlewares/rateLimiter.js";
import { forgotPasswordController } from "./auth.controller.js";
import { forgotPasswordSchema } from "./auth.validation.js";
import User from "../users/user.model.js";

const router = express.Router();

// 🔓 PUBLIC
router.post(
  "/register-institute",
  validate(registerSchema),
  registerInstitute
);

router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  login
);

// 🔐 AUTHENTICATED (ALL ROLES)
router.post(
  "/logout",
  protect,
  authorize("institute", "student", "super-admin"),
  logout
);

router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  forgotPasswordController
);

router.post(
  "/reset-password/:token",
  validate(resetPasswordSchema),
  resetPasswordController
);

router.post(

  "/change-password",

  protect,

  authorize(
    "student",
    "institute",
    "super-admin"
  ),


  changePasswordController
);
router.get(
  "/profile",
  protect,
  authorize("institute", "student", "super-admin"),
  async (req: any, res) => {

    const user = await User.findById(
      req.user.userId
    ).select("-password");

    res.json({
      success: true,
      data: user,
    });
  }
);

router.patch(
  "/profile",
  protect,
  authorize("institute", "student", "super-admin"),

  async (req: any, res) => {

    const user = await User.findById(
      req.user.userId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  }
);

// 🔒 SUPER ADMIN ONLY
router.get(
  "/admin",
  protect,
  authorize("super-admin"),
  (_req, res) => {
    res.json({ success: true });
  }
);

export default router;