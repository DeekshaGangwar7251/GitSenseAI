import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FileCode,
} from "lucide-react";

type RepositoryFile = {
  path: string;
  name: string;
  type: "file" | "folder";
  children?: RepositoryFile[];
};

type Props = {
  node: RepositoryFile;
  onFileSelect: (path: string) => void;
};

function FileTree({ node, onFileSelect }: Props) {
  const [open, setOpen] = useState(true);

  // File
  if (node.type === "file") {
    return (
      <button
        onClick={() => onFileSelect(node.path)}
        className="flex w-full min-w-0 items-center gap-2 rounded-lg px-2 py-2 text-left text-gray-700 transition hover:bg-violet-50"
      >
        <FileCode
          size={16}
          className="shrink-0 text-gray-500"
        />

        <span className="truncate">
          {node.name}
        </span>
      </button>
    );
  }

  // Folder
  return (
    <div className="min-w-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full min-w-0 items-center gap-2 rounded-lg px-2 py-2 text-left font-medium transition hover:bg-violet-50"
      >
        {open ? (
          <ChevronDown
            size={16}
            className="shrink-0 text-gray-500"
          />
        ) : (
          <ChevronRight
            size={16}
            className="shrink-0 text-gray-500"
          />
        )}

        <Folder
          size={18}
          className="shrink-0 text-violet-600"
        />

        <span className="truncate">
          {node.name}
        </span>
      </button>

      {open && node.children && (
        <div className="ml-4 min-w-0 border-l border-gray-200 pl-3">
          {node.children.map((child) => (
            <FileTree
              key={child.path}
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