import simpleGit from "simple-git";
import fs from "fs-extra";
import path from "path";

const git = simpleGit();

const REPOSITORY_DIR = path.join(process.cwd(), "repositories");

export async function cloneRepository(repoUrl: string): Promise<string> {
  const repoName = repoUrl
    .split("/")
    .pop()
    ?.replace(".git", "");

  if (!repoName) {
    throw new Error("Invalid GitHub repository URL.");
  }

  await fs.ensureDir(REPOSITORY_DIR);

  const repoPath = path.join(REPOSITORY_DIR, repoName);

  // Skip cloning if repository already exists
  if (await fs.pathExists(repoPath)) {
    console.log(`Repository already exists: ${repoName}`);
    return repoPath;
  }

  console.log(`Cloning ${repoName}...`);

  await git.clone(repoUrl, repoPath);

  console.log("Repository cloned successfully.");

  return repoPath;
}