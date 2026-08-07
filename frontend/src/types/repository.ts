export interface RepositoryNode {
  id: string;
  name: string;
  type: "folder" | "file";
  children?: RepositoryNode[];
}