import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FileCode,
} from "lucide-react";

import type { RepositoryNode } from "../../../types/repository";

type Props = {
  node: RepositoryNode;
  onFileSelect: (id: string) => void;
};

function FileTree({ node, onFileSelect }: Props) {
  const [open, setOpen] = useState(true);

  // File
  if (node.type === "file") {
    return (
      <button
        onClick={() => onFileSelect(node.id)}
        className="
          ml-8
          flex
          w-full
          cursor-pointer
          items-center
          gap-2
          rounded-lg
          px-2
          py-2
          text-left
          text-gray-700
          transition
          hover:bg-violet-50
        "
      >
        <FileCode
          size={16}
          className="text-violet-600"
        />

        <span>{node.name}</span>
      </button>
    );
  }

  // Folder
  return (
    <div className="select-none">
      <button
        onClick={() => setOpen(!open)}
        className="
          flex
          w-full
          items-center
          gap-2
          rounded-lg
          px-2
          py-2
          font-medium
          transition
          hover:bg-violet-50
        "
      >
        {open ? (
          <ChevronDown size={16} />
        ) : (
          <ChevronRight size={16} />
        )}

        <Folder
          size={18}
          className="text-violet-600"
        />

        <span>{node.name}</span>
      </button>

      {open && node.children && (
        <div className="ml-5 border-l border-gray-200 pl-3">
          {node.children.map((child) => (
            <FileTree
              key={child.id}
              node={child}
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FileTree;