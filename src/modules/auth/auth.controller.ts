import type { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  resetPassword,
  changePassword,
} from "./auth.service.js";
import bcrypt from "bcrypt";

import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { forgotPassword } from "./auth.service.js";
import User from "../users/user.model.js";

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

export const changePasswordController =
  async (
    req: Request,
    res: Response
  ) => {

    try {


      const userId =
        (req as Request & {
          user?: any
        }).user?.userId;


      const user =
        await User.findById(
          userId
        ).select("+password");


      if (!user) {

        return res.status(404).json({
          message: "User not found",
        });
      }

      const {
        currentPassword,
        newPassword
      } = req.body;


      const isMatch =
        await bcrypt.compare(
          currentPassword,
          user.password
        );


      if (!isMatch) {

        return res.status(400).json({
          message:
            "Current password incorrect",
        });
      }

      user.password =
        await bcrypt.hash(
          newPassword,
          10
        );

      user.mustChangePassword =
        false;

      await user.save();



      res.status(200).json({
        success: true,
        message:
          "Password updated successfully",
      });

    } catch (error: any) {




      res.status(500).json({
        success: false,
        message:
          error.message || "Server Error",
      });
    }
  };