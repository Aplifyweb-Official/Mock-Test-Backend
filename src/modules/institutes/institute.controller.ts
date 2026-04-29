import type {
  Request,
  Response,
} from "express";

import { asyncHandler }
from "../../shared/utils/asyncHandler.js";

import Institute from "./institute.model.js";

export const getMyInstitute =
  asyncHandler(
    async (
      req: Request & { user?: any },
      res: Response
    ) => {

      const institute =
        await Institute.findOne({
          ownerId: req.user.userId,
        });

      res.json({
        success: true,
        data: institute,
      });
    }
  );

  export const updateInstitute =
  asyncHandler(
    async (
      req: Request & { user?: any },
      res: Response
    ) => {

      const institute =
        await Institute.findOne({
          ownerId: req.user.userId,
        });

      if (!institute) {
        return res.status(404).json({
          success: false,
          message: "Institute not found",
        });
      }

      institute.name =
        req.body.name || institute.name;

      institute.email =
        req.body.email || institute.email;

      institute.address =
        req.body.address || institute.address;

      institute.registrationNumber =
        req.body.registrationNumber ||
        institute.registrationNumber;

      await institute.save();

      res.json({
        success: true,
        message:
          "Institute updated successfully",
        data: institute,
      });
    }
  );