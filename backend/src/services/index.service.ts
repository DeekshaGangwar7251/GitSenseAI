import { Document } from "@langchain/core/documents";
import { getCollection } from "./vector.service";
import { generateEmbeddings } from "./embedding.service";

const BATCH_SIZE = 5;
const MAX_EMBEDDING_CHARS = 2000;

export async function indexDocuments(
  documents: Document[],
  collectionName: string
) {
  const collection = await getCollection(collectionName);

  // --------------------------------------------------
  // Filter out dependency lock files
  // --------------------------------------------------
  const filteredDocuments = documents.filter((doc) => {
    const fileName =
      doc.metadata.fileName?.toLowerCase() ?? "";

    return (
      fileName !== "package-lock.json" &&
      fileName !== "yarn.lock" &&
      fileName !== "pnpm-lock.yaml"
    );
  });

  console.log(
    `Original chunks: ${documents.length}`
  );

  console.log(
    `Chunks after filtering lock files: ${filteredDocuments.length}`
  );

  console.log(
    `Indexing ${filteredDocuments.length} chunks...`
  );

  // --------------------------------------------------
  // Process documents in small batches
  // --------------------------------------------------
  for (
    let start = 0;
    start < filteredDocuments.length;
    start += BATCH_SIZE
  ) {
    const batch = filteredDocuments.slice(
      start,
      start + BATCH_SIZE
    );

    // --------------------------------------------------
    // Prepare text for Gemini embedding
    // --------------------------------------------------
    const textsToEmbed = batch.map((doc, index) => {
      const content = doc.pageContent
        .replace(/\0/g, "")
        .slice(0, MAX_EMBEDDING_CHARS);

      console.log(
        `Embedding item ${index + 1}: ${
          doc.metadata.relativePath
        } (${content.length} chars)`
      );

      return `
File: ${doc.metadata.relativePath}
Extension: ${doc.metadata.extension}

${content}
`;
    });

    const processedBeforeBatch = start;

    console.log(
      `Generating embeddings for ${
        processedBeforeBatch + 1
      }-${Math.min(
        start + batch.length,
        filteredDocuments.length
      )}/${filteredDocuments.length}`
    );

    // --------------------------------------------------
    // Generate Gemini embeddings
    // --------------------------------------------------
    const embeddings =
      await generateEmbeddings(textsToEmbed);

    // --------------------------------------------------
    // Validate Gemini response
    // --------------------------------------------------
    if (
      embeddings.length !== batch.length ||
      embeddings.some(
        (embedding) =>
          !Array.isArray(embedding) ||
          embedding.length === 0 ||
          embedding.some(
            (value) => typeof value !== "number"
          )
      )
    ) {
      throw new Error(
        `Invalid Gemini embeddings. Expected ${batch.length} embeddings, received ${embeddings.length}.`
      );
    }

    // --------------------------------------------------
    // Prepare ChromaDB records
    // --------------------------------------------------
    const ids: string[] = [];
    const texts: string[] = [];
    const metadatas: Record<string, any>[] = [];

    batch.forEach((doc, index) => {
      ids.push(
        `${doc.metadata.fileName}-${start + index}-${Date.now()}`
      );

      // Store the COMPLETE document in ChromaDB.
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

    // --------------------------------------------------
    // Store embeddings + documents in ChromaDB
    // --------------------------------------------------
    await collection.add({
      ids,
      embeddings,
      documents: texts,
      metadatas,
    });

    // --------------------------------------------------
    // Progress
    // --------------------------------------------------
    const processed = Math.min(
      start + batch.length,
      filteredDocuments.length
    );

    const percentage = (
      (processed / filteredDocuments.length) *
      100
    ).toFixed(1);

    console.log(
      `Stored ${processed}/${filteredDocuments.length} chunks (${percentage}%)`
    );
  }

  console.log(
    "Repository indexed successfully!"
  );
}