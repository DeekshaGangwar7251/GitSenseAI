import { ChromaClient } from "chromadb";
import { generateEmbedding } from "./embedding.service";

const chromaUrl = process.env.CHROMA_URL;

if (!chromaUrl) {
  throw new Error("CHROMA_URL is not defined");
}

const url = new URL(chromaUrl);

const client = new ChromaClient({
  host: url.hostname,
  port: Number(url.port || 443),
  ssl: url.protocol === "https:",
});

// Embedding function used by Chroma for queries/additional operations
const embeddingFunction = {
  generate: async (
    texts: string[]
  ): Promise<number[][]> => {
    const embeddings: number[][] = [];

    for (const text of texts) {
      const embedding = await generateEmbedding(text);
      embeddings.push(embedding);
    }

    return embeddings;
  },
};

export async function getCollection(
  collectionName: string
) {
  try {
    return await client.getCollection({
      name: collectionName,
      embeddingFunction,
    });
  } catch {
    console.log(
      `Creating collection: ${collectionName}`
    );

    return await client.createCollection({
      name: collectionName,
      embeddingFunction,
    });
  }
}

export async function isCollectionIndexed(
  collectionName: string
): Promise<boolean> {
  try {
    const collection = await client.getCollection({
      name: collectionName,
      embeddingFunction,
    });

    const count = await collection.count();

    return count > 0;
  } catch {
    return false;
  }
}

export async function deleteCollection(
  collectionName: string
): Promise<void> {
  try {
    await client.deleteCollection({
      name: collectionName,
    });

    console.log(
      `Deleted collection: ${collectionName}`
    );
  } catch {
    console.log(
      `Collection "${collectionName}" does not exist.`
    );
  }
}