import mongoose, { Schema, Document } from "mongoose";
import { number } from "zod";

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  resetPasswordToken: string | null;
  resetPasswordExpires: Date | null;
  role: "student" | "institute" | "super-admin";
  instituteId: mongoose.Types.ObjectId | null;
  batchId: mongoose.Types.ObjectId | null;
  status: "active" | "inactive" | "blocked";
  avgScore: number;
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

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
      select: false,
    },

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      enum: ["student", "institute", "super-admin"],
      required: true,
    },

    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: function () {
        return this.role === "student";
      },
      default: null,
      index: true,
    },

    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: function () {
        return this.role === "student";
      },
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active",
    },

    avgScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// 🔥 compound index (important for scale)
userSchema.index({ instituteId: 1, email: 1 });

const User = mongoose.model<IUser>("User", userSchema);

export default User;