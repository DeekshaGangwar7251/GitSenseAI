import { searchRepository } from "./services/search.service";

async function main() {
  const results = await searchRepository(
    "gitsenseai",
    "embedding.service.ts generateEmbedding GoogleGenerativeAIEmbeddings",
    10
  );

  console.log("\n===== SEARCH RESULTS =====\n");

  results.documents.forEach((doc, index) => {
    console.log(`\nResult ${index + 1}`);
    console.log("-------------------------");
    console.log("Distance:", results.distances[index]);
    console.log("Metadata:", results.metadatas[index]);
    console.log(doc.substring(0, 500));
  });
}

main().catch(console.error);