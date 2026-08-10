import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Download, ArrowLeft, Loader2 } from "lucide-react";

function Reports() {
  const navigate = useNavigate();

  const [repositoryName, setRepositoryName] = useState("Repository");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const repositoryInfo =
      sessionStorage.getItem("repositoryInfo");

    if (!repositoryInfo) {
      navigate("/");
      return;
    }

    try {
      const info = JSON.parse(repositoryInfo);

      setRepositoryName(
        info.repositoryName ||
          info.name ||
          "Repository"
      );
    } catch (error) {
      console.error(
        "Failed to read repository information:",
        error
      );
    }
  }, [navigate]);

  const handleGenerateReport = async () => {
    setError("");
    setGenerating(true);

    try {
      const repositoryInfo =
        sessionStorage.getItem("repositoryInfo");

      if (!repositoryInfo) {
        throw new Error(
          "Repository information was not found. Please analyze the repository again."
        );
      }

      const info = JSON.parse(repositoryInfo);

      const collectionName =
        info.collectionName;

      if (!collectionName) {
        throw new Error(
          "Repository collection was not found."
        );
      }

      /*
       * Use localhost while running the backend locally.
       *
       * If your deployed frontend should call Render,
       * replace this with your deployed backend URL.
       */
      const response = await fetch(
        `http://localhost:5000/api/repository/report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            collectionName,
            repositoryName:
              info.repositoryName ||
              info.name ||
              "repository",
          }),
        }
      );

      if (!response.ok) {
        let message =
          "Failed to generate report.";

        try {
          const data = await response.json();

          if (data?.message) {
            message = data.message;
          }
        } catch {
          // Response was not JSON
        }

        throw new Error(message);
      }

      /*
       * Backend returns the PDF as a file.
       */
      const blob = await response.blob();

      if (!blob || blob.size === 0) {
        throw new Error(
          "Generated report is empty."
        );
      }

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download = `${(
        info.repositoryName ||
        info.name ||
        "repository"
      ).replace(/[^a-zA-Z0-9-_]/g, "-")}-report.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Report generation error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to generate report."
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100">
              <FileText
                size={22}
                className="text-violet-600"
              />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold text-gray-900 sm:text-2xl">
                Repository Report
              </h1>

              <p className="truncate text-sm text-gray-500">
                {repositoryName}
              </p>
            </div>
          </div>

          {/* Back button */}
          <button
            onClick={() =>
              navigate("/workspace")
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto"
          >
            <ArrowLeft size={17} />
            Back to Workspace
          </button>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8 lg:p-10">

          {/* Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 sm:h-20 sm:w-20">
            <FileText
              size={32}
              className="text-violet-600 sm:h-10 sm:w-10"
            />
          </div>

          {/* Title */}
          <div className="mt-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Generate Repository Report
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
              Generate a detailed PDF report containing
              insights about your repository, including
              its architecture, technologies, structure,
              and analysis.
            </p>
          </div>

          {/* Report information */}
          <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Repository
              </p>

              <p className="mt-1 truncate text-sm font-semibold text-gray-800">
                {repositoryName}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Format
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-800">
                PDF Report
              </p>
            </div>

          </div>

          {/* Error */}
          {error && (
            <div className="mx-auto mt-6 max-w-3xl rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Generate button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleGenerateReport}
              disabled={generating}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[220px]"
            >
              {generating ? (
                <>
                  <Loader2
                    size={19}
                    className="animate-spin"
                  />
                  Generating...
                </>
              ) : (
                <>
                  <Download size={19} />
                  Generate Report
                </>
              )}
            </button>
          </div>

          {/* Bottom note */}
          <p className="mt-5 text-center text-xs leading-5 text-gray-400">
            The report may take a few moments to
            generate depending on the repository size.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Reports;