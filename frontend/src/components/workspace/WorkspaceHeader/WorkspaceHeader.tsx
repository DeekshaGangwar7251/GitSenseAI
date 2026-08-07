import { Bot, FolderGit2 } from "lucide-react";

function WorkspaceHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-violet-600 p-2 text-white">
            <Bot size={22} />
          </div>

          <div>
            <h1 className="font-bold text-gray-900">
              GitSenseAI
            </h1>

            <p className="text-xs text-gray-500">
              AI Repository Assistant
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full bg-violet-50 px-4 py-2 md:flex">
          <FolderGit2
            size={18}
            className="text-violet-600"
          />

          <span className="text-sm font-medium text-violet-700">
            facebook/react
          </span>
        </div>
      </div>
    </header>
  );
}

export default WorkspaceHeader;