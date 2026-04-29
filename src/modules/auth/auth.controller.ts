import type { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  resetPassword,
} from "./auth.service.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { forgotPassword } from "./auth.service.js";

export const registerInstitute = asyncHandler(
  async (req: Request, res: Response) => {
    const { adminName, instituteName, email, password } = req.body;

    const { user, token } = await registerUser(
      adminName,
      instituteName,
      email,
      password
    );

    res.status(201).json({
      success: true,
      message: "Institute registered",
      data: { user, token }, // ✅ IMPORTANT
    });
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response) => {
    const { identifier, password } = req.body;

    const userAgent = req.headers["user-agent"] || "unknown";

    const { user, token } = await loginUser(
      identifier,
      password,
      userAgent
    );

    res.json({
      success: true,
      data: { user, token },
    });
  }
);

export const logout = asyncHandler(
  async (req: Request & { user?: any }, res: Response) => {
    const authHeader = req.headers.authorization;

    // 🔐 Validate header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    // 🔐 Extra safety (TypeScript + runtime)
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    // 🔐 Ensure user exists (middleware should set this)
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    await logoutUser(req.user.userId, token);

    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  }
);


export const forgotPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const data = await forgotPassword(email);

    res.status(200).json({
      success: true,
      message: "Password reset link generated",
      data,
    });
  }
);


export const resetPasswordController = asyncHandler(
  async (req: Request, res: Response) => {

    const token = req.params.token as string;

    const { password } = req.body;

    const data = await resetPassword(token, password);

    res.status(200).json({
      success: true,
      ...data,
    });
  }
);