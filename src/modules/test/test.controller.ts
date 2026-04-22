import type { Request, Response } from "express";
import {
  createTest,
  getAllTests,
  getTestById,
} from "./test.service.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";

export const createTestController = asyncHandler(
  async (req: Request, res: Response) => {
    const test = await createTest(req.body);

    res.status(201).json({
      success: true,
      data: test,
    });
  }
);

export const getTestsController = asyncHandler(
  async (_req: Request, res: Response) => {
    const tests = await getAllTests();

    res.json({
      success: true,
      data: tests,
    });
  }
);

export const getTestController = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const test = await getTestById(req.params.id);

    res.json({
      success: true,
      data: test,
    });
  }
);