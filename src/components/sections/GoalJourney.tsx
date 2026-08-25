"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Reveal, DropWords } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { useJourney } from "@/components/providers/JourneyProvider";
import { goalOptions } from "@/data/goals";
import { scrollToId, cn } from "@/lib/utils";
import type { LearningGoal } from "@/lib/types";

export function GoalJourney() {
  const { selectedGoal, setGoal } = useJourney();
  const [picked, setPicked] = useState<LearningGoal | null>(selectedGoal);
  const reduce = useReducedMotion();
  const active = goalOptions.find((g) => g.id === picked) ?? null;

  const choose = (id: LearningGoal) => {
    setPicked(id);
    setGoal(id);
  };

  return (
    <section id="goal" className="relative overflow-hidden bg-cream">
      <div className="container-shell section-pad">
        <Reveal>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-coral">
            Personalized journey
          </p>
        </Reveal>
        <h2 className="font-display mt-4 max-w-3xl text-[clamp(1.9rem,6.5vw,3.6rem)] leading-[1.18]">
          <DropWords text="Γιατί είσαι εδώ;" />{" "}
          <span aria-hidden>👀</span>
        </h2>
        <Reveal delay={0.08}>
          <p className="mt-4 max-w-xl text-base text-ink/70 sm:text-lg">
            Διάλεξε τον στόχο σου και πάμε από εκεί.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {goalOptions.map((goal, i) => {
            const isActive = picked === goal.id;
            const dimmed = picked !== null && !isActive;
            return (
              <motion.button
                key={goal.id}
                type="button"
                onClick={() => choose(goal.id)}
                aria-pressed={isActive}
                className={cn(
                  "focus-ring rounded-[1.75rem] border-[3px] border-ink p-6 text-left shadow-[6px_6px_0_#1a1433] transition sm:p-7",
                  isActive ? "bg-navy text-cream" : "bg-paper text-ink",
                )}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: dimmed ? 0.45 : 1, y: 0 }}
                animate={{
                  opacity: dimmed ? 0.4 : 1,
                  scale: isActive ? 1.02 : 1,
                  y: dimmed ? 8 : 0,
                }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
                whileTap={{ scale: 0.98 }}
              >
                <span
                  className={cn(
                    "inline-flex rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wide",
                    goal.accent,
                  )}
                >
                  {goal.emoji} Pick
                </span>
                <h3 className="font-display mt-4 text-2xl sm:text-3xl">
                  {goal.emoji} {goal.title}
                </h3>
                <p
                  className={cn(
                    "mt-3 text-sm leading-relaxed sm:text-base",
                    isActive ? "text-cream/75" : "text-ink/65",
                  )}
                >
                  {goal.microcopy}
                </p>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {active ? (
            <motion.div
              key={active.id}
              className="mt-8 rounded-[1.75rem] border-[3px] border-ink bg-yellow p-6 shadow-[8px_8px_0_#1a1433] sm:p-8"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
            >
              <p className="font-display text-2xl sm:text-3xl">
                {active.messageTitle}
              </p>
              <p className="mt-3 max-w-2xl text-ink/80">{active.messageBody}</p>
              <p className="mt-2 text-sm font-bold text-ink/60">{active.nextHint}</p>
              <div className="mt-6">
                <Button
                  variant="primary"
                  onClick={() => scrollToId("level-test")}
                >
                  Συνέχισε →
                </Button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
