import { z } from "zod";

export const testSchema = z.object({
  title: z.string().min(1, "Title is required"),
  duration: z.number().min(1, "Duration must be greater than 0"),
  totalMarks: z.number().min(1, "Total marks must be greater than 0"),

  questions: z
    .array(
      z.object({
        question: z.string().min(1, "Question is required"),
        options: z
          .array(z.string().min(1))
          .min(2, "At least 2 options required"),
        correctAnswer: z.string().min(1, "Correct answer is required"),
        marks: z.number().min(1).optional(),
      })
    )
    .min(1, "At least one question is required"),
});