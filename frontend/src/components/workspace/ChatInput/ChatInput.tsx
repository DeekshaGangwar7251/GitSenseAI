import { useState } from "react";
import { SendHorizonal } from "lucide-react";

type Props = {
  onSend: (message: string) => void;
};

function ChatInput({ onSend }: Props) {
  const [value, setValue] = useState("");

  const sendMessage = () => {
    if (!value.trim()) return;

    onSend(value);

    setValue("");
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">

      <div className="flex gap-4">

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder="Ask GitSenseAI about this repository..."
          className="flex-1 rounded-2xl border border-gray-200 px-5 py-4 outline-none focus:border-violet-500"
        />

        <button
          onClick={sendMessage}
          className="rounded-2xl bg-violet-600 px-6 text-white transition hover:bg-violet-700"
        >
          <SendHorizonal size={20} />
        </button>

      </div>

    </div>
  );
}

export default ChatInput;