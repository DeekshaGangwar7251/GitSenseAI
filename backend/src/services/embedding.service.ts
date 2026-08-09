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

// Single text embedding
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

// Multiple text embeddings
export async function generateEmbeddings(
  texts: string[]
): Promise<number[][]> {
  const model = await getExtractor();

  console.log(`Generating embeddings for ${texts.length} chunks...`);

  const output = await model(texts, {
    pooling: "mean",
    normalize: true,
  });

  const data = Array.from(output.data) as number[];

  // all-MiniLM-L6-v2 produces 384-dimensional embeddings
  const dimension = 384;

  const embeddings: number[][] = [];

  for (let i = 0; i < texts.length; i++) {
    embeddings.push(
      data.slice(
        i * dimension,
        (i + 1) * dimension
      )
    );
  }

  return embeddings;
}