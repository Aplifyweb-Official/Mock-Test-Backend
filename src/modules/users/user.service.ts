import { User } from "./user.model.js"; // ✅ Fix 1: Curly braces lagaye (Named Import)
import { ApiError } from "../../shared/utils/ApiError.js"; // ✅ Fix 2: Humara custom ApiError use kiya

export const createUser = async (data: any) => {
  // ✅ Fix 3: bcrypt yahan se hata diya. 
  // Model ka pre-save hook ab apne aap password hash kar lega.
  const user = await User.create(data);
  return user;
};

export const findUserByEmail = async (email: string) => {
  const user = await User.findOne({ email });
  return user;
};

export const findUserById = async (id: string) => {
  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found"); // ✅ ApiError standard layout
  }

  return user;
};