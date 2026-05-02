import { z } from "zod";
import mongoose from "mongoose";

export const createStudentSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50)
    .trim(),

  email: z
    .string()
    .email("Invalid email")
    .toLowerCase()
    .trim(),

  batchId: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid batchId",
    }),
    
  // 🔥 FIX: Ye dono fields add karni padengi kyunki tera service inko maang raha hai
  username: z.string().min(3, "Username is required").trim(),
  password: z.string().min(6, "Password must be at least 6 characters"),
}).strict();