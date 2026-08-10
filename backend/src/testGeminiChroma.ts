import "dotenv/config";

import { getCollection } from "./services/vector.service";
import { generateEmbeddings } from "./services/embedding.service";

async function test() {
  const collectionName = "gemini-test";

  console.log("Creating/getting test collection...");

  const collection =
    await getCollection(collectionName);

  const texts = [
    "GitSenseAI analyzes GitHub repositories.",
    "React is used for the frontend.",
    "Node.js and Express are used for the backend.",
  ];

  console.log("Generating Gemini embeddings...");

  const embeddings =
    await generateEmbeddings(texts);

  console.log(
    `Generated ${embeddings.length} embeddings`
  );

  console.log(
    `Embedding dimension: ${embeddings[0].length}`
  );

  const ids = [
    "gemini-test-1",
    "gemini-test-2",
    "gemini-test-3",
  ];

  await collection.add({
    ids,
    embeddings,
    documents: texts,
    metadatas: [
      { source: "test" },
      { source: "test" },
      { source: "test" },
    ],
  });

  console.log("✅ Documents added to ChromaDB");

  const query =
    "What technology is used for the frontend?";

  console.log(
    `Searching: "${query}"`
  );

  const queryEmbedding =
    embeddings[0]; // temporary test

  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: 2,
  });

  console.log("\nSearch results:");

  console.log(
    JSON.stringify(results.documents, null, 2)
  );

  console.log("\n✅ Gemini + ChromaDB test successful!");
}

test().catch((error) => {
  console.error(
    "\n❌ Gemini + ChromaDB test failed:"
  );

  console.error(error);

  process.exit(1);
});