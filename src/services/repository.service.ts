import fs from "fs";
import path from "path";
import { Document } from "@langchain/core/documents";

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

export function readRepositoryDocuments(
  directory: string
): Document[] {

  const documents: Document[] = [];

  function traverse(currentPath: string) {

    const entries = fs.readdirSync(currentPath);

    for (const entry of entries) {

      const fullPath = path.join(currentPath, entry);

      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {

        if (ignoredFolders.has(entry)) continue;

        traverse(fullPath);

      } else {

        const extension = path.extname(entry);

        if (!allowedExtensions.has(extension)) continue;

        const content = fs.readFileSync(fullPath, "utf8");

// Get relative path inside the repository
const relativePath = path.relative(directory, fullPath);

// Build richer content for embedding
const enrichedContent = `
File Name: ${path.basename(fullPath)}
File Path: ${relativePath}
Language: ${extension}

Code:
${content}
`;

documents.push(
  new Document({
    pageContent: enrichedContent,
    metadata: {
      source: fullPath,
      relativePath,
      fileName: path.basename(fullPath),
      extension,
    },
  })
);
      }

    }

  }

  traverse(directory);

  return documents;

}