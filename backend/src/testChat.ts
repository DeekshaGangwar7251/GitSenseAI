import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

async function main() {
  const llm = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY!,
    model: "gemini-2.5-flash-lite",
  });

  const response = await llm.invoke("Say hello");

  console.log(response.content);
}

main().catch(console.error);