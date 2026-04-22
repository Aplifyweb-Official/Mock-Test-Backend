import express from "express";
import { submitAttemptController } from "./attempt.controller.ts";
import { protect } from "../../middlewares/auth.middleware.ts";

const router = express.Router();

// 🔐 Student submits test
router.post("/", protect, submitAttemptController);


export default router;