import express from "express";
import { register, login } from "./auth.controller.ts";
import { protect, authorize } from "../../middlewares/auth.middleware.ts";

const router = express.Router();

// 🔓 Public routes
router.post("/register", register);
router.post("/login", login);

// 🔐 Protected route (any logged-in user)
router.get("/profile", protect, (req: any, res) => {
  res.json({
    success: true,
    message: "Profile fetched successfully",
    user: req.user,
  });
});

// 🔒 Admin only route
router.get(
  "/admin",
  protect,
  authorize("super-admin"),
  (req: any, res) => {
    res.json({
      success: true,
      message: "Welcome Admin",
    });
  }
);

export default router;