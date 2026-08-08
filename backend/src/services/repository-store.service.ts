const repositoryStore = new Map<string, string>();


export function saveRepository(
  collectionName: string,
  repositoryPath: string
) {
  repositoryStore.set(
    collectionName,
    repositoryPath
  );
}


export function getRepositoryPath(
  collectionName: string
): string | undefined {
  return repositoryStore.get(
    collectionName
  );
}