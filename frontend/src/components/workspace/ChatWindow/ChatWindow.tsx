import { useEffect, useRef } from "react";
import { Bot, User } from "lucide-react";

import Typewriter from "../../common/Typewriter";
import ThinkingDots from "../../common/ThinkingDots";

import type { Message } from "../../../types/chat";

type Props = {
  messages: Message[];
  onAnimationComplete: (id: number) => void;
};

function ChatWindow({
  messages,
  onAnimationComplete,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-100 px-8 py-5">
        <h2 className="text-xl font-bold">Conversation</h2>
      </div>

      {/* Messages */}
      <div className="max-h-[520px] space-y-6 overflow-y-auto p-8">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 ${
              message.sender === "user" ? "justify-end" : ""
            }`}
          >
            {/* AI Avatar */}
            {message.sender === "ai" && (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white">
                <Bot size={20} />
              </div>
            )}

            {/* Message Bubble */}
            <div
              className={`max-w-xl rounded-2xl p-5 ${
                message.sender === "user"
                  ? "bg-violet-600 text-white"
                  : "bg-violet-50 text-gray-800"
              }`}
            >
              {message.loading ? (
                <ThinkingDots />
              ) : message.sender === "ai" ? (
                <Typewriter
                  text={message.text}
                  animate={!message.animated}
                  onFinished={() =>
                    onAnimationComplete(message.id)
                  }
                />
              ) : (
                <p>{message.text}</p>
              )}
            </div>

            {/* User Avatar */}
            {message.sender === "user" && (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white">
                <User size={20} />
              </div>
            )}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export default ChatWindow;