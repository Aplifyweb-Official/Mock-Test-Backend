import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: String,

    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    totalMarks: {
      type: Number,
      required: true,
    },

    negativeMarks: {
      type: Number,
      default: 0,
    },

    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },

    startTime: Date,
    endTime: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Test", testSchema);