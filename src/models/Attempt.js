import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema(
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

    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
        },
        selectedOption: {
          type: Number,
          default: null,
        },
        isMarkedForReview: {
          type: Boolean,
          default: false,
        },
      },
    ],

    status: {
      type: String,
      enum: ["in-progress", "submitted", "auto-submitted"],
      default: "in-progress",
      index: true,
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    submittedAt: Date,
  },
  { timestamps: true }
);

// 🔥 Prevent multiple attempts (IMPORTANT)
attemptSchema.index({ userId: 1, testId: 1 }, { unique: true });

export default mongoose.model("Attempt", attemptSchema);