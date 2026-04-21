import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctAnswer: {
    type: String,
    required: true,
  },
  marks: {
    type: Number,
    default: 1,
  },
});

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: String,

    duration: {
      type: Number, // in minutes
      required: true,
    },

    totalMarks: {
      type: Number,
      required: true,
    },

    questions: [questionSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Test", testSchema);