import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openaiApiKey = process.env.OPENAI_API_KEY;
const openaiModel = process.env.OPENAI_MODEL || "gpt-4o-mini";

const getOpenAIClient = () => {
  if (!openaiApiKey) {
    const error = new Error("OPENAI_API_KEY is required for OpenAI analysis");
    error.statusCode = 500;
    throw error;
  }

  return new OpenAI({
    apiKey: openaiApiKey,
  });
};

export { getOpenAIClient, openaiApiKey, openaiModel };
