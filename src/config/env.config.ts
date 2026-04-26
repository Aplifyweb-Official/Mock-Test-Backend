import dotenv from "dotenv";
import { z } from "zod";

// .env file ko load karo
dotenv.config();

// Zod Schema for strict validation
const envSchema = z.object({
  PORT: z.string().default("5000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  MONGO_URI: z.string().min(1, "MongoDB URI is strictly required!"),
  JWT_SECRET: z
    .string()
    .min(10, "JWT Secret must be at least 10 characters long!"),
  JWT_EXPIRES_IN: z.string().default("7d"),
});

// Validate the process.env against our schema
const envVars = envSchema.safeParse(process.env);

if (!envVars.success) {
  console.error("❌ Invalid Environment Variables:");
  console.error(envVars.error.format());
  process.exit(1); // Server ko turant band kar do agar variables galat hain
}

// Export the validated variables safely
export const ENV = envVars.data;
