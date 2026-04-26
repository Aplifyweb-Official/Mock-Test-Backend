import { Request, Response, NextFunction } from 'express';

/**
 * Type definition for our async controller functions
 */
type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

/**
 * Wrapper function to catch asynchronous errors in controllers.
 * Passes the error to the global error handling middleware automatically.
 */
export const catchAsync = (fn: AsyncRequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};