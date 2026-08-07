import { FaGithub } from "react-icons/fa";

function Footer() {
  return (
    <footer className="mt-32 border-t border-gray-200 bg-white">

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 py-10 md:flex-row">

        <div>

          <h3 className="text-xl font-bold text-gray-900">
            GitSenseAI
          </h3>

          <p className="mt-2 text-gray-500">
            AI-powered GitHub Repository Intelligence.
          </p>

        </div>

        <div className="flex items-center gap-5">

          <a
            href="#"
            className="rounded-xl bg-gray-100 p-3 transition hover:bg-violet-100"
          >
            <FaGithub
              size={22}
            />
          </a>

        </div>

      </div>

      <div className="border-t border-gray-200 py-5 text-center text-sm text-gray-500">

        © 2026 GitSenseAI. Built with React, Node.js, LLM & RAG.

      </div>

    </footer>
  );
}

export default Footer;