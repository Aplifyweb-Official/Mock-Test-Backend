import type{ Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { submitAttempt } from "./attempt.service.js";


export const submitAttemptController = asyncHandler (
  async (req: any, res: Response) => {
    const userId = req.user.id;
    const { testId, answers } = req.body;

    const attempt = await submitAttempt(userId, testId, answers);

    res.json({
      success: true,
      message: "Test submitted",
      data: {
        score: attempt.score,
      },
    });
  }
);