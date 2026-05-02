import User from "./user.model.js";
import { AppError } from "../../shared/utils/AppError.js";
import bcrypt from "bcrypt";


/**
 * 🧑 Create user (password already hashed)
 */
export const createUser = async (data: any) => {
  try {
    const user = await User.create(data);
    return user;
  } catch (err: any) {
    if (err.code === 11000) {
      // duplicate key (email or username)
      const field = Object.keys(err.keyPattern)[0];
      throw new AppError(`${field} already exists`, 400);
    }
    throw err;
  }
};

/**
 * 🔍 Find by email (NO password)
 */
export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

/**
 * 🔍 Find by username (NO password)
 */
export const findUserByUsername = async (username: string) => {
  return await User.findOne({ username });
};

/**
 * 🔐 Find for login (email OR username WITH password)
 */
export const findUserForLogin = async (identifier: string) => {
  return await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  }).select("+password"); // 🔥 required for login
};

/**
 * 🔍 Find by ID (safe)
 */
export const findUserById = async (id: string) => {
  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

/**
 * 👨‍🎓 Create student (INSTITUTE ONLY)
 */
export const createStudentUser =
  async (

    data: {

      name: string;

      email: string;

      username: string;

      password: string;

      batchId: string;
    },

    instituteId: string
  ) => {

    try {

      // 🔐 HASH PASSWORD
      const hashedPassword =
        await bcrypt.hash(

          data.password,

          10
        );

      // ✅ CREATE STUDENT
      const student =
        await User.create({

          name:
            data.name,

          email:
            data.email,

          username:
            data.username,

          password:
            hashedPassword,

          batchId:
            data.batchId,

          role:
            "student",

          instituteId,

          status:
            "active",

          mustChangePassword:
            true,
        });

      // 🔐 REMOVE PASSWORD
      const obj =
        student.toObject();

      const {

        password: _p,

        ...safeStudent

      } = obj;

      return safeStudent;

    } catch (err: any) {

      // ❌ DUPLICATE KEY
      if (
        err.code === 11000
      ) {

        const field =
          Object.keys(
            err.keyPattern
          )[0];

        throw new AppError(

          `${field} already exists`,

          400
        );
      }

      throw err;
    }
  };

export const deleteStudentByInstitute = async (
  studentId: string,
  instituteId: string
) => {

  const student = await User.findOne({
    _id: studentId,
    role: "student",
    instituteId,
  });

  if (!student) {
    throw new AppError(
      "Student not found or unauthorized",
      404
    );
  }

  await student.deleteOne();

  return true;
};


export const getStudentsByInstitute = async (
  instituteId: string
) => {
  return await User.find({
    role: "student",
    instituteId,
  })
    .populate("batchId", "name")
    .select("-password")
    .sort({ createdAt: -1 });
};


export const updateStudentByInstitute = async (
  studentId: string,
  instituteId: string,
  data: {
    name: string;
    email: string;
    batchId: string;
    status: string;
  }
) => {

  const student = await User.findOne({
    _id: studentId,
    role: "student",
    instituteId,
  });

  if (!student) {
    throw new AppError(
      "Student not found or unauthorized",
      404
    );
  }

  student.name = data.name;
  student.email = data.email;
  student.batchId = data.batchId as any;
  student.status = data.status as any;

  await student.save();

  return student;
};