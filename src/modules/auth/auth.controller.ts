import type { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";

export const register = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password , role } = req.body;

    const user = await registerUser(name, email, password ,role);

    res.status(201).json({
      success: true,
      data: user,
    });
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const { user, token } = await loginUser(email, password);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user,
        token,
      },
    });
  }
);