import User from "./user.model.ts";
import bcrypt from "bcrypt";

export const createUser = async (data: any) => {
  // 🔐 hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    ...data,
    password: hashedPassword,
  });

  return user;
};

export const findUserByEmail = async (email: string) => {
  return User.findOne({ email });
};