import mongoose, { Schema } from "mongoose";

const questionSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: [
      {
        type: String,
        required: true,
      },
    ],
    correctAnswerIndex: {
      type: Number,
      required: true
    }
  },
  { timestamps: true },
);

const quizSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    module: {
      type: Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    questions: [questionSchema],
  },
  { timestamps: true },
);

export const Quiz = mongoose.model("Quiz", quizSchema);
