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
  const normalizedPath = relativePath
    .replace(/\\/g, "/")
    .toLowerCase();

  if (normalizedPath.includes("/services/"))
    return "service";

  if (normalizedPath.includes("/controllers/"))
    return "controller";

  if (normalizedPath.includes("/routes/"))
    return "route";

  if (normalizedPath.includes("/components/"))
    return "component";

  if (normalizedPath.includes("/utils/"))
    return "utility";

  if (normalizedPath.includes("/models/"))
    return "model";

  if (normalizedPath.includes("/types/"))
    return "type";

  if (normalizedPath.includes("/constants/"))
    return "constant";

  if (normalizedPath.includes("/config/"))
    return "configuration";

  if (normalizedPath.includes("/hooks/"))
    return "hook";

  if (normalizedPath.includes("/middleware/"))
    return "middleware";

  if (normalizedPath.includes("package.json"))
    return "dependency configuration";

  if (normalizedPath.includes("readme"))
    return "documentation";

  return "source";
}

/*
 * Read repository files and convert them
 * into LangChain Documents.
 */
export async function readRepositoryDocuments(
  directory: string
): Promise<Document[]> {
  const documents: Document[] = [];

  function traverse(currentPath: string) {
    const entries = fs.readdirSync(currentPath);

    for (const entry of entries) {
      const fullPath = path.join(
        currentPath,
        entry
      );

      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        if (ignoredFolders.has(entry)) {
          continue;
        }

        traverse(fullPath);
      } else {
        const extension =
          path.extname(entry).toLowerCase();

        if (
          !allowedExtensions.has(extension)
        ) {
          continue;
        }

        const content = fs.readFileSync(
          fullPath,
          "utf8"
        );

        const relativePath = path.relative(
          directory,
          fullPath
        );

        const fileName =
          path.basename(fullPath);

        const language =
          getLanguage(extension);

        const category =
          getCategory(relativePath);

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

  const splitter =
    new RecursiveCharacterTextSplitter({
      chunkSize: 1800,
      chunkOverlap: 300,
      separators: [
        "\n\n",
        "\n",
        " ",
        "",
      ],
    });

  const splitDocuments =
    await splitter.splitDocuments(
      documents
    );

  console.log(
    `Split ${documents.length} files into ${splitDocuments.length} chunks`
  );

  return splitDocuments;
}

/*
 * Return the actual repository file tree.
 *
 * This is used by the frontend Repository Explorer.
 */
export function getRepositoryFiles(
  repositoryPath: string
) {
  const files: Array<{
    path: string;
    name: string;
    type: "file" | "folder";
    children?: any[];
  }> = [];

  function traverse(
    currentPath: string,
    relativePath = ""
  ): any[] {
    const entries = fs
      .readdirSync(currentPath)
      .sort((a, b) =>
        a.localeCompare(b)
      );

    const nodes: any[] = [];

    for (const entry of entries) {
      const fullPath = path.join(
        currentPath,
        entry
      );

      const currentRelativePath =
        path.join(
          relativePath,
          entry
        );

      const stat =
        fs.statSync(fullPath);

      if (stat.isDirectory()) {
        if (
          ignoredFolders.has(entry)
        ) {
          continue;
        }

        const children =
          traverse(
            fullPath,
            currentRelativePath
          );

        if (children.length === 0) {
          continue;
        }

        nodes.push({
          path:
            currentRelativePath.replace(
              /\\/g,
              "/"
            ),
          name: entry,
          type: "folder",
          children,
        });

        continue;
      }

      const extension =
        path.extname(entry).toLowerCase();

      if (
        !allowedExtensions.has(
          extension
        )
      ) {
        continue;
      }

      nodes.push({
        path:
          currentRelativePath.replace(
            /\\/g,
            "/"
          ),
        name: entry,
        type: "file",
      });
    }

    return nodes;
  }

  files.push(
    ...traverse(repositoryPath)
  );

  return files;
}

/*
 * Return the actual content of a repository file.
 */
export function getRepositoryFileContent(
  repositoryPath: string,
  filePath: string
): string {
  /*
   * Normalize the requested path so that
   * Windows and Linux paths both work.
   */
  const normalizedFilePath =
    filePath.replace(
      /[\\/]+/g,
      path.sep
    );

  const absolutePath =
    path.resolve(
      repositoryPath,
      normalizedFilePath
    );

  const normalizedRepositoryPath =
    path.resolve(repositoryPath);

  /*
   * Security check:
   * Prevent someone from requesting
   * ../../ files outside the repository.
   */
  if (
    absolutePath !==
      normalizedRepositoryPath &&
    !absolutePath.startsWith(
      normalizedRepositoryPath +
        path.sep
    )
  ) {
    throw new Error(
      "Invalid file path"
    );
  }

  if (
    !fs.existsSync(absolutePath)
  ) {
    throw new Error(
      "File not found"
    );
  }

  const stat =
    fs.statSync(absolutePath);

  if (!stat.isFile()) {
    throw new Error(
      "Requested path is not a file"
    );
  }

  const extension =
    path.extname(
      absolutePath
    ).toLowerCase();

  if (
    !allowedExtensions.has(
      extension
    )
  ) {
    throw new Error(
      "File type is not supported"
    );
  }

  return fs.readFileSync(
    absolutePath,
    "utf8"
  );
}