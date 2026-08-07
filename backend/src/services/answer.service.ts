import { searchRepository } from "./search.service";
import { llm } from "./llm.service";

export async function answerQuestion(
  collectionName: string,
  question: string
) {
  const searchQuery = `
Repository question:
${question}

Find code, documentation, functions, classes,
imports, exports, APIs and configuration related
to this question.
`;

  const results = await searchRepository(
    collectionName,
    searchQuery,
    8
  );

  const context = results.documents
    .map((doc, index) => {
      const metadata = results.metadatas[index];

      return `
File: ${metadata?.fileName ?? "Unknown"}
Path: ${metadata?.relativePath ?? "Unknown"}

${doc}
`;
    })
    .join("\n----------------------------------------\n");

  const prompt = `
You are an expert software engineer analyzing a GitHub repository.

Your job is to answer the user's question using ONLY the repository
context provided below.

Rules:
1. Do not invent files, functions, technologies, or behavior.
2. If the information is not present in the context, say:
   "I couldn't find this information in the repository."
3. When possible, mention the relevant file paths.
4. If multiple files are involved, explain how they are related.
5. Give a clear and concise technical explanation.

Repository Context:
${context}

User Question:
${question}
`;

  const response = await llm.invoke(prompt);

  return {
    answer: response.content,
    sources: results.metadatas,
  };
}