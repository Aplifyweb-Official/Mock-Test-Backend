import express from "express";
import {
  createTestController,
  getTestsController,
  getTestController,
} from "./test.controller.ts";

import { protect, authorize } from "../../middlewares/auth.middleware.ts";
import { validateTest } from "./test.validation.ts";

const router = express.Router();

// 🔐 Create test (admin only)
router.post(
  "/",
  protect,
  authorize("super-admin", "institute"),
  validateTest,
  createTestController
);

// 🔓 Get all tests (public)
router.get("/", getTestsController);

// 🔓 Get single test
router.get("/:id", getTestController);

export default router;