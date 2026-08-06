import { searchRepository } from "./services/search.service";

async function main() {
 const results = await searchRepository(
  "gitsenseai",
  "simple-git"
);

  console.log("\n===== SEARCH RESULTS =====\n");

  results.documents.forEach((doc, index) => {
    console.log(`Result ${index + 1}`);
    console.log("-------------------------");
    console.log("Distance:", results.distances[index]);
    console.log("Metadata:", results.metadatas[index]);
    console.log(doc);
    console.log("\n");
  });
}

main().catch(console.error);