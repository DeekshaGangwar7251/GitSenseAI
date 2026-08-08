// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { llm } from "./llm.service";
import { searchRepository } from "./search.service";

export async function askRepository(
  collectionName: string,
  question: string
) {
  const results = await searchRepository(
    collectionName,
    question,
    5
  );

  const context = results.documents.join("\n\n");

  const prompt = `
You are an expert software engineer.

Answer the user's question ONLY using the repository context.

If the answer is not present, say:
"I couldn't find this information in the repository."

Repository Context:

${context}

Question:
${question}
`;

  const response = await llm.invoke(prompt);

  return {
    answer: response.content,
    sources: results.metadatas,
  };
}