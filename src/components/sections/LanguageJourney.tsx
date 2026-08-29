"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Reveal, DropWords } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const levels = [
  {
    code: "A1",
    title: "Level 1 — First Steps",
    line: "Ξεκινάμε!",
    color: "bg-yellow",
    emoji: "🌱",
    interaction: "Πες «Hallo» δυνατά!",
  },
  {
    code: "A2",
    title: "Level 2 — Getting Real",
    line: "Τώρα αρχίζει να βγάζει νόημα.",
    color: "bg-coral text-paper",
    emoji: "🗣️",
    interaction: "Μπορείς να παραγγείλεις καφέ;",
  },
  {
    code: "B1",
    title: "Level 3 — Conversation Mode",
    line: "Μπορώ να συνεννοηθώ. Κάτι γίνεται εδώ.",
    color: "bg-blue text-paper",
    emoji: "💬",
    interaction: "Small talk unlocked!",
  },
  {
    code: "B2",
    title: "Level 4 — Fluent Zone",
    line: "Μιλάω άνετα. Πρόσεχε κόσμο.",
    color: "bg-green text-ink",
    emoji: "🔥",
    interaction: "Debate mode: ON",
  },
  {
    code: "C1",
    title: "Level 5 — Master Territory",
    line: "Εντάξει, το ’χω.",
    color: "bg-lilac text-ink",
    emoji: "👑",
    interaction: "Native-level vibes",
  },
];

export function LanguageJourney() {
  const [active, setActive] = useState(0);
  const [tapCount, setTapCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="levels" className="relative overflow-hidden bg-navy text-cream">
      <div className="container-shell section-pad">
        <Reveal>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-yellow">
            Language Journey
          </p>
        </Reveal>
        <h2 className="section-title font-display max-w-3xl">
          <DropWords text="A1 → C1 Quest" />
        </h2>
        <Reveal delay={0.1}>
          <p className="mt-3 max-w-xl text-cream/70 sm:mt-4">
            Κάθε level είναι ένα checkpoint. Πάτα για να ξεκλειδώσεις την επόμενη αποστολή.
          </p>
        </Reveal>

        <div ref={ref} className="section-stack relative">
          <div className="mb-3 hidden h-2 overflow-hidden rounded-full bg-cream/15 md:block">
            <motion.div
              className="h-full origin-left rounded-full bg-yellow"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: (active + 1) / levels.length } : { scaleX: 0 }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="space-y-4 md:grid md:grid-cols-5 md:gap-3 md:space-y-0">
            {levels.map((level, i) => {
              const unlocked = inView && i <= active;
              const isActive = i === active;
              return (
                <motion.button
                  key={level.code}
                  type="button"
                  onClick={() => {
                    setActive(i);
                    setTapCount((c) => c + 1);
                  }}
                  className={cn(
                    "relative block w-full rounded-3xl border-[3px] border-ink p-5 text-left transition md:rounded-2xl md:p-4",
                    unlocked
                      ? "bg-cream text-ink shadow-[8px_8px_0_#ffe14a] md:shadow-[4px_4px_0_#ffe14a]"
                      : "bg-navy-soft text-cream/50",
                    isActive && unlocked && "ring-4 ring-yellow/50",
                  )}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="text-2xl">{level.emoji}</span>
                  <span
                    className={cn(
                      "mt-2 inline-block rounded-xl px-3 py-1 font-display text-2xl text-ink md:text-lg",
                      level.color,
                    )}
                  >
                    {level.code}
                  </span>
                  <p className="mt-2 text-xs font-extrabold uppercase tracking-wider text-muted">
                    {level.title}
                  </p>
                  <p className="mt-1 font-bold md:text-xs md:leading-snug">{level.line}</p>
                  {isActive && unlocked ? (
                    <motion.p
                      className="mt-3 rounded-xl bg-yellow/30 px-2 py-1 text-xs font-bold"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      ⚡ {level.interaction}
                    </motion.p>
                  ) : null}
                </motion.button>
              );
            })}
          </div>

          {tapCount > 0 ? (
            <p className="mt-4 text-center text-sm text-cream/60">
              Quest progress: {active + 1}/{levels.length} · Taps: {tapCount}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
