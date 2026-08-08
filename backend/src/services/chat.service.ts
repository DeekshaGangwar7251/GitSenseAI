import { llm } from "./llm.service";
import { searchRepository } from "./search.service";

export async function askRepository(
  collectionName: string,
  question: string
) {
  const results = await searchRepository(
    collectionName,
    question,
    12
  );

  /*
   * Build structured evidence.
   *
   * Including filename + relevance helps the LLM
   * understand where each piece of information came from.
   */
  const context = results.documents
    .map((document, index) => {
      const metadata = results.metadatas[index];
      const distance = results.distances[index];

      const file =
        metadata?.relativePath ||
        metadata?.fileName ||
        "Unknown file";

      return `
--- Evidence ${index + 1} ---

File: ${file}
Relevance distance: ${distance}

${document}
`;
    })
    .join("\n");

  const prompt = `
You are GitSenseAI, an expert software engineer analyzing
a real software repository.

Answer the user's question using ONLY the repository evidence
provided below.

IMPORTANT RULES:

1. Do NOT invent technologies, frameworks, databases, APIs,
   authentication mechanisms, files, or features.

2. A technology should only be reported as USED when the evidence
   actually demonstrates its use.

3. Distinguish between:
   - actual dependencies
   - configuration files
   - documentation mentions
   - comments
   - dummy/example data
   - external platforms such as GitHub

4. Do NOT treat GitHub itself as an application technology.
   GitHub is a repository hosting platform unless the code actually
   integrates with the GitHub API.

5. Do NOT assume that mentioning a technology means it is actually
   used.

6. For package/dependency questions, prefer evidence from:
   - package.json
   - package-lock.json
   - import statements
   - configuration files

7. When identifying a framework or library, mention the actual file
   where it is demonstrated whenever possible.

8. If the evidence is insufficient, say:
   "I couldn't find enough evidence in the repository."

9. Never use your general knowledge to fill missing repository
   information.

10. Keep the answer concise but technically accurate.

11. If multiple files confirm the same technology, combine them
    instead of repeating the technology.

12. Do not report a technology merely because it appears inside
    another dependency's metadata.

Repository Evidence:

${context}

User Question:

${question}

Now answer the question based strictly on the repository evidence.
`;

  const response = await llm.invoke(prompt);

  return {
    answer: String(response.content),
    sources: results.metadatas,
  };
}