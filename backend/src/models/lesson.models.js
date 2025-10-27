import mongoose, { Schema } from "mongoose";

const lessonSchema = new Schema(
  {
    title: { 
      type: String, 
      required: true, 
      trim: true 
    },
    content: { 
      type: String, 
      required: true, 
      trim: true 
    },
    youtubeVideoQuery: {
      type: String,
      required: true,
    },
    videoId: {
        type: String,
        required: true,
    }
  },
  { timestamps: true }
);

export const Lesson = mongoose.model("Lesson", lessonSchema);