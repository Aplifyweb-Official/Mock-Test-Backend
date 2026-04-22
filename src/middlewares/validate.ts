import { ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodType) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsedData = schema.parse(req.body);

      req.body = parsedData; // ✅ sanitized & validated

      next();
    } catch (err) {
      next(err); // handled by global error middleware
    }
  };