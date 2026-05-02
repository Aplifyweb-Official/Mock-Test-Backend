import ExamAttempt
from "./attempt.model.js";

import Test
from "../tests/test.model.js";

import Question
from "../questions/question.model.js";

import {
  AppError
} from "../../shared/utils/AppError.js";

export const startExamAttempt =
async (

  studentId: string,

  testId: string,

  instituteId: string
) => {

  // ✅ FIND TEST
  const test =
    await Test.findById(
      testId
    );

  if (!test) {

    throw new AppError(
      "Test not found",
      404
    );
  }

  // 🚨 PREVENT MULTIPLE ACTIVE ATTEMPTS
  const existingAttempt =
    await ExamAttempt.findOne({

      studentId,

      testId,

      status:
        "in-progress",
    });

  if (existingAttempt) {

    return existingAttempt;
  }

  // ✅ COUNT QUESTIONS
  const totalQuestions =
    await Question.countDocuments({

      testId:
        test._id,
    });

  // ✅ CREATE ATTEMPT
  const attempt =
    await ExamAttempt.create({

      studentId,

      instituteId,

      testId,

      status:
        "in-progress",

      startedAt:
        new Date(),

      totalQuestions,

      answers: [],
    });

  return attempt;
};