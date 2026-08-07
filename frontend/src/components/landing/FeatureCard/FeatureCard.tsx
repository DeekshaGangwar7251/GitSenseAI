import { motion } from "framer-motion";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: React.ElementType;
};

function FeatureCard({
  title,
  description,
  icon: Icon,
}: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      transition={{ duration: 0.25 }}
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-gray-200
        bg-white/80
        p-7
        backdrop-blur-lg
        transition-all
        duration-300
        hover:border-violet-300
        hover:shadow-2xl
        hover:shadow-violet-200/50
      "
    >
      {/* Glow */}
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-violet-300/20 blur-3xl transition group-hover:bg-violet-400/30" />

      {/* Icon */}
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg">
        <Icon size={28} />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-3 leading-7 text-gray-600">
        {description}
      </p>

      {/* Learn More */}
      <button className="mt-6 text-sm font-semibold text-violet-600 transition group-hover:translate-x-1">
        Learn More →
      </button>
    </motion.div>
  );
}

export default FeatureCard;