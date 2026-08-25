"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, DropWords } from "@/components/ui/Reveal";
import { useJourney } from "@/components/providers/JourneyProvider";
import { cn } from "@/lib/utils";

const languages = [
  {
    id: "german" as const,
    flag: "🇩🇪",
    title: "ΓΕΡΜΑΝΙΚΑ",
    blurb: "Από Hallo μέχρι Goethe. Ναι, γίνεται.",
    words: ["Guten Tag", "Genau!", "Wunderbar", "Los geht’s"],
    facts: ["Goethe", "ÖSD", "TELC", "ΚΠΓ", "DaF"],
    accent: "bg-coral",
  },
  {
    id: "english" as const,
    flag: "🇬🇧",
    title: "ΑΓΓΛΙΚΑ",
    blurb: "Hello world… και μετά μιλάς άνετα.",
    words: ["Hello!", "Awesome", "Let’s talk", "Level up"],
    facts: ["NOCN C2", "A1 → C1", "Speaking", "Exams"],
    accent: "bg-blue",
  },
];

export function LanguageSelect() {
  const { selectedLanguage, setLanguage } = useJourney();
  const [active, setActive] = useState<"german" | "english" | null>(
    selectedLanguage,
  );

  const pick = (id: "german" | "english") => {
    const next = active === id ? null : id;
    setActive(next);
    if (next) setLanguage(next);
  };

  return (
    <section id="languages" className="relative overflow-hidden bg-cream">
      <div className="container-shell section-pad">
        <Reveal>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-coral">
            Character select
          </p>
        </Reveal>
        <h2 className="section-title font-display max-w-3xl">
          <DropWords text="Ποια γλώσσα θα κατακτήσεις πρώτα;" />
        </h2>

        <div className="section-stack grid gap-5 lg:grid-cols-2 lg:gap-6">
          {languages.map((lang) => {
            const isActive = active === lang.id;
            return (
              <motion.button
                key={lang.id}
                type="button"
                onClick={() => pick(lang.id)}
                onMouseEnter={() => setActive(lang.id)}
                className={cn(
                  "pop-card relative overflow-hidden rounded-3xl p-6 text-left sm:p-7 lg:p-6",
                  isActive ? "bg-navy text-cream" : "bg-paper text-ink",
                )}
                whileTap={{ scale: 0.985 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-4xl" aria-hidden>
                      {lang.flag}
                    </span>
                    <h3 className="font-display mt-3 text-3xl leading-tight lg:text-4xl">
                      {lang.title}
                    </h3>
                    <p
                      className={cn(
                        "mt-3 max-w-sm leading-relaxed lg:mt-2",
                        isActive ? "text-cream/75" : "text-ink/65",
                      )}
                    >
                      {lang.blurb}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-ink",
                      lang.accent,
                    )}
                  >
                    Pick me
                  </span>
                </div>

                <AnimatePresence>
                  {isActive ? (
                    <motion.div
                      className="mt-5 space-y-3 lg:mt-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="flex flex-wrap gap-2">
                        {lang.words.map((w, i) => (
                          <motion.span
                            key={w}
                            className="rounded-full border-2 border-cream/30 bg-cream/10 px-3 py-1 text-sm font-bold"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                          >
                            {w}
                          </motion.span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {lang.facts.map((f) => (
                          <span
                            key={f}
                            className="rounded-xl bg-yellow px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-ink"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <p className="mt-5 text-sm font-bold text-muted lg:mt-4">
                      Tap / hover για unlock →
                    </p>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
