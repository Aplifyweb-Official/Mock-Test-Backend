/**
 * Custom Error Class for standardizing API Errors.
 * Use this to throw errors anywhere in your services or controllers.
 */
export class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public success: boolean;

  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    stack = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.success = false; // Always false for errors

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}