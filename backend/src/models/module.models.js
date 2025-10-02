import mongoose, { Schema } from "mongoose";

const moduleSchema = new Schema({
    title:{
        type: String,
        required: true,
        trim: true
    }, 
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    lessons: [{
        type: Schema.Types.ObjectId,
        ref: "Lesson"
    }],
    quiz: {
        type: Schema.Types.ObjectId,
        ref: "Quiz"
    }
},{ timestamps: true });

export const Module = mongoose.model("Module", moduleSchema);