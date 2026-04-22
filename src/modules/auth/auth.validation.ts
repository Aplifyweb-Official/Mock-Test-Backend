import { z } from "zod";

/**
 * 🔐 Strong password regex
 * - min 6 chars
 * - at least 1 letter + 1 number
 */
const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d).+$/,
    "Password must contain at least one letter and one number"
  );

/**
 * 👤 Allowed roles
 */
const roleEnum = z.enum(["student", "institute", "super-admin"]);

/**
 * ✅ Register Schema (PRODUCTION)
 */
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name too long")
      .trim(),

    email: z
      .string()
      .email("Invalid email")
      .toLowerCase()
      .trim(),

    password: passwordSchema,

    role: roleEnum.optional(),
  })
  .strict(); // ❗ prevents extra fields

/**
 * ✅ Login Schema (PRODUCTION)
 */
export const loginSchema = z
  .object({
    email: z
      .string()
      .email("Invalid email")
      .toLowerCase()
      .trim(),

    password: z.string().min(1, "Password is required"),
  })
  .strict();