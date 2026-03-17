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
const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
  },
});
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// HELPER 1: The Gemini Prompt "Brain"
// This defines the exact JSON structure for the model.

export const getSystemPrompt = (userPrompt) => `
You are Coursy — an expert curriculum designer.

RESPONSE RULES (MUST FOLLOW):
1. Return ONLY a single valid JSON object. Do NOT include any explanation, text, or markdown before or after the JSON. Do NOT include code fences such as three backticks.
2. Ensure all keys and all string values use double quotes. The output must be parseable by JSON.parse().
3. Do not include extra keys beyond the schema below.
4. Do not include null values. Do not use comments.
5. Arrays must meet the minimum sizes requested below.
6. "correctAnswerIndex" must be a valid integer index within the question's options array (0-based).

SCHEMA (exactly; keep types):
{
  "title": "string",
  "introduction": {
    "learningObjectives": "string",
    "syllabus": ["string", "..."]
  },
  "modules": [
    {
      "title": "string",
      "reading": "string",
      "lessons": [
        {
          "title": "string",
          "content": "string",
          "youtubeVideoQuery": "string"
        }
      ],
      "quiz": {
        "title": "string",
        "questions": [
          {
            "question": "string",
            "options": ["string", "string", "..."],
            "correctAnswerIndex": number
          }
        ]
      }
    }
  ]
}

CONTENT RULES (required):
- Generate at least 2 modules.
- Each module must have at least 2 lessons.
- Each module's quiz must contain at least 3 questions.
- Each question must have at least 2 options.
- Keep lesson "content" concise but full sentences suitable for a video transcript (1–3 paragraphs).
- Keep youtubeVideoQuery short (5–10 words) and specific to the lesson.
- Syllabus must be an array of short strings (3–8 items recommended).

User request: "${userPrompt}"

Produce the JSON course for this request now.
`;

export const parseGeneratedJSON = (rawText) => {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Empty response from model");
  }

  let cleaned = rawText.replace(/```[\s\S]*?```/g, "").trim();

  const jsonMatch = cleaned.match(/(\{[\s\S]*\})/);
  const candidate = jsonMatch ? jsonMatch[1] : cleaned;

  const finalText = candidate.trim();

  try {
    return JSON.parse(finalText);
  } catch (err) {
    console.error("Failed to parse JSON from model. Raw cleaned text:", cleaned);
    throw new Error("The model returned an invalid JSON format.");
  }
};


// HELPER 2: YouTube API Search
// This finds the top video for a given query.

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
    generatedCourse = parseGeneratedJSON(geminiText);
  } catch (err) {
    console.error("Invalid JSON from Gemini:", err);
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