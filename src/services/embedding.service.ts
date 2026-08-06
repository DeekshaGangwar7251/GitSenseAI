import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import dotenv from "dotenv";

dotenv.config();

export const embeddingModel = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY!,
  model: "gemini-embedding-001",
});

export async function generateEmbedding(text: string): Promise<number[]> {
  return embeddingModel.embedQuery(text);
}