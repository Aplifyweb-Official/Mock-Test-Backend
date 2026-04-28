import bcrypt from "bcrypt";
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
} from "../users/user.service.js";
import { AppError } from "../../shared/utils/AppError.js";
import { Session } from "./session.model.js";
import { getIO, getUserSocket } from "../../config/socket.config.js";
import { generateUniqueUsername } from "../../shared/utils/username.util.js";
import { generateToken } from "../../shared/utils/generateToken.js";

/**
 * 🏢 Register Institute
 */

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const existingEmail = await findUserByEmail(email);
  if (existingEmail) {
    throw new AppError("Email already exists", 400);
  }

  const username = await generateUniqueUsername(name);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await createUser({
    name,
    email,
    username,
    password: hashedPassword,
    role: "institute",
  });

  const userObj = user.toObject();
  const { password: _p, ...safeUser } = userObj;

  // 🔥 ADD THIS
  const token = generateToken({
    userId: user._id.toString(),
    role: user.role,
    instituteId: user.instituteId?.toString(),
  });

  // 🔥 RETURN BOTH
  return {
    user: safeUser,
    token,
  };
};

/**
 * 🔐 Login (email OR username)
 */
export const loginUser = async (
  identifier: string,
  password: string,
  userAgent?: string
) => {
  let user = await findUserByEmail(identifier);

  if (!user) {
    user = await findUserByUsername(identifier);
  }

  if (!user) throw new AppError("Invalid credentials", 400);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Invalid credentials", 400);

  const token = generateToken({
    userId: user._id.toString(),
    role: user.role,
    instituteId: user.instituteId?.toString(),
  });

  // 🔥 FORCE LOGOUT OLD DEVICE (SOCKET)
  const oldSocketId = getUserSocket(user._id.toString());
  if (oldSocketId) {
    const io = getIO();
    io.to(oldSocketId).emit("force_logout");
  }

  // 🔥 SINGLE DEVICE LOGIN
  await Session.deleteMany({ userId: user._id });

  await Session.create({
    userId: user._id,
    token,
    userAgent,
  });

  const userObj = user.toObject();
  const { password: _p, ...safeUser } = userObj;

  return { user: safeUser, token };
};

/**
 * 🚪 Logout
 */
export const logoutUser = async (userId: string, token: string) => {
  await Session.deleteOne({ userId, token });
};