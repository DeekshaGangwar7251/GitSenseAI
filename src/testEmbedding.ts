import { generateEmbedding } from "./services/embedding.service";

async function main() {
  const vector = await generateEmbedding(
    "GitSenseAI analyzes GitHub repositories."
  );

  console.log("Embedding generated successfully!");
  console.log("Vector dimension:", vector.length);
  console.log("First 10 values:");
  console.log(vector.slice(0, 10));
}

main().catch(console.error);