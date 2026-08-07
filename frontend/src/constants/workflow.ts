import {
  Link2,
  GitBranch,
  FolderTree,
  Database,
  BrainCircuit,
  MessageCircle,
} from "lucide-react";

export const workflow = [
  {
    title: "Paste Repository URL",
    description: "Enter a public GitHub repository URL or upload a ZIP file.",
    icon: Link2,
  },
  {
    title: "Clone Repository",
    description: "GitSenseAI securely clones and reads the repository.",
    icon: GitBranch,
  },
  {
    title: "Parse Source Code",
    description: "Every source file is analyzed and divided into meaningful chunks.",
    icon: FolderTree,
  },
  {
    title: "Build Vector Database",
    description: "Embeddings are created and stored for semantic retrieval.",
    icon: Database,
  },
  {
    title: "LLM + RAG Analysis",
    description: "The AI understands architecture, APIs, authentication and business logic.",
    icon: BrainCircuit,
  },
  {
    title: "Ask Questions",
    description: "Chat with your repository and receive contextual answers with citations.",
    icon: MessageCircle,
  },
];