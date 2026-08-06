import { ChromaClient } from "chromadb";

const client = new ChromaClient({
  path: "http://localhost:8000",
});

export async function getCollection(collectionName: string) {
  try {
    return await client.getCollection({
      name: collectionName,
    });
  } catch {
    console.log(`Creating collection: ${collectionName}`);

    return await client.createCollection({
      name: collectionName,
    });
  }
}

export async function isCollectionIndexed(
  collectionName: string
): Promise<boolean> {
  try {
    const collection = await client.getCollection({
      name: collectionName,
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