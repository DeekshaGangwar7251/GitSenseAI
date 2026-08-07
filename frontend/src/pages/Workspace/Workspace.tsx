import { useState } from "react";

import WorkspaceHeader from "../../components/workspace/WorkspaceHeader";
import RepositorySidebar from "../../components/workspace/RepositorySidebar";
import WelcomeCard from "../../components/workspace/WelcomeCard";
import ChatWindow from "../../components/workspace/ChatWindow";
import ChatInput from "../../components/workspace/ChatInput";
import CodeViewer from "../../components/workspace/CodeViewer";

import { fileContents } from "../../data/fileContents";

import type { Message } from "../../types/chat";

function Workspace() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      text: "Hello 👋 I'm GitSenseAI. Ask me anything about your repository.",
      animated: true,
    },
  ]);

  const [selectedFile, setSelectedFile] = useState("chat");

  // Called when the typewriter finishes
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

  const handleSend = (text: string) => {
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

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.loading
            ? {
                ...msg,
                loading: false,
                animated: false, // animate only this new response
                text:
                  "This is a simulated AI response. Later this will come from Gemini + LangChain after analyzing the repository.",
              }
            : msg
        )
      );
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <WorkspaceHeader />

      <main className="mx-auto flex max-w-7xl gap-8 px-6 py-8">
        <RepositorySidebar onFileSelect={setSelectedFile} />

        <section className="flex-1 space-y-6">
          <WelcomeCard onQuestionClick={handleSend} />

          <ChatWindow
            messages={messages}
            onAnimationComplete={markMessageAnimated}
          />

          <ChatInput onSend={handleSend} />

          <CodeViewer
            fileName={selectedFile}
            code={fileContents[selectedFile] ?? "// File not found"}
          />
        </section>
      </main>
    </div>
  );
}

export default Workspace;