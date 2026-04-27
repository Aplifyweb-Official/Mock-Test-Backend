import express from "express";
import {
  registerInstitute,
  login,
  logout,
} from "./auth.controller.js";
import { protect, authorize } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.js";
import { registerSchema, loginSchema } from "./auth.validation.js";
import { authLimiter } from "../../middlewares/rateLimiter.js";

const router = express.Router();
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

router.post("/logout", protect, logout);

router.get("/profile", protect, (req: any, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});

router.get(
  "/admin",
  protect,
  authorize("super-admin"),
  (_req, res) => {
    res.json({ success: true });
  }
);

export default router;