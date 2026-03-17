import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
  try {
    const res = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    );

    const models = res.data.models;

    models.forEach((model) => {
      if (model.supportedGenerationMethods?.includes("generateContent")) {
        console.log(model.name);
      }
    });
  } catch (error) {
    console.error(
      "Error fetching models:",
      error.response?.data || error.message
    );
  }
}

listModels();