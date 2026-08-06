import { searchRepository } from "./search.service";
import { llm } from "./llm.service";

export async function answerQuestion(
  collectionName: string,
  question: string
) {
  const results = await searchRepository(
    collectionName,
    question,
    5
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
You are an expert software engineer.

Answer the user's question ONLY using the repository context below.

If the answer cannot be found in the repository, reply:
"I could not find this information in the repository."

Repository Context:

${context}

Question:
${question}
`;

  const response = await llm.invoke(prompt);

  return response.content;
}