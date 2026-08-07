import { generateEmbedding } from "./embedding.service";
import { getCollection } from "./vector.service";

export async function searchRepository(
  collectionName: string,
  query: string,
  topK: number = 10
) {
  const collection = await getCollection(collectionName);

  const queryEmbedding = await generateEmbedding(query);

  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: topK,
  });

  const documents = results.documents?.[0] ?? [];
  const metadatas = results.metadatas?.[0] ?? [];
  const distances = results.distances?.[0] ?? [];

  const seen = new Set<string>();

  const filtered = documents
    .map((document, index) => ({
      document,
      metadata: metadatas[index],
      distance: distances[index],
    }))
    .filter(
      (
        item
      ): item is {
        document: string;
        metadata: Record<string, any>;
        distance: number;
      } => item.document !== null
    )
    .filter((item) => {
      const key = `${item.metadata?.relativePath}-${item.document.slice(0, 100)}`;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });

  return {
    documents: filtered.map((item) => item.document),
    metadatas: filtered.map((item) => item.metadata),
    distances: filtered.map((item) => item.distance),
  };
}