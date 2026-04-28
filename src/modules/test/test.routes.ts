import express from "express";
import {
  createTestController,
  getTestsController,
  getTestController,
} from "./test.controller.js";

import { protect, authorize } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.js";
import { testSchema } from "./test.validation.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";

const router = express.Router();

// 🔐 Create test (admin only)
router.post(
  "/",
  protect,
  authorize("super-admin", "institute"),
  validate(testSchema),
  asyncHandler(createTestController)
);

// 🔓 Get all tests (public)
router.get("/", asyncHandler(getTestsController));

// 🔓 Get single test
router.get("/:id", asyncHandler(getTestController));

export default router;