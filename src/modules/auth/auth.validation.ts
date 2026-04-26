import { z } from 'zod';

// ── 1. Signup Validation Schema ──
export const signupSchema = z.object({
  body: z.object({
    name: z
      .string({ message: 'Name is strictly required' })
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters'),
    email: z
      .string({ message: 'Email is strictly required' })
      .email('Invalid email address format'),
    password: z
      .string({ message: 'Password is strictly required' })
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    role: z
      .enum(['SuperAdmin', 'InstituteAdmin', 'Student'], {
        message: 'Role must be SuperAdmin, InstituteAdmin, or Student',
      }),
    instituteId: z.string().optional(), // Student ya InstAdmin ke case me aayega
    batchId: z.string().optional(),     // Sirf student ke case me aayega
  }),
});

// ── 2. Login Validation Schema ──
export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ message: 'Email is strictly required' })
      .min(1, 'Email cannot be empty')
      .email('Invalid email address format'),
    password: z
      .string({ message: 'Password is strictly required' })
      .min(1, 'Password cannot be empty'),
  }),
});