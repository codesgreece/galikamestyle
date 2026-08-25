"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ToastBubble } from "@/components/ui/PlayfulFX";
import { scrollToId } from "@/lib/utils";

const floaters = [
  { text: "Hallo!", x: "6%", y: "18%", color: "bg-yellow" },
  { text: "Hello!", x: "78%", y: "16%", color: "bg-blue text-paper" },
  { text: "Guten Morgen", x: "10%", y: "70%", color: "bg-coral text-paper" },
  { text: "Let’s go!", x: "72%", y: "68%", color: "bg-green text-ink" },
  { text: "A1 → C1", x: "84%", y: "42%", color: "bg-lilac text-ink" },
  { text: "C2?! 😎", x: "48%", y: "82%", color: "bg-cream" },
];

const wordPicks = [
  {
    id: "hallo",
    label: "🇩🇪 Hallo",
    message: "Hallo! Πολύ καλή αρχή. 🇩🇪",
    bg: "from-[#ff5d7a]/35 via-transparent to-transparent",
  },
  {
    id: "hello",
    label: "🇬🇧 Hello",
    message: "Hello there! Κάπως έτσι ξεκινάνε όλα. 🇬🇧",
    bg: "from-[#3d8bff]/40 via-transparent to-transparent",
  },
  {
    id: "letsgo",
    label: "✨ Let’s go!",
    message: "Let’s go! Το μάθημα αρχίζει… με στυλ.",
    bg: "from-[#ffe14a]/45 via-transparent to-transparent",
  },
] as const;

const stylColors = ["#ffe14a", "#ff5d7a", "#3d8bff", "#2fd67b", "#b48cff"];

export function Hero() {
  const [stylClicks, setStylClicks] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [mood, setMood] = useState<(typeof wordPicks)[number]["bg"] | null>(null);
  const [stylColor, setStylColor] = useState(stylColors[0]);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 18 });
  const sy = useSpring(my, { stiffness: 40, damping: 18 });

  useEffect(() => {
    const id = window.setInterval(() => {
      setStylColor((c) => {
        const i = stylColors.indexOf(c);
        return stylColors[(i + 1) % stylColors.length];
      });
    }, 1800);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(t);
  }, [toast]);

  const onStylClick = () => {
    const next = stylClicks + 1;
    setStylClicks(next);
    if (next % 5 === 0) {
      setToast("😎 Πολύ στυλ για ένα website.");
    }
  };

  return (
    <section
      id="hero"
      className="relative isolate min-h-[100svh] overflow-hidden bg-navy text-cream md:min-h-0"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width - 0.5) * 24);
        my.set(((e.clientY - r.top) / r.height - 0.5) * 18);
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,93,122,0.28),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(61,139,255,0.25),transparent_35%),radial-gradient(circle_at_70%_80%,rgba(255,225,74,0.18),transparent_40%)]" />
      {mood ? (
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${mood}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      ) : null}

      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="blob animate-blob absolute -left-16 top-24 h-56 w-56 bg-coral/30 blur-2xl" />
        <div
          className="blob animate-blob absolute right-0 top-40 h-64 w-64 bg-blue/25 blur-2xl"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="blob animate-blob absolute bottom-10 left-1/3 h-48 w-48 bg-yellow/20 blur-2xl"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <motion.div
        style={{ x: sx, y: sy }}
        className="pointer-events-none absolute inset-0 hidden md:block"
        aria-hidden
      >
        {floaters.map((f, i) => (
          <motion.span
            key={f.text}
            className={`sticker absolute rounded-full px-3 py-1.5 text-xs font-extrabold text-ink ${f.color}`}
            style={{ left: f.x, top: f.y }}
            animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
            transition={{
              duration: 4 + i * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {f.text}
          </motion.span>
        ))}
      </motion.div>

      <ToastBubble message={toast ?? ""} show={Boolean(toast)} />

      <div className="container-shell relative z-10 flex min-h-[100svh] flex-col justify-start gap-8 pb-16 pt-[7.75rem] md:min-h-0 md:grid md:grid-cols-[1.15fr_0.85fr] md:items-center md:gap-8 md:py-8 md:pt-20 lg:gap-10 lg:py-10 lg:pt-20">
        <div className="flex flex-col gap-6 md:gap-4">
        <p className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-cream/20 bg-cream/10 px-3.5 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-yellow sm:text-xs">
          Γερμανικά με Στυλ
        </p>

        <h1 className="font-display text-[clamp(1.85rem,7vw,4.8rem)] tracking-normal md:text-[clamp(1.9rem,2.6vw,2.4rem)]">
          <span className="mb-3.5 block md:mb-1">Μάθε Γερμανικά.</span>
          <span className="mb-6 block md:mb-1">Μάθε Αγγλικά.</span>
          <span className="block">
            Και κάν’ το με{" "}
            <button
              type="button"
              onClick={onStylClick}
              className="focus-ring relative inline-block rounded-xl px-1 transition sm:px-2"
              style={{
                color: stylColor,
                textShadow: `3px 3px 0 rgba(0,0,0,0.22)`,
              }}
              aria-label="ΣΤΥΛ — πάτα για surprise"
            >
              <motion.span
                key={stylColor}
                initial={{ scale: 0.9, rotate: -3 }}
                animate={{ scale: 1, rotate: 0 }}
                className="inline-block"
              >
                ΣΤΥΛ
              </motion.span>
              <span className="absolute -bottom-1 left-0 h-2 w-full rounded-full bg-yellow/80" />
            </button>
            .
          </span>
        </h1>

        <p className="max-w-xl text-[1.05rem] leading-8 text-cream/80 md:text-base md:leading-7">
          Εδώ δεν θα βαρεθείς να μάθεις γλώσσες. Μαθήματα για παιδιά από 10+ και
          εφήβους — με πραγματική πρόοδο και λίγο χιούμορ.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
          <Button
            variant="coral"
            className="min-h-14 w-full px-6 py-4 text-[0.78rem] sm:w-auto md:min-h-12 md:py-3"
            onClick={() => scrollToId("goal")}
          >
            Πάμε να γνωριστούμε →
          </Button>
          <Button
            variant="yellow"
            className="min-h-14 w-full px-6 py-4 text-[0.78rem] sm:w-auto md:min-h-12 md:py-3"
            onClick={() => scrollToId("level-test")}
          >
            Ποιο είναι το δικό σου στυλ;
          </Button>
        </div>
        </div>

        <div className="max-w-lg rounded-[1.75rem] border-[3px] border-ink bg-cream p-5 text-ink shadow-[8px_8px_0_#1a1433] md:max-w-none md:p-5">
          <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.18em] text-muted">
            Διάλεξε μια λέξη
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {wordPicks.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => {
                  setMood(w.bg);
                  setToast(w.message);
                  window.setTimeout(() => setMood(null), 1600);
                }}
                className="focus-ring rounded-full border-2 border-ink bg-paper px-4 py-2.5 text-sm font-bold shadow-[3px_3px_0_#1a1433] transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0_#1a1433]"
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
