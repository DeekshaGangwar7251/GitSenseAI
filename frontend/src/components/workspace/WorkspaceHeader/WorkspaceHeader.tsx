import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";

function WorkspaceHeader() {
  const navigate = useNavigate();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo / Title */}
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            GitSenseAI
          </h1>

          <p className="text-sm text-gray-500">
            Repository Workspace
          </p>
        </div>

        {/* Report Button */}
        <button
          onClick={() => navigate("/reports")}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          <FileText size={18} />

          Generate Report
        </button>

      </div>
    </header>
  );
}

export default WorkspaceHeader;