import simpleGit from "simple-git";
import fs from "fs-extra";
import path from "path";

const git = simpleGit();

const REPOSITORY_DIR = path.join(
  process.cwd(),
  "repositories"
);

export async function cloneRepository(
  repoUrl: string,
  branch?: string
): Promise<string> {
  const repoName = repoUrl
    .split("/")
    .pop()
    ?.replace(".git", "");

  if (!repoName) {
    throw new Error("Invalid GitHub repository URL.");
  }

  await fs.ensureDir(REPOSITORY_DIR);

  // Keep different branches in different folders
  const folderName = branch
    ? `${repoName}-${branch}`
    : repoName;

  const repoPath = path.join(
    REPOSITORY_DIR,
    folderName
  );

  // If this branch has already been cloned, reuse it
  if (await fs.pathExists(repoPath)) {
    console.log(
      `Repository already exists: ${repoName} (${branch ?? "default branch"})`
    );

    return repoPath;
  }

  console.log(
    `Cloning ${repoName} (${branch ?? "default branch"})...`
  );

  if (branch) {
    await git.clone(
      repoUrl,
      repoPath,
      ["--branch", branch]
    );
  } else {
    await git.clone(
      repoUrl,
      repoPath
    );
  }

  console.log("Repository cloned successfully.");

  return repoPath;
}