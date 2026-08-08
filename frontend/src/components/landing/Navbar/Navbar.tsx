import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { Menu, X } from "lucide-react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <a
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-sm font-bold text-white">
            G
          </div>

          <div>
            <h1 className="text-base font-bold text-gray-900 sm:text-lg">
              GitSenseAI
            </h1>

            <p className="hidden text-xs text-gray-500 sm:block">
              Repository Intelligence
            </p>
          </div>
        </a>

        {/* Desktop Navigation */}
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

        {/* Desktop GitHub Button */}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium transition hover:border-violet-300 hover:bg-violet-50 md:flex"
        >
          <FaGithub size={16} />
          GitHub
        </a>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-gray-700 transition hover:bg-violet-50 md:hidden"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 shadow-sm md:hidden">
          <nav className="flex flex-col gap-1">

            <a
              href="#features"
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-violet-50 hover:text-violet-600"
            >
              Features
            </a>

            <a
              href="#workflow"
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-violet-50 hover:text-violet-600"
            >
              Workflow
            </a>

            <a
              href="#about"
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-violet-50 hover:text-violet-600"
            >
              About
            </a>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="mt-2 flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-violet-300 hover:bg-violet-50"
            >
              <FaGithub size={16} />
              GitHub
            </a>

          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;