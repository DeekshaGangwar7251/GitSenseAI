import { motion } from "framer-motion";

function ThinkingDots() {
  return (
    <div className="flex gap-2 py-1">

      {[0, 1, 2].map((dot) => (
        <motion.div
          key={dot}
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: dot * 0.2,
          }}
          className="h-2.5 w-2.5 rounded-full bg-violet-500"
        />
      ))}

    </div>
  );
}

export default ThinkingDots;