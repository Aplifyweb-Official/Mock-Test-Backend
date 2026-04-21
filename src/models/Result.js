import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
      index: true,
    },

    attemptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attempt",
      required: true,
    },

    score: {
      type: Number,
      required: true,
    },

    correct: Number,
    wrong: Number,
    skipped: Number,

    accuracy: Number,
  },
  { timestamps: true }
);

// 🔥 One result per attempt
resultSchema.index({ attemptId: 1 }, { unique: true });

export default mongoose.model("Result", resultSchema);