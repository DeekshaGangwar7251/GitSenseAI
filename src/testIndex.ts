import { cloneRepository } from "./services/git.service";
import { readRepositoryDocuments } from "./services/repository.service";
import { splitDocuments } from "./services/chunk.service";
import { indexDocuments } from "./services/index.service";
import { isCollectionIndexed } from "./services/vector.service";
import {
  deleteCollection,
} from "./services/vector.service";
async function main() {
    const FORCE_REINDEX = true;
  try {
    // Public GitHub repository
    const repoUrl = "https://github.com/DeekshaGangwar7251/GitSenseAI.git";

    // Extract repository name
    const repoName = repoUrl
      .split("/")
      .pop()
      ?.replace(".git", "")
      .toLowerCase();

    if (!repoName) {
      throw new Error("Invalid repository URL");
    }

    const alreadyIndexed = await isCollectionIndexed(repoName);

if (alreadyIndexed) {
  if (FORCE_REINDEX) {
    console.log(`Deleting existing collection: ${repoName}`);
    await deleteCollection(repoName);
  } else {
    console.log(`Repository "${repoName}" is already indexed.`);
    return;
  }
}

    console.log("Cloning repository...");
    const repoPath = await cloneRepository(repoUrl);

    console.log("Reading files...");
const documents = await readRepositoryDocuments(repoPath);

    console.log(`Found ${documents.length} documents`);

    console.log("Splitting documents...");
    const chunks = await splitDocuments(documents);

    console.log(`Generated ${chunks.length} chunks`);

    console.log(`Indexing repository into collection: ${repoName}`);

    await indexDocuments(chunks, repoName);

    console.log("Repository indexed successfully!");
  } catch (error) {
    console.error(error);
  }
}

main();