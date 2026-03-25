import { motion } from "framer-motion";

export default function Equalizer({ isPlaying = false, color = "bg-primary", count = 5 }) {
  return (
    <div className="flex items-end gap-[3px] h-5">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={`w-[3px] rounded-full ${color}`}
          animate={
            isPlaying
              ? {
                  height: [4, 12 + Math.random() * 8, 6, 16 + Math.random() * 4, 4],
                }
              : { height: 4 }
          }
          transition={
            isPlaying
              ? {
                  duration: 0.8 + Math.random() * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.1,
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
}