import express from "express";
import { submitAttemptController } from "./attempt.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// 🔐 Student submits test
router.post("/", protect, submitAttemptController);


export default router;