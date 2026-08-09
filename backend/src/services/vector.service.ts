import { ChromaClient } from "chromadb";
import { generateEmbedding } from "./embedding.service";

const client = new ChromaClient({
  host: "gitsenseai-chromadb.onrender.com",
  port: 443,
  ssl: true,
});

// Use our local Xenova embedding model
const localEmbeddingFunction = {
  generate: async (texts: string[]): Promise<number[][]> => {
    const embeddings: number[][] = [];

    for (const text of texts) {
      const embedding = await generateEmbedding(text);
      embeddings.push(embedding);
    }

    return embeddings;
  },
};

export async function getCollection(collectionName: string) {
  try {
    return await client.getCollection({
      name: collectionName,
      embeddingFunction: localEmbeddingFunction,
    });
  } catch {
    console.log(`Creating collection: ${collectionName}`);

    return await client.createCollection({
      name: collectionName,
      embeddingFunction: localEmbeddingFunction,
    });
  }
}

export async function isCollectionIndexed(
  collectionName: string
): Promise<boolean> {
  try {
    const collection = await client.getCollection({
      name: collectionName,
      embeddingFunction: localEmbeddingFunction,
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

    console.log(`Deleted collection: ${collectionName}`);
  } catch (error) {
    console.log(`Collection "${collectionName}" does not exist.`);
  }
}