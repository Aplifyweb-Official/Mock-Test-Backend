import jwt from 'jsonwebtoken';
import { User } from '../users/user.model.js';
import { ApiError } from '../../shared/utils/ApiError.js';
import { ENV } from '../../config/env.config.js';

export class AuthService {
  
  // ── Helper Function: Token Generator ──
  private static signToken(userId: string) {
    return jwt.sign({ id: userId }, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_EXPIRES_IN as any, // FIX: TypeScript strictness bypass
    });
  }

  // ── 1. SIGNUP LOGIC ──
  static async signup(userData: any) {
    // Check agar is email se already koi account hai
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new ApiError(400, 'Email is already registered! Please login.');
    }

    // Naya User create karo
    const newUser = await User.create(userData);

    // FIX: ObjectId ko properly string mein convert kiya
    const token = this.signToken(newUser._id.toString());

    // Security: Response bhejte waqt password object se hata do
    newUser.password = undefined;

    return { user: newUser, token };
  }

  // ── 2. LOGIN LOGIC ──
  static async login(email: string, password: string) {
    // Database me user dhundo
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Password check karo
    const isPasswordCorrect = await user.comparePassword(password);
    
    if (!isPasswordCorrect) {
      throw new ApiError(401, 'Invalid email or password');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Your account has been suspended. Please contact SuperAdmin.');
    }

    // FIX: ObjectId ko properly string mein convert kiya
    const token = this.signToken(user._id.toString());

    // Security: Token banne ke baad password response se uda do
    user.password = undefined;

    return { user, token };
  }
}