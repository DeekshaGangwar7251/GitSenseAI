import { useState } from "react";
import { Copy, Check, Sparkles } from "lucide-react";

type Props = {
  fileName: string;
  code: string;
};

function CodeViewer({
  fileName,
  code,
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h2 className="font-bold text-lg">
          {fileName}
        </h2>

        <div className="flex gap-3">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-xl border px-4 py-2 transition hover:bg-violet-50"
          >
            {copied ? (
              <>
                <Check size={18} className="text-green-600" />
                <span className="text-green-600 font-medium">
                  Copied!
                </span>
              </>
            ) : (
              <>
                <Copy size={18} />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Explain Button */}
          <button className="rounded-xl bg-violet-600 px-4 py-2 text-white transition hover:bg-violet-700">
            <div className="flex items-center gap-2">
              <Sparkles size={16} />
              Explain
            </div>
          </button>
        </div>
      </div>

      {/* Code */}
      <pre className="overflow-auto rounded-b-3xl bg-[#fafafa] p-6 text-sm leading-7">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default CodeViewer;