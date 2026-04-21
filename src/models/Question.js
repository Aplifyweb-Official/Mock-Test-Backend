import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
      index: true,
    },

    question: {
      type: String,
      required: true,
    },

    options: [
      {
        text: { type: String, required: true },
      },
    ],

    correctAnswer: {
      type: Number,
      required: true,
    },

    marks: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);