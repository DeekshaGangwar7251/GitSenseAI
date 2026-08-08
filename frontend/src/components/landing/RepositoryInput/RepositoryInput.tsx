import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RepositoryInput() {
  const navigate = useNavigate();

  const [repoUrl, setRepoUrl] = useState("");
  const [branch, setBranch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!repoUrl.trim()) {
      setError("Please enter a GitHub repository URL.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://https://gitsenseai-k9wq.onrender.com/api/repository/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            repoUrl: repoUrl.trim(),
            branch: branch.trim() || undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to analyze repository."
        );
      }

      /*
       * Store repository information so that
       * Analysis and Workspace can use it.
       */
      sessionStorage.setItem(
        "repositoryInfo",
        JSON.stringify({
          repoUrl: repoUrl.trim(),
          branch: data.branch,
          collectionName: data.collectionName,
          repository: data.repository,
          totalDocuments: data.totalDocuments,
          totalChunks: data.totalChunks,
        })
      );

      /*
       * Move to the analysis page.
       */
      navigate("/analysis");
    } catch (err) {
      console.error("Repository analysis error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while analyzing the repository."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 w-full max-w-2xl">
      <div className="rounded-2xl border border-violet-100 bg-white p-3 shadow-xl shadow-violet-100/40">

        {/* Repository URL */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) {
                handleAnalyze();
              }
            }}
            placeholder="https://github.com/username/repository"
            disabled={loading}
            className="flex-1 rounded-xl border-0 px-4 py-3 text-gray-700 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-violet-200"
          />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Analyzing..." : "Analyze Repository"}
          </button>
        </div>

        {/* Branch */}
        <div className="mt-3">
          <input
            type="text"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            disabled={loading}
            placeholder="Branch (optional, e.g. main)"
            className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

      </div>

      <p className="mt-4 text-sm text-gray-400">
        Paste a public GitHub repository URL to begin analysis.
      </p>
    </div>
  );
}

export default RepositoryInput;