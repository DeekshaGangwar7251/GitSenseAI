import { useEffect, useState } from "react";

import WorkspaceHeader from "../../components/workspace/WorkspaceHeader";
import RepositorySidebar from "../../components/workspace/RepositorySidebar";
import WelcomeCard from "../../components/workspace/WelcomeCard";
import ChatWindow from "../../components/workspace/ChatWindow";
import ChatInput from "../../components/workspace/ChatInput";
import CodeViewer from "../../components/workspace/CodeViewer";

import type { Message } from "../../types/chat";

type RepositoryFile = {
  path: string;
  name: string;
  type: "file" | "folder";
  children?: RepositoryFile[];
};

function Workspace() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      text: "Hello 👋 I'm GitSenseAI. Ask me anything about your repository.",
      animated: true,
    },
  ]);

  const [selectedFile, setSelectedFile] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [loadingFile, setLoadingFile] = useState(false);

  const [repositoryTree, setRepositoryTree] = useState<
    RepositoryFile[]
  >([]);

  /*
   * Get repository information from sessionStorage
   */
  const getRepositoryInfo = () => {
    const repositoryInfo =
      sessionStorage.getItem("repositoryInfo");

    if (!repositoryInfo) {
      return null;
    }

    try {
      return JSON.parse(repositoryInfo);
    } catch {
      return null;
    }
  };

  /*
   * Load actual repository file tree
   */
  useEffect(() => {
    const loadRepositoryFiles = async () => {
      const repositoryInfo = getRepositoryInfo();

      if (!repositoryInfo?.collectionName) {
        console.error(
          "Repository collection not found."
        );
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/repository/files?collectionName=${encodeURIComponent(
            repositoryInfo.collectionName
          )}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to load repository files."
          );
        }

        setRepositoryTree(data.files);
      } catch (error) {
        console.error(
          "Failed to load repository tree:",
          error
        );
      }
    };

    loadRepositoryFiles();
  }, []);

  /*
   * Load actual file content
   */
  const handleFileSelect = async (filePath: string) => {
    const repositoryInfo = getRepositoryInfo();

    if (!repositoryInfo?.collectionName) {
      return;
    }

    setSelectedFile(filePath);
    setLoadingFile(true);
    setFileContent("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/repository/file?collectionName=${encodeURIComponent(
          repositoryInfo.collectionName
        )}&filePath=${encodeURIComponent(filePath)}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load file content."
        );
      }

      setFileContent(data.content);
    } catch (error) {
      console.error(
        "Failed to load file:",
        error
      );

      setFileContent(
        error instanceof Error
          ? error.message
          : "Failed to load file."
      );
    } finally {
      setLoadingFile(false);
    }
  };

  /*
   * Typewriter animation completion
   */
  const markMessageAnimated = (id: number) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id
          ? {
              ...msg,
              animated: true,
            }
          : msg
      )
    );
  };

  /*
   * Send question to backend
   */
  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const repositoryInfo = getRepositoryInfo();

    if (!repositoryInfo) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "ai",
          text:
            "Repository information was not found. Please analyze the repository again.",
          animated: true,
        },
      ]);

      return;
    }

    const collectionName =
      repositoryInfo.collectionName;

    if (!collectionName) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "ai",
          text:
            "Repository collection was not found. Please analyze the repository again.",
          animated: true,
        },
      ]);

      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text,
      animated: true,
    };

    const loadingMessage: Message = {
      id: Date.now() + 1,
      sender: "ai",
      text: "GitSenseAI is thinking...",
      loading: true,
      animated: true,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
      loadingMessage,
    ]);

    try {
      const response = await fetch(
        "http://localhost:5000/api/repository/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            collectionName,
            question: text,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to get AI response."
        );
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessage.id
            ? {
                ...msg,
                loading: false,
                animated: false,
                text: String(data.answer),
              }
            : msg
        )
      );
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessage.id
            ? {
                ...msg,
                loading: false,
                animated: false,
                text:
                  error instanceof Error
                    ? error.message
                    : "Failed to get a response from GitSenseAI.",
              }
            : msg
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <WorkspaceHeader />

     <main className="mx-auto flex max-w-7xl flex-col gap-6 px-3 py-4 sm:px-5 sm:py-6 lg:flex-row lg:gap-8 lg:px-6 lg:py-8">

  {/* Repository Explorer */}
  <RepositorySidebar
    repositoryTree={repositoryTree}
    onFileSelect={handleFileSelect}
  />

  {/* Main Workspace */}
  <div className="min-w-0 flex-1 space-y-6">

    <WelcomeCard
      onQuestionClick={handleSend}
    />

    <ChatWindow
      messages={messages}
      onAnimationComplete={markMessageAnimated}
    />

    <ChatInput
      onSend={handleSend}
    />

    <CodeViewer
      fileName={
        selectedFile || "Select a file"
      }
      code={
        loadingFile
          ? "// Loading file..."
          : fileContent ||
            "// Select a file from the repository explorer"
      }
    />

  </div>

</main>
    </div>
  );
}

export default Workspace;