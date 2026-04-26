import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { validate } from "../../middlewares/validate.js";
import { signupSchema, loginSchema } from "./auth.validation.js";

const router = Router();

// Test Route
router.get("/test", (req, res) => res.json({ message: "Bhai, Auth Router ekdum zinda hai! 🎉" }));

// Route: POST /api/v1/auth/signup
// Pehle request validate middleware ke paas jayegi, agar pass hui toh controller ke paas
router.post("/signup", validate(signupSchema), AuthController.signup);

// Route: POST /api/v1/auth/login
router.post("/login", validate(loginSchema), AuthController.login);

export const authRoutes = router;