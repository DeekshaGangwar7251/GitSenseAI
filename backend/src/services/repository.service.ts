import fs from "fs";
import path from "path";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

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

function getLanguage(extension: string): string {
  const languages: Record<string, string> = {
    ".ts": "TypeScript",
    ".tsx": "TypeScript React",
    ".js": "JavaScript",
    ".jsx": "JavaScript React",
    ".json": "JSON",
    ".md": "Markdown",
    ".py": "Python",
    ".java": "Java",
    ".cpp": "C++",
    ".c": "C",
    ".go": "Go",
    ".rs": "Rust",
    ".html": "HTML",
    ".css": "CSS",
  };

  return languages[extension] ?? extension;
}

function getCategory(relativePath: string): string {
  const normalizedPath = relativePath.replace(/\\/g, "/").toLowerCase();

  if (normalizedPath.includes("/services/")) return "service";
  if (normalizedPath.includes("/controllers/")) return "controller";
  if (normalizedPath.includes("/routes/")) return "route";
  if (normalizedPath.includes("/components/")) return "component";
  if (normalizedPath.includes("/utils/")) return "utility";
  if (normalizedPath.includes("/models/")) return "model";
  if (normalizedPath.includes("/types/")) return "type";
  if (normalizedPath.includes("/constants/")) return "constant";
  if (normalizedPath.includes("/config/")) return "configuration";
  if (normalizedPath.includes("/hooks/")) return "hook";
  if (normalizedPath.includes("/middleware/")) return "middleware";
  if (normalizedPath.includes("package.json")) return "dependency configuration";
  if (normalizedPath.includes("readme")) return "documentation";

  return "source";
}

export async function readRepositoryDocuments(
  directory: string
): Promise<Document[]> {
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

        const relativePath = path.relative(directory, fullPath);

        const fileName = path.basename(fullPath);

        const language = getLanguage(extension);

        const category = getCategory(relativePath);

        const enrichedContent = `
File Name: ${fileName}
File Path: ${relativePath}
Language: ${language}
Category: ${category}

Repository File:

${content}
`;

        documents.push(
          new Document({
            pageContent: enrichedContent,
            metadata: {
              source: fullPath,
              relativePath,
              fileName,
              extension,
              language,
              category,
            },
          })
        );
      }
    }
  }

  traverse(directory);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1800,
    chunkOverlap: 300,
    separators: ["\n\n", "\n", " ", ""],
  });

  const splitDocuments = await splitter.splitDocuments(documents);

  console.log(
    `Split ${documents.length} files into ${splitDocuments.length} chunks`
  );

  return splitDocuments;
}