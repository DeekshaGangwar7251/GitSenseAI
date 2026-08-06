import { Document } from "@langchain/core/documents";
import { getCollection } from "./vector.service";
import { generateEmbedding } from "./embedding.service";
import { retry } from "../utils/retry";


const BATCH_SIZE = 50;

export async function indexDocuments(
  documents: Document[],
  collectionName: string
){
const collection = await getCollection(collectionName);

  const ids: string[] = [];
  const embeddings: number[][] = [];
  const texts: string[] = [];
  const metadatas: Record<string, any>[] = [];

  console.log(`Indexing ${documents.length} chunks...`);

  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i];

const embedding = await retry(() =>
  generateEmbedding(doc.pageContent)
);

    ids.push(
  `${doc.metadata.fileName}-${i}-${Date.now()}`
);
    embeddings.push(embedding);
    texts.push(doc.pageContent);

   metadatas.push({
  source: doc.metadata.source ?? "",
  relativePath: doc.metadata.relativePath ?? "",
  fileName: doc.metadata.fileName ?? "",
  extension: doc.metadata.extension ?? "",
});

    if ((i + 1) % 10 === 0 || i === documents.length - 1) {
     const percentage = (
  ((i + 1) / documents.length) * 100
).toFixed(1);

console.log(
  `Processed ${i + 1}/${documents.length} (${percentage}%)`
);
    }
  }

 for (let i = 0; i < ids.length; i += BATCH_SIZE) {
  const end = Math.min(i + BATCH_SIZE, ids.length);

  await collection.add({
    ids: ids.slice(i, end),
    embeddings: embeddings.slice(i, end),
    documents: texts.slice(i, end),
    metadatas: metadatas.slice(i, end),
  });

  console.log(
    `Stored ${end}/${ids.length} chunks in ChromaDB`
  );
}

console.log("Repository indexed successfully!");
}