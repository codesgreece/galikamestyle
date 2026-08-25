"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, DropWords } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { useContactModal } from "@/components/providers/ContactProvider";
import { cn } from "@/lib/utils";

type Answers = {
  interest?: "german" | "english";
  format?: "private" | "group";
  goal?: "start" | "improve" | "exams";
};

const steps = [
  {
    key: "interest" as const,
    question: "Τι θέλεις να μάθεις;",
    options: [
      { value: "german", label: "Γερμανικά" },
      { value: "english", label: "Αγγλικά" },
    ],
  },
  {
    key: "format" as const,
    question: "Πώς προτιμάς να μαθαίνεις;",
    options: [
      { value: "private", label: "Μόνος / Μόνη" },
      { value: "group", label: "Με ομάδα" },
    ],
  },
  {
    key: "goal" as const,
    question: "Ποιος είναι ο στόχος σου;",
    options: [
      { value: "start", label: "Νέα αρχή" },
      { value: "improve", label: "Βελτίωση" },
      { value: "exams", label: "Εξετάσεις" },
    ],
  },
];

export function FitQuiz() {
  const { openContact } = useContactModal();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const done = step >= steps.length;

  const select = (key: keyof Answers, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setStep((s) => s + 1);
  };

  const result =
    answers.format === "group"
      ? {
          title: "Εσύ είσαι για TEAM MODE! 🚀",
          text: "Μαθαίνεις καλύτερα παρέα — και το διασκεδάζεις κιόλας.",
        }
      : {
          title: "Το SOLO MODE σου ταιριάζει! 🎯",
          text: "Θέλεις ρυθμό στα μέτρα σου και απόλυτη εστίαση.",
        };

  return (
    <section id="quiz" className="relative bg-cream-deep">
      <div className="container-shell section-pad">
        <Reveal>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue">
            Quick quiz
          </p>
        </Reveal>
        <h2 className="font-display mt-3 text-[clamp(2rem,5vw,3.6rem)]">
          <DropWords text="Ποιο μάθημα σου ταιριάζει;" />
        </h2>

        <div className="mx-auto mt-10 max-w-2xl rounded-[2rem] border-[3px] border-ink bg-paper p-6 shadow-[8px_8px_0_#1a1433] md:p-8">
          <div className="mb-6 flex gap-2">
            {steps.map((_, i) => (
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
            {!done ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
              >
                <p className="font-display text-2xl md:text-3xl">
                  {steps[step].question}
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {steps[step].options.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => select(steps[step].key, opt.value)}
                      className="focus-ring rounded-2xl border-[3px] border-ink bg-cream px-4 py-4 text-left font-bold shadow-[4px_4px_0_#1a1433] transition hover:bg-yellow"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <p className="font-display text-3xl md:text-4xl">{result.title}</p>
                <p className="text-ink/70">{result.text}</p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    variant="primary"
                    onClick={() =>
                      openContact({
                        interest: answers.interest,
                        format: answers.format,
                      })
                    }
                  >
                    Πάμε να το κανονίσουμε →
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setStep(0);
                      setAnswers({});
                    }}
                  >
                    Ξανά
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
