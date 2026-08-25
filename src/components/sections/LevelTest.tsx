"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Reveal, DropWords } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { useJourney } from "@/components/providers/JourneyProvider";
import { useContactModal } from "@/components/providers/ContactProvider";
import {
  getQuestions,
  resolveLevelBand,
  type LevelQuestion,
} from "@/data/level-test";
import { scrollToId, cn } from "@/lib/utils";
import type { LanguageChoice } from "@/lib/types";

type Phase = "intro" | "quiz" | "result";

export function LevelTest() {
  const reduce = useReducedMotion();
  const { selectedLanguage, selectedGoal, setLanguage, setLevelResult } =
    useJourney();
  const { openContact } = useContactModal();

  const [phase, setPhase] = useState<Phase>("intro");
  const [lang, setLang] = useState<LanguageChoice | null>(selectedLanguage);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [locked, setLocked] = useState(false);

  const questions = useMemo(
    () => (lang ? getQuestions(lang) : []),
    [lang],
  );
  const current: LevelQuestion | null = questions[index] ?? null;
  const band = resolveLevelBand(correct);

  const start = (choice: LanguageChoice) => {
    setLang(choice);
    setLanguage(choice);
    setPhase("quiz");
    setIndex(0);
    setCorrect(0);
    setFeedback(null);
    setLocked(false);
  };

  const answer = (option: string) => {
    if (!current || locked) return;
    setLocked(true);
    const ok = option === current.answer;
    setFeedback(ok ? "correct" : "wrong");
    const nextCorrect = ok ? correct + 1 : correct;

    window.setTimeout(() => {
      if (index + 1 >= questions.length) {
        const finalBand = resolveLevelBand(nextCorrect);
        setCorrect(nextCorrect);
        setLevelResult(finalBand.id, nextCorrect);
        setPhase("result");
        setFeedback(null);
        setLocked(false);
        return;
      }
      setCorrect(nextCorrect);
      setIndex((i) => i + 1);
      setFeedback(null);
      setLocked(false);
    }, reduce ? 150 : 550);
  };

  const restart = () => {
    setPhase("intro");
    setIndex(0);
    setCorrect(0);
    setFeedback(null);
    setLocked(false);
  };

  return (
    <section id="level-test" className="relative overflow-hidden bg-navy text-cream">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(61,139,255,0.22),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(255,225,74,0.14),transparent_40%)]" />
      <div className="container-shell section-pad relative z-10">
        <Reveal>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-yellow">
            60-second Language Test
          </p>
        </Reveal>
        <h2 className="section-title font-display max-w-3xl">
          <DropWords text="Δεν ξέρεις από πού να ξεκινήσεις;" />
        </h2>
        <Reveal delay={0.08}>
          <p className="mt-2 max-w-xl text-sm text-cream/70 md:hidden">
            Κάνε το 60-second Language Test. Χωρίς άγχος. Δεν κρατάμε βαθμούς.
            Ακόμα. 😏
          </p>
        </Reveal>

        <div className="section-stack mx-auto max-w-2xl rounded-[1.5rem] border-[3px] border-ink bg-cream p-4 text-ink shadow-[6px_6px_0_#3d8bff]">
          <AnimatePresence mode="wait">
            {phase === "intro" ? (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-5"
              >
                <p className="font-display text-2xl sm:text-3xl">
                  Διάλεξε γλώσσα
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <LangStartButton
                    label="🇩🇪 Γερμανικά"
                    onClick={() => start("german")}
                    tone="bg-coral text-paper"
                  />
                  <LangStartButton
                    label="🇬🇧 Αγγλικά"
                    onClick={() => start("english")}
                    tone="bg-blue text-paper"
                  />
                </div>
              </motion.div>
            ) : null}

            {phase === "quiz" && current ? (
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-muted">
                    Ερώτηση {index + 1} / {questions.length}
                  </p>
                  <p className="rounded-full bg-navy px-3 py-1 text-xs font-extrabold text-cream">
                    {current.level}
                  </p>
                </div>
                <div className="mb-6 h-2.5 overflow-hidden rounded-full bg-ink/10">
                  <motion.div
                    className="h-full rounded-full bg-coral"
                    initial={false}
                    animate={{
                      width: `${((index + (feedback ? 1 : 0)) / questions.length) * 100}%`,
                    }}
                    transition={{ duration: 0.35 }}
                  />
                </div>

                <p className="font-display text-[1.25rem] leading-snug md:text-xl">
                  {current.prompt}
                </p>

                <div className="mt-3 grid gap-2">
                  {current.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      disabled={locked}
                      onClick={() => answer(option)}
                      className={cn(
                        "focus-ring rounded-2xl border-[3px] border-ink px-3 py-2.5 text-left text-sm font-bold transition md:py-2.5",
                        feedback && option === current.answer
                          ? "bg-green"
                          : feedback && option !== current.answer
                            ? "bg-cream opacity-55"
                            : "bg-paper hover:bg-yellow",
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <div className="mt-4 min-h-[1.75rem] text-sm font-bold">
                  {feedback === "correct" ? (
                    <span className="text-green">Ναι! Πάμε παρακάτω. ✨</span>
                  ) : null}
                  {feedback === "wrong" ? (
                    <span className="text-coral">Οκ, μάθημα για μετά. 😄</span>
                  ) : null}
                </div>
              </motion.div>
            ) : null}

            {phase === "result" ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-5"
              >
                <p className="text-5xl" aria-hidden>
                  {band.emoji}
                </p>
                <p className="font-display text-3xl leading-tight sm:text-4xl">
                  {band.title}
                </p>
                <p className="text-ink/75">{band.body}</p>
                <p className="rounded-2xl border-2 border-ink bg-yellow/70 p-4 font-bold">
                  {band.proposal}
                </p>
                <p className="text-xs text-muted">
                  Το quiz δίνει μόνο μια ενδεικτική εικόνα του επιπέδου σου και
                  δεν αντικαθιστά επίσημη αξιολόγηση.
                </p>
                <p className="text-sm font-bold text-ink/55">
                  Score vibe: {correct}/{questions.length}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="primary"
                    onClick={() => {
                      openContact({
                        interest: lang ?? "german",
                        goal: selectedGoal ?? undefined,
                        estimatedLevel: band.id,
                        testScore: correct,
                      });
                    }}
                  >
                    Βρες το πρόγραμμα που σου ταιριάζει →
                  </Button>
                  <Button variant="ghost" onClick={() => scrollToId("pricing")}>
                    Δες τα Modes
                  </Button>
                  <Button variant="ghost" onClick={restart}>
                    Ξανά
                  </Button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function LangStartButton({
  label,
  onClick,
  tone,
}: {
  label: string;
  onClick: () => void;
  tone: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "focus-ring rounded-2xl border-[3px] border-ink px-4 py-3 text-left text-base font-extrabold shadow-[4px_4px_0_#1a1433]",
        tone,
      )}
    >
      {label}
    </button>
  );
}
