// Business logic (Login, Signup, Token gen)

import bcrypt from "bcrypt";
import { createUser, findUserByEmail } from "../users/user.service.ts";
import { generateToken } from "../../utils/generateToken.ts";

export const registerUser = async (name: string, email: string, password: string ) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const user = await createUser({
    name,
    email,
    password,
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user);

  return { user, token };
};