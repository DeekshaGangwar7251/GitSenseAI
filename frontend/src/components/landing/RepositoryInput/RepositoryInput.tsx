import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { Upload, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

function RepositoryInput() {
  const navigate = useNavigate();

  const [repoUrl, setRepoUrl] = useState("");

  const isValid =
    repoUrl === "" ||
    repoUrl.startsWith("https://github.com/");

  const handleAnalyze = () => {
    if (!repoUrl.trim()) {
      alert("Please enter a GitHub repository URL.");
      return;
    }

    if (!isValid) {
      alert("Please enter a valid GitHub repository URL.");
      return;
    }

    // Later this will call the backend API
    navigate("/analysis");
  };

  return (
    <motion.div
      id="repository-input"
      initial={{
        opacity: 0,
        y: 40,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.6,
      }}
      className="
        relative
        mt-16
        w-full
        max-w-3xl
        overflow-hidden
        rounded-[32px]
        border
        border-white/50
        bg-white/80
        backdrop-blur-xl
        p-10
        shadow-[0_25px_80px_rgba(124,108,242,0.18)]
        transition-all
        duration-500
        hover:-translate-y-1
        hover:shadow-[0_35px_90px_rgba(124,108,242,0.28)]
      "
    >
      {/* Decorative Glow */}
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-violet-300/30 blur-3xl" />

      <div className="absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-fuchsia-300/20 blur-3xl" />

      {/* Badge */}
      <div className="relative z-10 mb-5 inline-flex items-center rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-700">
        🚀 Analyze any public GitHub repository
      </div>

      {/* Title */}
      <h3 className="relative z-10 mb-6 text-2xl font-bold text-gray-900">
        GitHub Repository
      </h3>

      {/* Input */}
      <div className="relative z-10">
        <FaGithub
          className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
          size={22}
        />

        <input
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="https://github.com/facebook/react"
          className={`
            w-full
            rounded-2xl
            border
            bg-white
            py-4
            pl-14
            pr-5
            text-lg
            outline-none
            transition-all
            duration-300

            ${
              isValid
                ? "border-gray-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                : "border-red-400 focus:ring-4 focus:ring-red-100"
            }
          `}
        />
      </div>

      {!isValid && (
        <p className="relative z-10 mt-3 text-sm text-red-500">
          Please enter a valid GitHub repository URL.
        </p>
      )}

      {/* Analyze Button */}
      <motion.button
        onClick={handleAnalyze}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="
          group
          relative
          z-10
          mt-7
          flex
          w-full
          items-center
          justify-center
          gap-3
          overflow-hidden
          rounded-2xl
          bg-gradient-to-r
          from-violet-600
          to-indigo-600
          py-4
          text-lg
          font-semibold
          text-white
          shadow-lg
          transition-all
          duration-300
          hover:shadow-violet-300
        "
      >
        Analyze Repository

        <ArrowRight
          size={20}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />

        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      </motion.button>

      {/* Divider */}
      <div className="relative z-10 my-8 flex items-center">
        <div className="h-px flex-1 bg-gray-200" />

        <span className="mx-4 text-sm font-medium uppercase tracking-wider text-gray-500">
          OR
        </span>

        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {/* Upload Box */}
      <motion.label
        whileHover={{ y: -4 }}
        className="
          group
          relative
          z-10
          flex
          cursor-pointer
          flex-col
          items-center
          justify-center
          rounded-3xl
          border-2
          border-dashed
          border-violet-300
          bg-gradient-to-br
          from-violet-50
          via-white
          to-violet-100
          py-10
          transition-all
          duration-300
          hover:border-violet-500
          hover:shadow-lg
          hover:shadow-violet-200
        "
      >
        <div className="rounded-full bg-white p-4 shadow-md transition group-hover:scale-110">
          <Upload
            size={34}
            className="text-violet-600"
          />
        </div>

        <p className="mt-5 text-lg font-semibold text-gray-900">
          Upload ZIP Repository
        </p>

        <span className="mt-2 text-sm text-gray-500">
          Drag & Drop or Click to Browse
        </span>

        <input
          type="file"
          accept=".zip"
          hidden
        />
      </motion.label>
    </motion.div>
  );
}

export default RepositoryInput;