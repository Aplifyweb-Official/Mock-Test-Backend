import User from "./user.model.js";
import { AppError } from "../../shared/utils/AppError.js";

/**
 * 🧑 Create user (password already hashed)
 */
export const createUser = async (data: any) => {
  const user = await User.create(data);
  return user;
};

/**
 * 🔍 Find by email
 */
export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

/**
 * 🔍 Find by username
 */
export const findUserByUsername = async (username: string) => {
  return await User.findOne({ username });
};

/**
 * 🔍 Find by ID
 */
export const findUserById = async (id: string) => {
  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};