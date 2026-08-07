import { motion } from "framer-motion";
import FeatureCard from "../FeatureCard";
import { features } from "../../../constants/features";

function FeatureGrid() {
  return (
    <section className="mx-auto mt-28 max-w-6xl px-6">

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <p className="mb-3 text-center font-semibold uppercase tracking-widest text-violet-600">
          FEATURES
        </p>

        <h2 className="text-center text-4xl font-bold text-gray-900">
          Everything You Need To Understand Any Repository
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-center text-lg text-gray-600">
          GitSenseAI combines LLMs and Retrieval-Augmented Generation
          to help you understand complex repositories within seconds.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-8 md:grid-cols-2">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{
              opacity: 0,
              y: 40,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.15,
            }}
            viewport={{ once: true }}
          >
            <FeatureCard
              {...feature}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default FeatureGrid;