import type { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { createStudentUser, deleteStudentByInstitute, getStudentsByInstitute, updateStudentByInstitute } from "./user.service.js";
import { generateUsername } from "../../shared/utils/generateUsername.js";
import { AppError } from "../../shared/utils/AppError.js";
import bcrypt from "bcrypt";
import User from "./user.model.js";
import * as XLSX from "xlsx";
import { generateUniqueUsername } from "../../shared/utils/username.util.js";
import Batch from "../batches/batch.model.js";

export const createStudentController = asyncHandler(
  async (req: Request & { user?: any }, res: Response) => {
    const {
      name,
      email,
      batchId
    } = req.body;
    // 🔐 Get instituteId from token (NEVER from frontend)
    const instituteId = req.user?.instituteId;
    if (!instituteId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 🔥 Generate username automatically
    const username = await generateUsername(name);

  const student =
  await createStudentUser(

    {

      name,

      email,

      username,

      batchId,
    },

    instituteId
  );
   
    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  }
);

export const deleteStudentController = asyncHandler(
  async (req: Request & { user?: any }, res: Response) => {

    const instituteId = req.user.instituteId;

    const studentId = req.params.id as string;

    await deleteStudentByInstitute(
      studentId,
      instituteId
    );

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  }
);

export const getStudentsController = asyncHandler(
  async (req: Request & { user?: any }, res: Response) => {

    const instituteId = req.user?.instituteId;

    const students = await getStudentsByInstitute(
      instituteId
    );


    res.status(200).json({
      success: true,
      data: students,
    });
  }
);

export const updateStudentController = asyncHandler(
  async (req: Request & { user?: any }, res: Response) => {

    const instituteId = req.user.instituteId;

    const studentId = req.params.id as string;

    const student = await updateStudentByInstitute(
      studentId,
      instituteId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  }
);

export const updateProfile = asyncHandler(
  async (req: Request & { user?: any }, res: Response) => {

    const user = await User.findById(
      req.user.instituteId
    );

    if (!user) {
      throw new AppError("User not found", 404);
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated",
      data: user,
    });
  }
);
export const importStudentsController =
  asyncHandler(
    async (req: any, res) => {

      if (!req.file) {

        return res.status(400).json({
          success: false,
          message: "CSV file required",
        });
      }

      // ✅ Read Excel/CSV
      const workbook = XLSX.read(
        req.file.buffer,
        {
          type: "buffer",
        }
      );

      const sheetName =
        workbook.SheetNames[0];

      const sheet =
        workbook.Sheets[sheetName];

      const students =
        XLSX.utils.sheet_to_json(sheet);

      const createdStudents = [];

      for (const row of students as any[]) {

        const {
          name,
          email,
          batchName,
        } = row;

        // ✅ Validate row
        if (
          !name ||
          !email ||
          !batchName
        ) {
          continue;
        }

        // ✅ Check duplicate email
        const existing =
          await User.findOne({ email });

        if (existing) {
          continue;
        }

        // ✅ Find batch by name
        const batch =
          await Batch.findOne({

            name: {
              $regex: new RegExp(
                `^${batchName.trim()}$`,
                "i"
              ),
            },

            instituteId:
              req.user.instituteId,
          });

        // ❌ Batch not found
        if (!batch) {

          console.log(
            `Batch not found: ${batchName}`
          );

          continue;
        }

        // ✅ Generate username
        const username =
          await generateUniqueUsername(
            name
          );

        // ✅ Default password
        const tempPassword = "123456";

        const hashedPassword =
          await bcrypt.hash(
            tempPassword,
            10
          );

        // ✅ Create student
        const student =
          await User.create({

            name,

            email,

            username,

            password:
              hashedPassword,

            role: "student",

            instituteId:
              req.user.instituteId,

            batchId: batch._id,

            status: "active",
          });

        createdStudents.push(student);
      }

      res.json({
        success: true,
        message:
          "Students imported successfully",

        total:
          createdStudents.length,
      });
    }
  );