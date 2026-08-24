"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const elements = [
  { text: "Guten Tag", x: "8%", y: "18%", delay: 0.2 },
  { text: "Hello", x: "78%", y: "22%", delay: 0.45 },
  { text: "A1 → C1", x: "14%", y: "72%", delay: 0.7 },
  { text: "C2", x: "86%", y: "68%", delay: 0.55 },
  { text: "Goethe", x: "70%", y: "42%", delay: 0.9 },
  { text: "ÖSD", x: "28%", y: "48%", delay: 1.05 },
  { text: "TELC", x: "52%", y: "78%", delay: 1.2 },
];

type FloatingLanguageElementsProps = {
  className?: string;
  density?: "full" | "lite";
};

export function FloatingLanguageElements({
  className,
  density = "full",
}: FloatingLanguageElementsProps) {
  const items = density === "lite" ? elements.slice(0, 4) : elements;

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {items.map((item) => (
        <motion.span
          key={item.text}
          className="absolute hidden rounded-sm border border-cream/10 bg-cream/[0.03] px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.22em] text-cream/35 backdrop-blur-sm md:inline-block"
          style={{ left: item.x, top: item.y }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: [0, -8, 0] }}
          transition={{
            opacity: { delay: item.delay, duration: 0.8 },
            y: {
              delay: item.delay,
              duration: 7 + item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          {item.text}
        </motion.span>
      ))}
    </div>
  );
}
