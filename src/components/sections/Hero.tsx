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
      className="relative isolate min-h-[100svh] overflow-hidden bg-navy text-cream"
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
        <div className="blob animate-blob absolute right-0 top-40 h-64 w-64 bg-blue/25 blur-2xl" style={{ animationDelay: "1s" }} />
        <div className="blob animate-blob absolute bottom-10 left-1/3 h-48 w-48 bg-yellow/20 blur-2xl" style={{ animationDelay: "2s" }} />
      </div>

      <motion.div style={{ x: sx, y: sy }} className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden>
        {floaters.map((f, i) => (
          <motion.span
            key={f.text}
            className={`sticker absolute rounded-full px-3 py-1.5 text-xs font-extrabold text-ink ${f.color}`}
            style={{ left: f.x, top: f.y }}
            animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
            transition={{ duration: 4 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
          >
            {f.text}
          </motion.span>
        ))}
      </motion.div>

      <ToastBubble message={toast ?? ""} show={Boolean(toast)} />

      <div className="container-shell relative z-10 flex min-h-[100svh] flex-col justify-center pb-16 pt-28">
        <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border-2 border-cream/20 bg-cream/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-yellow">
          Γερμανικά με Στυλ
        </p>

        <h1 className="font-display max-w-4xl text-[clamp(2.4rem,8vw,5.4rem)] leading-[0.95]">
          <span className="block">Μάθε Γερμανικά.</span>
          <span className="block">Μάθε Αγγλικά.</span>
          <span className="mt-2 block">
            Και κάν’ το με{" "}
            <button
              type="button"
              onClick={onStylClick}
              className="focus-ring relative inline-block rounded-xl px-2 transition"
              style={{
                color: stylColor,
                textShadow: `4px 4px 0 rgba(0,0,0,0.25)`,
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

        <p className="mt-6 max-w-xl text-base text-cream/75 md:text-lg">
          Εδώ δεν θα βαρεθείς να μάθεις γλώσσες. Μαθήματα για παιδιά από 10+ και
          εφήβους — με πραγματική πρόοδο και λίγο χιούμορ.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button variant="coral" onClick={() => scrollToId("contact")}>
            Πάμε να γνωριστούμε →
          </Button>
          <Button variant="yellow" onClick={() => scrollToId("pricing")}>
            Ποιο είναι το δικό σου στυλ;
          </Button>
        </div>

        <div className="mt-10 max-w-lg rounded-3xl border-[3px] border-ink bg-cream p-4 text-ink shadow-[8px_8px_0_#1a1433]">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-muted">
            Διάλεξε μια λέξη
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {wordPicks.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => {
                  setMood(w.bg);
                  setToast(w.message);
                  window.setTimeout(() => setMood(null), 1600);
                }}
                className="focus-ring rounded-full border-2 border-ink bg-paper px-4 py-2 text-sm font-bold shadow-[3px_3px_0_#1a1433] transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0_#1a1433]"
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
