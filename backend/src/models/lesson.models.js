import mongoose, { Schema } from "mongoose";

const lessonSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    reading: {
      type: String,
      required: true,
      trim: true,
    },
    videos: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Lesson = mongoose.model("Lesson", lessonSchema);
