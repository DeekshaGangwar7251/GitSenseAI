let extractor: any = null;

async function getExtractor() {
  if (!extractor) {
    console.log("Loading local embedding model (first run only)...");

    const { pipeline } = await import("@xenova/transformers");

    extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );

    console.log("Local embedding model loaded.");
  }

  return extractor;
}

export async function generateEmbedding(
  text: string
): Promise<number[]> {
  const model = await getExtractor();

  const output = await model(text, {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(output.data);
}