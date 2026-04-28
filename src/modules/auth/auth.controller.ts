import type { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "./auth.service.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";


export const registerInstitute = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const { user, token } = await registerUser(
      name,
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