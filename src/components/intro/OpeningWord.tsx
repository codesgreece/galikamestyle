"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import type { WordPersonality } from "@/lib/portal";

const ease = [0.16, 1, 0.3, 1] as const;

const SCATTER = [
  { x: -46, y: 30, r: -18 },
  { x: 38, y: -34, r: 16 },
  { x: -22, y: -42, r: 10 },
  { x: 48, y: 18, r: -12 },
  { x: -8, y: 44, r: 22 },
  { x: 28, y: 36, r: -8 },
  { x: -40, y: -8, r: 14 },
  { x: 12, y: -46, r: -20 },
  { x: 42, y: -16, r: 8 },
];

const shared =
  "pointer-events-none absolute left-1/2 top-1/2 z-[2] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 text-center font-display font-bold uppercase leading-none tracking-tight";

export const OpeningWord = forwardRef<
  HTMLParagraphElement,
  {
    text: string;
    personality: WordPersonality;
    color: string;
  }
>(function OpeningWord({ text, personality, color }, ref) {
  const letters = Array.from(text);

  if (personality === "letters") {
    return (
      <motion.p
        ref={ref}
        className={shared}
        style={{ color, fontSize: "clamp(3.4rem, 13vw, 8.4rem)" }}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.06, transition: { duration: 0.12 } }}
      >
        {letters.map((ch, i) => (
          <motion.span
            key={`${ch}-${i}`}
            className="inline-block will-change-transform"
            initial={{ y: 64, opacity: 0, rotateX: 70 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            transition={{ delay: i * 0.032, duration: 0.24, ease }}
          >
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        ))}
      </motion.p>
    );
  }

  if (personality === "stretch") {
    return (
      <motion.p
        ref={ref}
        className={shared}
        style={{ color, fontSize: "clamp(3.4rem, 13vw, 8.4rem)", transformOrigin: "50% 50%" }}
        initial={{ opacity: 0, scaleX: 0.12, scaleY: 1.45 }}
        animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
        exit={{ opacity: 0, scaleX: 1.35, transition: { duration: 0.12 } }}
        transition={{ duration: 0.3, ease: [0.22, 1.4, 0.36, 1] }}
      >
        {text}
      </motion.p>
    );
  }

  if (personality === "tilt") {
    return (
      <motion.p
        ref={ref}
        className={shared}
        style={{ color, fontSize: "clamp(2.6rem, 10vw, 6.4rem)" }}
        initial={{ opacity: 0, rotate: -18, scale: 0.7, y: 22 }}
        animate={{ opacity: 1, rotate: 0, scale: 1, y: 0 }}
        exit={{ opacity: 0, rotate: 12, y: -10, transition: { duration: 0.12 } }}
        transition={{ duration: 0.3, ease }}
      >
        {text}
      </motion.p>
    );
  }

  if (personality === "zoom") {
    return (
      <motion.p
        ref={ref}
        className={shared}
        style={{ color, fontSize: "clamp(3.2rem, 12vw, 7.6rem)" }}
        initial={{ opacity: 0, scale: 6.2 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.78, transition: { duration: 0.12 } }}
        transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
      >
        {text}
      </motion.p>
    );
  }

  return (
    <motion.p
      ref={ref}
      className={`${shared} flex justify-center`}
      style={{ color, fontSize: "clamp(2.8rem, 11vw, 7rem)" }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.12 } }}
    >
      {letters.map((ch, i) => {
        const off = SCATTER[i % SCATTER.length];
        return (
          <motion.span
            key={`${ch}-${i}`}
            className="inline-block will-change-transform"
            initial={{ x: off.x, y: off.y, rotate: off.r, opacity: 0, scale: 0.4 }}
            animate={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.32, delay: i * 0.014, ease }}
          >
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        );
      })}
    </motion.p>
  );
});
