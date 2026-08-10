import "dotenv/config";
import {
  generateEmbedding,
  generateEmbeddings,
} from "./services/embedding.service";

async function test() {
  console.log("Testing single embedding...");

  const single = await generateEmbedding(
    "GitSenseAI is a repository analysis tool."
  );

  console.log(
    "Single embedding length:",
    single.length
  );

  console.log("\nTesting batch embeddings...");

  const batch = await generateEmbeddings([
    "React frontend application",
    "Node.js Express backend",
    "ChromaDB vector database",
    "Gemini embedding model",
    "Groq language model",
  ]);

  console.log(
    "Number of embeddings:",
    batch.length
  );

  console.log(
    "Each embedding length:",
    batch[0]?.length
  );

  console.log("\nGemini embedding test successful! ✅");
}

test().catch((error) => {
  console.error(
    "Embedding test failed:",
    error
  );

  process.exit(1);
});