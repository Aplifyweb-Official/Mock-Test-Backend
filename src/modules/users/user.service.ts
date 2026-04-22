import User from "./user.model.js";
import bcrypt from "bcrypt";
import { AppError } from "../../utils/AppError.js";

export const createUser = async (data: any) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    ...data,
    password: hashedPassword,
  });

  return user;
};

export const findUserByEmail = async (email: string) => {
  const user = await User.findOne({ email });

  return user;
};

export const findUserById = async (id: string) => {
  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};