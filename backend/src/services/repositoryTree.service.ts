import fs from "fs";
import path from "path";

export type RepositoryTreeNode = {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: RepositoryTreeNode[];
};

const ignoredFolders = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  ".next",
  "coverage",
]);

const allowedExtensions = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".py",
  ".java",
  ".cpp",
  ".c",
  ".go",
  ".rs",
  ".html",
  ".css",
]);

export function buildRepositoryTree(
  repositoryPath: string
): RepositoryTreeNode[] {
  function traverse(
    currentPath: string,
    relativePath: string = ""
  ): RepositoryTreeNode[] {
    const entries = fs
      .readdirSync(currentPath)
      .sort((a, b) => a.localeCompare(b));

    const nodes: RepositoryTreeNode[] = [];

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry);
      const currentRelativePath = path.join(
        relativePath,
        entry
      );

      const stat = fs.statSync(fullPath);

      // Ignore folders
      if (stat.isDirectory()) {
        if (ignoredFolders.has(entry)) {
          continue;
        }

        const children = traverse(
          fullPath,
          currentRelativePath
        );

        // Don't show empty folders
        if (children.length === 0) {
          continue;
        }

        nodes.push({
          id: currentRelativePath.replace(/\\/g, "/"),
          name: entry,
          type: "folder",
          children,
        });

        continue;
      }

      // Only include supported files
      const extension = path.extname(entry).toLowerCase();

      if (!allowedExtensions.has(extension)) {
        continue;
      }

      nodes.push({
        id: currentRelativePath.replace(/\\/g, "/"),
        name: entry,
        type: "file",
      });
    }

    return nodes;
  }

  return traverse(repositoryPath);
}