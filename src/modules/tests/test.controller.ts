import type {
  Request,
  Response,
} from "express";

import { asyncHandler }
from "../../shared/utils/asyncHandler.js";

import {
  createTest,
  getTestsByInstitute,
  getSingleTest,
  updateTest,
  deleteTest,
} from "./test.service.js";

// CREATE TEST
export const createTestController =
asyncHandler(
  async (
    req: Request & {
      user?: any
    },

    res: Response
  ) => {

    const instituteId =
      req.user?.instituteId;

    const createdBy =
      req.user?.userId;

    const test =
      await createTest(
        req.body,
        instituteId,
        createdBy
      );

    res.status(201).json({
      success: true,

      message:
        "Test created successfully",

      data: test,
    });
  }
);

// GET ALL TESTS
export const getTestsController =
asyncHandler(
  async (
    req: Request & {
      user?: any
    },

    res: Response
  ) => {

    const instituteId =
      req.user?.instituteId;

    const tests =
      await getTestsByInstitute(
        instituteId
      );

    res.json({
      success: true,
      data: tests,
    });
  }
);

// GET SINGLE TEST
export const getSingleTestController =
asyncHandler(
  async (
    req: Request & {
      user?: any
    },

    res: Response
  ) => {

    const instituteId =
      req.user?.instituteId;

    const test =
      await getSingleTest(
        req.params.id as string,
        instituteId
      );

    res.json({
      success: true,
      data: test,
    });
  }
);

// UPDATE TEST
export const updateTestController =
asyncHandler(
  async (
    req: Request & {
      user?: any
    },

    res: Response
  ) => {

    const instituteId =
      req.user?.instituteId;

    const test =
      await updateTest(
        req.params.id as string,
        instituteId,
        req.body
      );

    res.json({
      success: true,

      message:
        "Test updated successfully",

      data: test,
    });
  }
);

// DELETE TEST
export const deleteTestController =
asyncHandler(
  async (
    req: Request & {
      user?: any
    },

    res: Response
  ) => {

    const instituteId =
      req.user?.instituteId;

    await deleteTest(
      req.params.id as string,
      instituteId
    );

    res.json({
      success: true,

      message:
        "Test deleted successfully",
    });
  }
);