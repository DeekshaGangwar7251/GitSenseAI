import { FaGithub } from "react-icons/fa";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">
            <FaGithub size={22} />
          </div>

          <div>
            <h1 className="text-lg font-bold text-gray-900">
              GitSenseAI
            </h1>

            <p className="text-xs text-gray-500">
              Repository Intelligence
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm font-medium text-gray-600 transition hover:text-violet-600"
          >
            Features
          </a>

          <a
            href="#workflow"
            className="text-sm font-medium text-gray-600 transition hover:text-violet-600"
          >
            Workflow
          </a>

          <a
            href="#about"
            className="text-sm font-medium text-gray-600 transition hover:text-violet-600"
          >
            About
          </a>
        </nav>

        {/* GitHub Button */}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium transition hover:border-violet-300 hover:bg-violet-50"
        >
          <FaGithub size={16} />
          GitHub
        </a>
      </div>
    </header>
  );
}

export default Navbar;