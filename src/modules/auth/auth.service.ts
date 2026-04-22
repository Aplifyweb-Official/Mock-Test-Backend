import bcrypt from "bcrypt";
import { createUser, findUserByEmail } from "../users/user.service.js";
import { generateToken } from "../../utils/generateToken.js";
import { AppError } from "../../utils/AppError.js";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role?: string
) => {
  const existingUser = await findUserByEmail(email);
  if (role === "super-admin") {
    throw new AppError("Not allowed to create admin", 403);
  }
  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const user = await createUser({
    name,
    email,
    password,
    role: role || "student", // ✅ allow role
  });

  const userObj = user.toObject();
  const { password: _password, ...safeUser } = userObj;

  return safeUser;
};
// export const registerUser = async (
//   name: string,
//   email: string,
//   password: string
// ) => {
//   const existingUser = await findUserByEmail(email);

//   if (existingUser) {
//     throw new AppError("User already exists", 400);
//   }

//   const user = await createUser({
//     name,
//     email,
//     password,
//   });

//   // 🔐 remove password safely
//   const userObj = user.toObject();
//   const { password: _password, ...safeUser } = userObj;

//   return safeUser;
// };

export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError("Invalid email or password", 400);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid email or password", 400);
  }

  const token = generateToken(user);

  // 🔐 remove password safely
  const userObj = user.toObject();
  const { password: _password, ...safeUser } = userObj;

  return {
    user: safeUser,
    token,
  };
};

