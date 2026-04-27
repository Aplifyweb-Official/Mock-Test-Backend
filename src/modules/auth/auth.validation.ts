import { z } from "zod";

/**
 * 🔐 Strong password regex
 */
const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d).+$/,
    "Password must contain at least one letter and one number"
  );

/**
 * 👤 Username rules
 */
const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username too long")
  .regex(
    /^[a-z0-9_]+$/,
    "Username can only contain lowercase letters, numbers, and underscores"
  )
  .transform((val) => val.toLowerCase());

/**
 * ✅ Register Institute Schema
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

    username: usernameSchema,

    password: passwordSchema,
  })
  .strict();

/**
 * ✅ Login Schema (email OR username)
 */
export const loginSchema = z
  .object({
    identifier: z
      .string()
      .min(3, "Identifier is required")
      .transform((val) => val.toLowerCase().trim()),

    password: z.string().min(1, "Password is required"),
  })
  .strict();