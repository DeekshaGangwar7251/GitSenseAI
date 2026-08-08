// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import dotenv from "dotenv";

// dotenv.config();

// export const llm = new ChatGoogleGenerativeAI({
//   apiKey: process.env.GEMINI_API_KEY!,
//   model: "gemini-2.5-flash-lite",
//   temperature: 0.2,
// });

import "dotenv/config";
import { ChatGroq } from "@langchain/groq";

export const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY!,
  model: "llama-3.3-70b-versatile",
  temperature: 0.2,

  // Keep the generated report controlled.
  maxTokens: 3500,
});