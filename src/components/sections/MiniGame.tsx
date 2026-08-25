"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Reveal, DropWords } from "@/components/ui/Reveal";
import { ConfettiBurst } from "@/components/ui/PlayfulFX";
import { pickRandomQuestion } from "@/data/game";
import { cn } from "@/lib/utils";

export function MiniGame() {
  const [question, setQuestion] = useState(() => pickRandomQuestion());
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [picked, setPicked] = useState<string | null>(null);

  const options = useMemo(() => question.options, [question]);

  const onPick = (option: string) => {
    if (status === "correct") return;
    setPicked(option);
    if (option === question.answer) {
      setStatus("correct");
    } else {
      setStatus("wrong");
    }
  };

  const next = () => {
    setQuestion(pickRandomQuestion(question.word));
    setStatus("idle");
    setPicked(null);
  };

  return (
    <section id="game" className="relative overflow-hidden bg-cream-deep">
      <div className="container-shell section-pad">
        <Reveal>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue">
            Mini challenge
          </p>
        </Reveal>
        <h2 className="font-display mt-3 text-[clamp(2rem,5vw,3.6rem)]">
          <DropWords text="Μικρή πρόκληση." />{" "}
          <span className="inline-block animate-wiggle">😏</span>
        </h2>

        <div className="relative mx-auto mt-10 max-w-xl">
          <div className="pop-card relative overflow-hidden rounded-3xl bg-paper p-6 md:p-8">
            <ConfettiBurst show={status === "correct"} />
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-muted">
              {question.lang === "de" ? "Γερμανικά" : "Αγγλικά"} → Ελληνικά
            </p>
            <p className="font-display mt-4 text-5xl tracking-wide md:text-6xl">
              {question.word}
            </p>
            <div className="mt-8 grid gap-3">
              {options.map((option) => {
                const isPicked = picked === option;
                const isAnswer = option === question.answer;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onPick(option)}
                    className={cn(
                      "focus-ring rounded-2xl border-[3px] border-ink px-4 py-4 text-left text-lg font-bold transition",
                      status === "idle" && "bg-cream hover:bg-yellow",
                      status !== "idle" && isAnswer && "bg-green text-ink",
                      status === "wrong" && isPicked && !isAnswer && "bg-coral text-paper",
                      status !== "idle" && !isAnswer && !isPicked && "bg-cream opacity-60",
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 min-h-[3rem]">
              {status === "correct" ? (
                <motion.p
                  className="font-display text-2xl text-green"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  🎉 Richtig! Σωστό!
                </motion.p>
              ) : null}
              {status === "wrong" ? (
                <p className="font-display text-2xl text-coral">
                  😄 Σχεδόν! Ξαναδοκίμασε.
                </p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={next}
              className="focus-ring mt-2 rounded-full border-2 border-ink bg-yellow px-4 py-2 text-sm font-extrabold"
            >
              Επόμενη λέξη →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
