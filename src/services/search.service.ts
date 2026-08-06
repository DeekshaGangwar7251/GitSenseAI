import { generateEmbedding } from "./embedding.service";
import { getCollection } from "./vector.service";

export async function searchRepository(
  collectionName: string,
  query: string,
  topK: number = 5
) {
  const collection = await getCollection(collectionName);

  const queryEmbedding = await generateEmbedding(query);

  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: topK,
  });

  return {
    documents: results.documents?.[0] ?? [],
    metadatas: results.metadatas?.[0] ?? [],
    distances: results.distances?.[0] ?? [],
  };
}