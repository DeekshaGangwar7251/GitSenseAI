import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

function CTA() {
  const scrollToRepository = () => {
    const section = document.getElementById("repository-input");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <section className="relative mt-32 overflow-hidden px-6">

      {/* Background Glow */}

      <div className="absolute left-1/2 top-10 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-300/20 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="
          relative
          mx-auto
          max-w-6xl
          overflow-hidden
          rounded-[36px]
          border
          border-violet-200
          bg-gradient-to-r
          from-violet-600
          via-purple-600
          to-indigo-600
          p-14
          text-center
          text-white
          shadow-[0_25px_70px_rgba(124,108,242,0.35)]
        "
      >
        {/* Floating Circles */}

        <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute -right-10 bottom-0 h-52 w-52 rounded-full bg-white/10 blur-3xl" />

        <h2 className="text-4xl font-extrabold">
          Ready to Understand Any Repository?
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-violet-100">
          Upload a GitHub repository and let AI explain architecture,
          authentication flow, APIs, business logic, and generate
          documentation in seconds.
        </p>

        <motion.button
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.98,
          }}
          onClick={scrollToRepository}
          className="
            mt-10
            inline-flex
            items-center
            gap-3
            rounded-2xl
            bg-white
            px-8
            py-4
            font-semibold
            text-violet-700
            shadow-lg
            transition
            hover:shadow-xl
          "
        >
          Analyze Repository

          <ArrowRight size={20} />
        </motion.button>
      </motion.div>
    </section>
  );
}

export default CTA;