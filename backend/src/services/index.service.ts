import { Document } from "@langchain/core/documents";
import { getCollection } from "./vector.service";
import { generateEmbeddings } from "./embedding.service";
import { retry } from "../utils/retry";

const EMBEDDING_BATCH_SIZE = 10;
const CHROMA_BATCH_SIZE = 50;

export async function indexDocuments(
  documents: Document[],
  collectionName: string
) {
  const collection = await getCollection(collectionName);

  console.log(
    `Indexing ${documents.length} chunks...`
  );

  for (
    let start = 0;
    start < documents.length;
    start += EMBEDDING_BATCH_SIZE
  ) {
    const batch = documents.slice(
      start,
      start + EMBEDDING_BATCH_SIZE
    );

    const textsToEmbed = batch.map((doc) => {
      return `
File: ${doc.metadata.relativePath}
Extension: ${doc.metadata.extension}

${doc.pageContent}
`;
    });

    console.log(
      `Generating embeddings: ${start + 1}-${Math.min(
        start + batch.length,
        documents.length
      )}/${documents.length}`
    );

    // Generate embeddings for the whole batch
    const embeddings = await retry(() =>
      generateEmbeddings(textsToEmbed)
    );

    const ids: string[] = [];
    const texts: string[] = [];
    const metadatas: Record<string, any>[] = [];

    batch.forEach((doc, index) => {
      ids.push(
        `${doc.metadata.fileName}-${start + index}-${Date.now()}`
      );

      texts.push(doc.pageContent);

      metadatas.push({
        source: doc.metadata.source ?? "",
        relativePath:
          doc.metadata.relativePath ?? "",
        fileName:
          doc.metadata.fileName ?? "",
        extension:
          doc.metadata.extension ?? "",
      });
    });

    // Store this batch in ChromaDB
    for (
      let i = 0;
      i < ids.length;
      i += CHROMA_BATCH_SIZE
    ) {
      const end = Math.min(
        i + CHROMA_BATCH_SIZE,
        ids.length
      );

      await collection.add({
        ids: ids.slice(i, end),
        embeddings: embeddings.slice(i, end),
        documents: texts.slice(i, end),
        metadatas: metadatas.slice(i, end),
      });
    }

    const processed = Math.min(
      start + batch.length,
      documents.length
    );

    const percentage = (
      (processed / documents.length) *
      100
    ).toFixed(1);

    console.log(
      `Processed ${processed}/${documents.length} (${percentage}%)`
    );
  }

  console.log(
    "Repository indexed successfully!"
  );
}