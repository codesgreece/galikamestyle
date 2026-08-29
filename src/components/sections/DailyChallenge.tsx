"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, DropWords } from "@/components/ui/Reveal";
import { getTodaysChallenge } from "@/data/daily-challenge";
import { unlockAchievement } from "@/data/achievements";
import { cn } from "@/lib/utils";

export function DailyChallenge() {
  const challenge = getTodaysChallenge();
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const correct = selected === challenge.correctIndex;

  const pick = (index: number) => {
    if (answered) return;
    setSelected(index);
    if (index === challenge.correctIndex) {
      unlockAchievement("daily-champion");
    }
  };

  return (
    <section id="daily-challenge" className="relative overflow-hidden bg-blue text-paper">
      <div className="container-shell section-pad">
        <Reveal>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-yellow">
            Today&apos;s Challenge
          </p>
        </Reveal>
        <h2 className="section-title font-display">
          <DropWords text="☀️ DAILY CHALLENGE" />
        </h2>

        <div className="section-stack mx-auto max-w-xl">
          <div className="rounded-[1.5rem] border-[3px] border-ink bg-cream p-5 text-ink shadow-[6px_6px_0_#ffe14a]">
            <p className="font-display text-xl leading-snug">{challenge.question}</p>
            <div className="mt-4 grid gap-2">
              {challenge.options.map((opt, i) => (
                <button
                  key={opt}
                  type="button"
                  disabled={answered}
                  onClick={() => pick(i)}
                  className={cn(
                    "focus-ring rounded-2xl border-[3px] border-ink px-4 py-3 text-left text-sm font-bold transition",
                    !answered && "hover:bg-yellow",
                    answered && i === challenge.correctIndex && "bg-green",
                    answered && selected === i && i !== challenge.correctIndex && "bg-coral/40 line-through",
                    answered && selected !== i && i !== challenge.correctIndex && "opacity-50",
                  )}
                >
                  {String.fromCharCode(65 + i)}. {opt}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {answered ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-xl bg-paper px-4 py-3 text-sm"
                >
                  <p className="font-bold">{correct ? "Σωστά! 🎉" : "Όχι ακριβώς — αλλά μάθαμε κάτι!"}</p>
                  <p className="mt-1 text-ink/70">{challenge.explanation}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
