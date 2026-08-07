import "dotenv/config";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

async function main() {
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY!,
    model: "gemini-embedding-001",
  });

  const vector = await embeddings.embedQuery("Hello world");

  console.log("Embedding length:", vector.length);
}

main().catch(console.error);