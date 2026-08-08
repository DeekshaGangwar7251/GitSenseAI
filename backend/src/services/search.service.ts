import { generateEmbedding } from "./embedding.service";
import { getCollection } from "./vector.service";

interface SearchResult {
  document: string;
  metadata: Record<string, any>;
  distance: number;
}

/*
 * Expand the user's question into multiple
 * repository-specific semantic queries.
 *
 * This does NOT call the LLM.
 * Therefore, it does not consume Groq TPM.
 */
function expandQuery(query: string): string[] {
  const q = query.toLowerCase();

  const queries: string[] = [query];

  // Technologies / dependencies
  if (
    q.includes("technolog") ||
    q.includes("tech stack") ||
    q.includes("library") ||
    q.includes("libraries") ||
    q.includes("framework") ||
    q.includes("dependency") ||
    q.includes("dependencies") ||
    q.includes("package")
  ) {
    queries.push(
      "package.json dependencies devDependencies frameworks libraries runtime",
      "technology stack programming languages frameworks libraries packages",
      "imports dependencies package configuration",
      "frontend package.json backend package.json"
    );
  }

  // Architecture
  if (
    q.includes("architecture") ||
    q.includes("structure") ||
    q.includes("flow") ||
    q.includes("how does") ||
    q.includes("how it works")
  ) {
    queries.push(
      "application architecture frontend backend services controllers components data flow",
      "project structure modules services controllers routes components",
      "frontend backend communication API data flow"
    );
  }

  // APIs / Routes
  if (
    q.includes("api") ||
    q.includes("route") ||
    q.includes("routes") ||
    q.includes("endpoint") ||
    q.includes("http")
  ) {
    queries.push(
      "API routes endpoints GET POST PUT PATCH DELETE",
      "Express router routes controllers endpoints",
      "backend routes API request response"
    );
  }

  // Authentication
  if (
    q.includes("auth") ||
    q.includes("authentication") ||
    q.includes("authorization") ||
    q.includes("login") ||
    q.includes("signup") ||
    q.includes("jwt") ||
    q.includes("token") ||
    q.includes("password")
  ) {
    queries.push(
      "authentication authorization login signup JWT token password",
      "auth middleware protected routes authorization",
      "authentication controller service middleware"
    );
  }

  // Database / Storage
  if (
    q.includes("database") ||
    q.includes("storage") ||
    q.includes("mongodb") ||
    q.includes("mysql") ||
    q.includes("postgres") ||
    q.includes("redis") ||
    q.includes("chroma") ||
    q.includes("vector")
  ) {
    queries.push(
      "database models schema MongoDB MySQL PostgreSQL Redis",
      "ChromaDB vector database collections embeddings",
      "database connection ORM Mongoose Prisma storage"
    );
  }

  // Frontend
  if (
    q.includes("frontend") ||
    q.includes("react") ||
    q.includes("ui") ||
    q.includes("component") ||
    q.includes("page")
  ) {
    queries.push(
      "React frontend components pages hooks state management",
      "frontend src components pages routing UI",
      "React Router frontend application"
    );
  }

  // Backend
  if (
    q.includes("backend") ||
    q.includes("server") ||
    q.includes("controller") ||
    q.includes("service")
  ) {
    queries.push(
      "Node.js Express backend server controllers services middleware",
      "backend src controllers routes services",
      "Express application API business logic"
    );
  }

  // Bugs / Issues
  if (
    q.includes("bug") ||
    q.includes("issue") ||
    q.includes("error") ||
    q.includes("problem") ||
    q.includes("security") ||
    q.includes("vulnerability")
  ) {
    queries.push(
      "TODO FIXME error exception validation security vulnerability",
      "error handling missing validation hardcoded secrets",
      "potential bugs security issues source code"
    );
  }

  // Folder / File structure
  if (
    q.includes("folder") ||
    q.includes("file") ||
    q.includes("directory")
  ) {
    queries.push(
      "folder directory file structure frontend backend src components services",
      "important source files project directories package.json"
    );
  }

  // Remove duplicate queries
  return [...new Set(queries)];
}

export async function searchRepository(
  collectionName: string,
  query: string,
  topK: number = 12
) {
  const collection = await getCollection(collectionName);

  /*
   * Generate multiple semantic queries.
   */
  const queries = expandQuery(query);

  console.log(
    `Searching repository with ${queries.length} semantic queries...`
  );

  const allResults: SearchResult[] = [];

  /*
   * Search each query separately.
   *
   * Sequential execution is intentional because
   * the local embedding model can be resource intensive.
   */
  for (const searchQuery of queries) {
    try {
      const queryEmbedding =
        await generateEmbedding(searchQuery);

      const results = await collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: Math.min(8, topK),
      });

      const documents =
        results.documents?.[0] ?? [];

      const metadatas =
        results.metadatas?.[0] ?? [];

      const distances =
        results.distances?.[0] ?? [];

      for (let i = 0; i < documents.length; i++) {
        const document = documents[i];

        if (!document) {
          continue;
        }

        const metadata =
          (metadatas[i] as Record<string, any>) ?? {};

        /*
         * ChromaDB may return null/undefined for a distance.
         * Explicitly convert it to a number so TypeScript
         * accepts the SearchResult interface.
         */
        const rawDistance = distances[i];

        const distance: number =
          typeof rawDistance === "number"
            ? rawDistance
            : 999;

        allResults.push({
          document,
          metadata,
          distance,
        });
      }
    } catch (error) {
      console.error(
        `Search failed for query: "${searchQuery}"`,
        error
      );
    }
  }

  /*
   * Remove duplicate chunks.
   *
   * The same chunk can be returned by multiple
   * semantic queries.
   */
  const uniqueResults =
    new Map<string, SearchResult>();

  for (const result of allResults) {
    const file =
      result.metadata?.relativePath ??
      result.metadata?.fileName ??
      "unknown";

    const key =
      `${file}::${result.document.slice(0, 150)}`;

    const existing =
      uniqueResults.get(key);

    /*
     * Keep the result with the better
     * semantic distance.
     */
    if (
      !existing ||
      result.distance < existing.distance
    ) {
      uniqueResults.set(key, result);
    }
  }

  /*
   * Sort by semantic relevance.
   *
   * Lower ChromaDB distance = more relevant.
   */
  const rankedResults =
    [...uniqueResults.values()].sort(
      (a, b) => a.distance - b.distance
    );

  /*
   * Prevent one file from dominating the results.
   *
   * Maximum 3 chunks from the same file.
   */
  const fileCounts =
    new Map<string, number>();

  const diverseResults: SearchResult[] = [];

  for (const result of rankedResults) {
    const file =
      result.metadata?.relativePath ??
      result.metadata?.fileName ??
      "unknown";

    const count =
      fileCounts.get(file) ?? 0;

    if (count >= 3) {
      continue;
    }

    fileCounts.set(file, count + 1);

    diverseResults.push(result);

    if (diverseResults.length >= topK) {
      break;
    }
  }

  /*
   * If diversity filtering produced fewer results,
   * fill the remaining slots with the best unused results.
   */
  if (diverseResults.length < topK) {
    const selected =
      new Set(diverseResults);

    for (const result of rankedResults) {
      if (selected.has(result)) {
        continue;
      }

      diverseResults.push(result);

      if (diverseResults.length >= topK) {
        break;
      }
    }
  }

  console.log(
    `Retrieved ${diverseResults.length} unique repository chunks`
  );

  /*
   * Keep the same return structure as the
   * previous searchRepository implementation.
   *
   * This means chat.service.ts and report.service.ts
   * can continue using it without changes.
   */
  return {
    documents: diverseResults.map(
      (item) => item.document
    ),

    metadatas: diverseResults.map(
      (item) => item.metadata
    ),

    distances: diverseResults.map(
      (item) => item.distance
    ),
  };
}