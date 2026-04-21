import mongoose, { Schema, Document } from "mongoose";

// 👇 TypeScript interface (optional but recommended)
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "student" | "institute" | "super-admin";
  instituteId?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "institute", "super-admin"],
      default: "student",
    },

    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// 👇 Export model
const User = mongoose.model<IUser>("User", userSchema);

export default User;