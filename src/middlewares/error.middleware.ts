import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../shared/utils/ApiError.js';
import { ENV } from '../config/env.config.js';

/**
 * Global Error Handler Middleware
 * Ye har us error ko catch karega jo catchAsync ya pure system se throw hogi.
 */
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default values agar normal error aati hai
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // 1. Agar error humari custom ApiError hai, toh usko wese hi use karo
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } 
  // 2. Mongoose Bad ObjectId Error (Jab galat ID database me search ho)
  else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found. Invalid: ${err.path}`;
  }
  // 3. Mongoose Duplicate Key Error (Jaise same email se 2 baar signup karna)
  else if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value entered: ${field}. Please use another value.`;
  }
  // 4. Mongoose Validation Error (Zod se pehle DB ki strict checking)
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map((el: any) => el.message);
    message = `Invalid input data. ${errors.join('. ')}`;
  }
  // 5. JWT Error (Jab login token galat ho)
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid Token. Please log in again.';
  }
  // 6. JWT Expired Error (Jab token ka time khatam ho jaye)
  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your token has expired. Please log in again.';
  }

  // Final Response Send to Frontend
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    // Development mode me hum error ka pura stack (file name, line number) bhejenge, Production me chupa lenge
    stack: ENV.NODE_ENV === 'development' ? err.stack : undefined,
  });
};