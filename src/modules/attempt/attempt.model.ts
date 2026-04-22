import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
    questionId: String,
    selectedAnswer: String,
});

const attemptSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        testId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Test",
            required: true,
        },

        answers: [answerSchema],

        score: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Attempt", attemptSchema);