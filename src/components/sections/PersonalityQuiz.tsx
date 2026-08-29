"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, DropWords } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import {
  PERSONALITY_QUESTIONS,
  PERSONALITY_RESULTS,
  calculatePersonality,
  type PersonalityResult,
} from "@/data/personality-quiz";
import { unlockAchievement } from "@/data/achievements";
import { cn } from "@/lib/utils";

export function PersonalityQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<PersonalityResult | null>(null);
  const done = step >= PERSONALITY_QUESTIONS.length;

  const select = (optionIndex: number) => {
    const next = [...answers, optionIndex];
    setAnswers(next);
    if (next.length >= PERSONALITY_QUESTIONS.length) {
      const personality = calculatePersonality(next);
      setResult(personality);
      unlockAchievement("personality-found");
    } else {
      setStep((s) => s + 1);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setResult(null);
  };

  const resultData = result ? PERSONALITY_RESULTS[result] : null;

  return (
    <section id="personality" className="relative bg-cream-deep">
      <div className="container-shell section-pad">
        <Reveal>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue">
            Personality Quiz
          </p>
        </Reveal>
        <h2 className="section-title font-display">
          <DropWords text="Ποιος μαθητής είσαι;" />
        </h2>

        <div className="section-stack mx-auto max-w-2xl rounded-[1.5rem] border-[3px] border-ink bg-paper p-4 shadow-[6px_6px_0_#1a1433] sm:p-5">
          {!done ? (
            <>
              <div className="mb-6 flex gap-2">
                {PERSONALITY_QUESTIONS.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-2 flex-1 rounded-full",
                      i < step ? "bg-green" : i === step ? "bg-yellow" : "bg-ink/10",
                    )}
                  />
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                >
                  <p className="font-display text-[1.35rem] leading-snug md:text-xl">
                    {PERSONALITY_QUESTIONS[step].question}
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {PERSONALITY_QUESTIONS[step].options.map((opt, i) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => select(i)}
                        className="focus-ring rounded-2xl border-[3px] border-ink bg-cream px-3 py-2.5 text-left text-sm font-bold shadow-[3px_3px_0_#1a1433] transition hover:bg-yellow"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </>
          ) : resultData ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4 text-center"
            >
              <p className="text-5xl">{resultData.emoji}</p>
              <p className="font-display text-3xl">{resultData.title}</p>
              <p className="text-ink/70">{resultData.description}</p>
              <Button variant="ghost" onClick={reset}>
                Ξανά
              </Button>
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
