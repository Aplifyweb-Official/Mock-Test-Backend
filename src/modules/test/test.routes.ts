import express from "express";
import {
  createTestController,
  getTestsController,
  getTestController,
} from "./test.controller.ts";

import { protect, authorize } from "../../middlewares/auth.middleware.ts";
import { validate } from "../../middlewares/validate.ts";
import { testSchema } from "./test.validation.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";

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