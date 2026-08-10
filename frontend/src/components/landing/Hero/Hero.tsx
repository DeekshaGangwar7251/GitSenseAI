import { motion } from "framer-motion";
import RepositoryInput from "../RepositoryInput";

function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-24">

      {/* Background Blur Effects */}

      <div className="absolute inset-0 -z-10">

        <div className="absolute left-1/2 top-10 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-300/25 blur-[120px]" />

        <div className="absolute right-0 top-52 h-72 w-72 rounded-full bg-fuchsia-300/15 blur-[120px]" />

        <div className="absolute left-0 bottom-0 h-72 w-72 rounded-full bg-indigo-300/15 blur-[120px]" />

      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 inline-flex rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-700">
            ✨ AI Powered Repository Intelligence
          </div>

          <h1 className="max-w-5xl text-6xl font-extrabold leading-tight text-gray-900">
            Understand Any{" "}
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              GitHub Repository
            </span>{" "}
            with AI
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-gray-600">
            Paste any GitHub repository URL and let AI explain the
            architecture, authentication flow, APIs, bugs, and documentation
          </p>
        </motion.div>

        <RepositoryInput />

      </div>
    </section>
  );
}

export default Hero;