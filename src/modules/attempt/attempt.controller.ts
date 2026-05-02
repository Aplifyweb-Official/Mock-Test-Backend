import type {
  Request,
  Response
}
from "express";

import {
  asyncHandler
}
from "../../shared/utils/asyncHandler.js";

import {
  startExamAttempt
}
from "./attempt.service.js";

export const startAttemptController =
asyncHandler(

  async (

    req: Request & {
      user?: any
    },

    res: Response
  ) => {

    const {
      testId
    } = req.params;

    const attempt =
      await startExamAttempt(

        req.user.userId,

        testId as string,

        req.user.instituteId
      );

    res.status(201).json({

      success: true,

      message:
        "Exam started successfully",

      data:
        attempt,
    });
  }
);