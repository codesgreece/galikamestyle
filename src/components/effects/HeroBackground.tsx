"use client";

import { motion } from "framer-motion";

export function HeroBackground() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(140,48,69,0.28),transparent_45%),radial-gradient(ellipse_at_80%_10%,rgba(196,165,116,0.16),transparent_35%),radial-gradient(ellipse_at_70%_80%,rgba(79,24,38,0.35),transparent_40%),linear-gradient(160deg,#0c0b0a_0%,#161412_55%,#1a1214_100%)]" />

      <motion.div
        className="animate-drift absolute -left-24 top-10 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(140,48,69,0.35),transparent_68%)] blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4 }}
      />
      <motion.div
        className="absolute right-[-8rem] top-24 h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(196,165,116,0.2),transparent_70%)] blur-3xl"
        animate={{ x: [0, -20, 0], y: [0, 16, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-6rem] left-[30%] h-[20rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(246,241,232,0.08),transparent_70%)] blur-3xl"
        animate={{ x: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <svg
        className="absolute inset-0 h-full w-full opacity-[0.12]"
        viewBox="0 0 1200 800"
        fill="none"
      >
        <motion.path
          d="M-50 420 C 180 280, 320 560, 520 420 S 860 240, 1250 380"
          stroke="url(#heroStroke)"
          strokeWidth="1.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.path
          d="M-80 560 C 220 480, 360 700, 620 560 S 980 420, 1280 540"
          stroke="url(#heroStroke2)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 2.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        />
        <defs>
          <linearGradient id="heroStroke" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#C4A574" stopOpacity="0" />
            <stop offset="0.5" stopColor="#C4A574" stopOpacity="0.8" />
            <stop offset="1" stopColor="#8C3045" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="heroStroke2" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#8C3045" stopOpacity="0" />
            <stop offset="0.5" stopColor="#F6F1E8" stopOpacity="0.45" />
            <stop offset="1" stopColor="#C4A574" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <div className="noise-overlay opacity-[0.05]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
    </div>
  );
}
