import { z } from "zod";

const questionSchema = z
  .object({
    question: z.string().trim().min(1, "Question is required"),

    options: z
      .array(z.string().trim().min(1, "Option cannot be empty"))
      .min(2, "At least 2 options required"),

    correctAnswer: z.string().trim().min(1, "Correct answer is required"),

    marks: z.number().min(1, "Marks must be at least 1").optional(),
  })
  .refine((data) => data.options.includes(data.correctAnswer), {
    message: "Correct answer must match one of the options",
    path: ["correctAnswer"],
  });

export const testSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),

  duration: z
  .number()
  .refine((val) => !isNaN(val), {
    message: "Duration must be a number",
  })
  .min(1, "Duration must be greater than 0"),

  totalMarks: z
    .number({ message: "Total marks must be a number" })
    .min(1, "Total marks must be greater than 0"),

  questions: z
    .array(questionSchema)
    .min(1, "At least one question is required"),
});