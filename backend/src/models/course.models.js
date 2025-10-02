import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    originalPrompt: { 
        type: String, 
        required: true 
    },
    creator: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    modules: [{ 
        type: Schema.Types.ObjectId, 
        ref: "Module" 
    }],
  },
  { timestamps: true },
);

export const Course = mongoose.model("Course", courseSchema);
