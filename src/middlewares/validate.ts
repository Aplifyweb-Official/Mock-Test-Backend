import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { ApiError } from '../shared/utils/ApiError.js';

/**
 * Zod Validation Middleware
 */
export const validate = (schema: z.ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Fix: TS strict mode ke liye issue.path ko forcefully String me convert kiya
        const errorMessages = error.issues.map((issue) => {
          const path = issue.path.map(String).join('.'); // 'body.email' format
          return `${path}: ${issue.message}`;
        });
        
        next(new ApiError(400, `Validation Failed -> ${errorMessages.join(' | ')}`));
      } else {
        next(error);
      }
    }
  };
};