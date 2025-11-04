import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Course } from "../models/course.models.js";
import { User } from "../models/user.models.js";
import { Lesson } from "../models/lesson.models.js";
import { Module } from "../models/module.models.js";
import { Quiz } from "../models/quiz.models.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import mongoose from "mongoose";

// --- API Initialization ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// =================================================================
// HELPER 1: The Gemini Prompt "Brain"
// This defines the exact JSON structure for the model.
// =================================================================
const getSystemPrompt = (userPrompt) => `
You are an expert curriculum designer named "Coursy". Your task is to generate a complete, high-quality course based on the user's request.

You MUST return the output in a single, valid JSON object. Do not add any text, markdown, or "json" tags before or after the JSON block.

User's Request: "${userPrompt}"

Generate the course adhering to this exact JSON schema:

{
  "title": "Full Course Title (e.g., Ultimate Beginner's Guide to Python)",
  "introduction": {
    "learningObjectives": "A paragraph explaining what the user will learn by the end of this course.",
    "syllabus": [
      "A bullet point of the first main topic",
      "A bullet point of the second main topic",
      "..."
    ]
  },
  "modules": [
    {
      "title": "Module 1: The Basics",
      "reading": "The general introductory text reading for this module. This should be a few paragraphs.",
      "lessons": [
        {
          "title": "Lesson 1.1: Setting up Your Environment",
          "content": "The text content for this lesson. This will be used as the video transcript.",
          "youtubeVideoQuery": "A concise, 5-10 word YouTube search query for this specific lesson (e.g., 'how to install python on windows')"
        },
        {
          "title": "Lesson 1.2: Your First Program",
          "content": "Text content for lesson 1.2...",
          "youtubeVideoQuery": "python hello world tutorial for beginners"
        }
      ],
      "quiz": {
        "title": "Module 1 Quiz",
        "questions": [
          {
            "question": "What keyword is used to declare a variable in Python?",
            "options": ["var", "let", "const", "No keyword is needed"],
            "correctAnswerIndex": 3
          }
        ]
      }
    },
    {
      "title": "Module 2: Data Types",
      "reading": "General text reading for Module 2...",
      "lessons": [
        {
          "title": "Lesson 2.1: Strings and Numbers",
          "content": "Text content for lesson 2.1...",
          "youtubeVideoQuery": "python strings and numbers tutorial"
        }
      ],
      "quiz": {
        "title": "Module 2 Quiz",
        "questions": [
          {
            "question": "What is the data type of '10'?",
            "options": ["Integer", "String", "Float"],
            "correctAnswerIndex": 1
          }
        ]
      }
    }
  ]
}
`;

// =================================================================
// HELPER 2: YouTube API Search
// This finds the top video for a given query.
// =================================================================
const getYouTubeVideoId = async (query) => {
  try {
    const url = `https://www.googleapis.com/youtube/v3/search`;
    const params = {
      part: "snippet",
      q: query,
      key: YOUTUBE_API_KEY,
      maxResults: 1,
      type: "video",
    };

    const response = await axios.get(url, { params });
    
    if (response.data.items && response.data.items.length > 0) {
      return response.data.items[0].id.videoId;
    }
    return null;
  } catch (error) {
    console.error(`YouTube API Error for query "${query}":`, error.response?.data?.error || error.message);
    return null; 
  }
};

export const generateCourse = asyncHandler(async (req, res) => {
  
  const { prompt } = req.body;
  const user = req.user;

  if (!prompt) {
    throw new ApiError(400, "A prompt is required to generate a course.");
  }

  const fullPrompt = getSystemPrompt(prompt);
  let geminiText;
  try {
    const geminiResult = await geminiModel.generateContent(fullPrompt);
    const geminiResponse = geminiResult.response;
    geminiText = geminiResponse.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new ApiError(502, "The course generation service is currently unavailable.");
  }

  let generatedCourse;
  try {
    generatedCourse = JSON.parse(geminiText);
  } catch (e) {
    console.error("Gemini output was not valid JSON:", geminiText);
    throw new ApiError(500, "The model returned an invalid format. Please try again.");
  }

  // --- 4. The "Waterfall" Database Save (with Transaction) ---
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();

    // 1. Create the Course
    const newCourse = new Course({
      title: generatedCourse.title,
      originalPrompt: prompt,
      creator: user._id,
      introduction: generatedCourse.introduction,
      modules: []
    });
    // We must pass the session to *all* database operations
    await newCourse.save({ session });

    const savedModuleIds = [];

    // 2. Loop Through Modules
    for (const moduleData of generatedCourse.modules) {
      
      // 3. Loop Through Lessons (in parallel)
      const savedLessonIds = await Promise.all(
        moduleData.lessons.map(async (lessonData) => {
          
          // 4. Call YouTube API for each lesson
          const videoId = await getYouTubeVideoId(lessonData.youtubeVideoQuery);
          
          if (!videoId) {
            // This will fail the `required: true` check and abort the transaction
            // This is good! We don't want a lesson without its video.
            throw new ApiError(500, `Failed to find video for lesson: "${lessonData.title}"`);
          }

          // 5. Save the Lesson
          const newLesson = new Lesson({
            title: lessonData.title,
            content: lessonData.content,
            youtubeVideoQuery: lessonData.youtubeVideoQuery,
            videoId: videoId
          });
          await newLesson.save({ session });
          return newLesson._id;
        })
      );

      const newModule = new Module({
        title: moduleData.title,
        reading: moduleData.reading,
        course: newCourse._id,
        lessons: savedLessonIds,
      });
      await newModule.save({ session });

      const newQuiz = new Quiz({
        title: moduleData.quiz.title,
        questions: moduleData.quiz.questions,
        module: newModule._id
      });
      await newQuiz.save({ session });

      newModule.quiz = newQuiz._id;
      await newModule.save({ session });
      
      savedModuleIds.push(newModule._id);
    }

    newCourse.modules = savedModuleIds;
    await newCourse.save({ session });

    // bug fixed : update user's course list
    await User.findByIdAndUpdate(
      user._id,
      { $push: { courses: newCourse._id } },
      { session }
    );

    await session.commitTransaction();

    // --- 5. Send the Final Response ---
    return res
      .status(201)
      .json(new ApiResponse(
        201, 
        { courseId: newCourse._id }, 
        "Course generated and saved successfully"
      ));

  } catch (error) {
    await session.abortTransaction();
    console.error("Course Generation Transaction Failed:", error);
    throw new ApiError(500, `Course creation failed: ${error.message}`);
  } finally {
    session.endSession();
  }
});


export const getCourseDetails = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user._id;
  
    if (!mongoose.isValidObjectId(courseId)) {
      throw new ApiError(400, "Invalid Course ID");
    }

    const course = await Course.findById(courseId).populate({
      path: "modules",
      populate: [
        { path: "lessons" },
        { path: "quiz" },
      ],
    });
  
    if (!course) {
      throw new ApiError(404, "Course not found");
    }
  
    if (course.creator.toString() !== userId.toString()) {
      throw new ApiError(403, "Forbidden: You do not have permission to view this course");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, course, "Course details fetched successfully")
      );
  });


export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id)
      .populate({
        path: "modules",
        populate: [
          { path: "lessons" },
          { path: "quiz" },
        ],
      })
      .populate("creator", "fullname email");

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    return res.status(200).json({
      success: true,
      data: { course },
      message: "Course fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
    });
  }
};