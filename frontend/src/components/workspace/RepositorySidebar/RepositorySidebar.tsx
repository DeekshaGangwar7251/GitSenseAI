import { useState } from "react";
import { Menu, X, FolderTree } from "lucide-react";

import FileTree from "../FileTree/FileTree";

type RepositoryFile = {
  path: string;
  name: string;
  type: "file" | "folder";
  children?: RepositoryFile[];
};

type Props = {
  repositoryTree: RepositoryFile[];
  onFileSelect: (path: string) => void;
};

function RepositorySidebar({
  repositoryTree,
  onFileSelect,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleFileSelect = (path: string) => {
    onFileSelect(path);

    // Close drawer after selecting a file on mobile
    setMobileOpen(false);
  };

  return (
    <>
      {/* ================= MOBILE BUTTON ================= */}
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 shadow-sm lg:hidden">
        <div className="flex items-center gap-2">
          <FolderTree
            size={20}
            className="text-violet-600"
          />

          <span className="font-semibold text-gray-800">
            Repository Explorer
          </span>
        </div>

        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-gray-700 transition hover:bg-violet-50"
          aria-label="Open repository explorer"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* ================= MOBILE OVERLAY ================= */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-[85vw] max-w-sm
          overflow-y-auto
          border-r border-gray-200
          bg-white
          p-4 shadow-xl
          transition-transform duration-300
          lg:static lg:z-auto
          lg:block lg:w-64
          lg:max-w-none
          lg:translate-x-0
          lg:overflow-visible
          lg:border
          lg:rounded-2xl
          lg:shadow-sm
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Sidebar Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <FolderTree
              size={20}
              className="shrink-0 text-violet-600"
            />

            <span className="truncate font-semibold text-gray-800">
              Repository Explorer
            </span>
          </div>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-gray-600 hover:bg-violet-50 lg:hidden"
            aria-label="Close repository explorer"
          >
            <X size={22} />
          </button>
        </div>

        {/* File Tree */}
        <div className="min-w-0 overflow-x-hidden">
          <div className="space-y-1">
            {repositoryTree.map((node) => (
              <FileTree
                key={node.path}
                node={node}
                onFileSelect={handleFileSelect}
              />
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}

export default RepositorySidebar;