import Attempt from "./attempt.model.js";
import Test from "../test/test.model.js";
import { AppError } from "../../shared/utils/AppError.js";

export const submitAttempt = async (
  userId: string,
  testId: string,
  answers: any[]
) => {
  const test = await Test.findById(testId);

  if (!test) {
    throw new AppError("Test not found", 404);
  }

  // prevent multiple attempts
  const existing = await Attempt.findOne({ userId, testId });
  if (existing) {
    throw new AppError("You already attempted this test", 400);
  }

  let score = 0;

  answers.forEach((ans) => {
    const question = test.questions.id(ans.questionId);

    if (question && question.correctAnswer === ans.selectedAnswer) {
      score += question.marks;
    }
  });


  const attempt = await Attempt.create({
    userId,
    testId,
    answers,
    score,
  });

  return attempt;
};