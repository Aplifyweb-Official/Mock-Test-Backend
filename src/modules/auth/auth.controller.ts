import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import { ApiResponse } from '../../shared/utils/ApiResponse.js';

export class AuthController {
  
  // ── 1. SIGNUP API ──
  static signup = catchAsync(async (req: Request, res: Response) => {
    // Service ko data pass karo
    const result = await AuthService.signup(req.body);

    // Standard format mein response bhej do
    res.status(201).json(
      new ApiResponse(201, result, 'User registered successfully! 🎉')
    );
  });

  // ── 2. LOGIN API ──
  static login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    // Service ko check karne bhejo
    const result = await AuthService.login(email, password);

    // Standard format mein response bhej do
    res.status(200).json(
      new ApiResponse(200, result, 'Logged in successfully! 🚀')
    );
  });
}