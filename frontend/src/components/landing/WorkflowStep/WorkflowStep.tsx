import { motion } from "framer-motion";

type Props = {
  title: string;
  description: string;
  icon: React.ElementType;
  index: number;
};

function WorkflowStep({
  title,
  description,
  icon: Icon,
  index,
}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: index * 0.12,
      }}
      viewport={{ once: true }}
      className="
        relative
        rounded-3xl
        border
        border-gray-200
        bg-white/80
        p-7
        shadow-lg
        backdrop-blur-xl
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-violet-300
        hover:shadow-violet-200
      "
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
        <Icon size={28} />
      </div>

      <div className="mb-3 text-sm font-semibold text-violet-600">
        STEP {index + 1}
      </div>

      <h3 className="text-xl font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-gray-600">
        {description}
      </p>
    </motion.div>
  );
}

export default WorkflowStep;