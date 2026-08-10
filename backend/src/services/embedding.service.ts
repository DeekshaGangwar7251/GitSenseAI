import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY!,
  model: "gemini-embedding-001",
});

// Used by search.service.ts and vector.service.ts
export async function generateEmbedding(
  text: string
): Promise<number[]> {
  const result = await embeddings.embedQuery(text);

  if (
    !Array.isArray(result) ||
    result.length === 0 ||
    !result.every(
      (value) => typeof value === "number"
    )
  ) {
    throw new Error(
      "Gemini returned an invalid query embedding"
    );
  }

  return result;
}

// Used by index.service.ts
export async function generateEmbeddings(
  texts: string[]
): Promise<number[][]> {
  console.log(
    `Generating Gemini embeddings for ${texts.length} texts...`
  );

  const results =
    await embeddings.embedDocuments(texts);

  if (results.length !== texts.length) {
    throw new Error(
      `Gemini returned ${results.length} embeddings for ${texts.length} texts.`
    );
  }

  for (let i = 0; i < results.length; i++) {
    const embedding = results[i];

    if (
      !Array.isArray(embedding) ||
      embedding.length === 0 ||
      !embedding.every(
        (value) => typeof value === "number"
      )
    ) {
      console.error(
        `Invalid Gemini embedding at index ${i}`
      );

      console.error(
        `Text length: ${texts[i]?.length ?? 0}`
      );

      console.error(
        `Text preview: ${texts[i]?.slice(0, 300)}`
      );

      throw new Error(
        `Gemini returned an invalid embedding at index ${i}`
      );
    }
  }

  return results;
}