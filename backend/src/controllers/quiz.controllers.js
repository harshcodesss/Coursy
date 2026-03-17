import { Quiz } from "../models/quiz.models.js";
import { ApiError } from "../utils/ApiError.js";

export const getQuizByModule = async (req, res) => {
  try {
    const { moduleId } = req.params;

    if (!moduleId) {
      throw new ApiError(400, "Module ID is required");
    }

    const quiz = await Quiz.findOne({ module: moduleId });

    if (!quiz) {
      throw new ApiError(404, "Quiz not found for this module");
    }

    return res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    console.error("Error fetching quiz:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};