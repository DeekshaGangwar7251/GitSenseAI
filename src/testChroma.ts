import { getCollection } from "./services/vector.service";

async function main() {
  const repoUrl = "https://github.com/DeekshaGangwar7251/GitSenseAI.git";

  const repoName = repoUrl
    .split("/")
    .pop()
    ?.replace(".git", "")
    .toLowerCase();

  if (!repoName) {
    throw new Error("Invalid repository URL");
  }

  const collection = await getCollection(repoName);

  console.log("Connected successfully!");
  console.log("Collection:", collection.name);
}

main().catch(console.error);