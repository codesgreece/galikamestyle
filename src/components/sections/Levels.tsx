"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, TextReveal } from "@/components/ui/Reveal";
import { FloatingLanguageElements } from "@/components/effects/FloatingLanguageElements";
import { cn } from "@/lib/utils";

const levels = [
  {
    code: "A1",
    title: "Πρώτα βήματα",
    description:
      "Κατανοείς και χρησιμοποιείς βασικές εκφράσεις για καθημερινές ανάγκες, με σιγουριά και σωστή προφορά.",
  },
  {
    code: "A2",
    title: "Καθημερινή επικοινωνία",
    description:
      "Συμμετέχεις σε απλές συνομιλίες, περιγράφεις εμπειρίες και διαχειρίζεσαι συνηθισμένες καταστάσεις.",
  },
  {
    code: "B1",
    title: "Ανεξάρτητη χρήση",
    description:
      "Εκφράζεσαι με συνοχή για γνώριμα θέματα και ξεκινάς πιο απαιτητική προετοιμασία εξετάσεων.",
  },
  {
    code: "B2",
    title: "Άνετη επικοινωνία",
    description:
      "Κατανοείς σύνθετα κείμενα, επιχειρηματολογείς και προετοιμάζεσαι στοχευμένα για πιστοποιήσεις.",
  },
  {
    code: "C1",
    title: "Υψηλή επάρκεια",
    description:
      "Χρησιμοποιείς τη γλώσσα με ακρίβεια και ευελιξία σε ακαδημαϊκά και επαγγελματικά πλαίσια.",
  },
];

export function Levels() {
  const [active, setActive] = useState(0);
  const [lang, setLang] = useState<"de" | "en">("de");

  return (
    <section id="levels" className="relative overflow-hidden bg-charcoal text-cream">
      <FloatingLanguageElements density="lite" className="opacity-70" />
      <div className="noise-overlay" />
      <div className="container-shell section-pad relative z-10">
        <div className="max-w-3xl">
          <Reveal>
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-gold">
              Μάθε τη γλώσσα στο επίπεδό σου
            </p>
          </Reveal>
          <TextReveal
            text="Από το πρώτο “Hallo”"
            className="font-display mt-5 text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.05]"
          />
          <TextReveal
            text="μέχρι το επόμενο μεγάλο σου βήμα."
            className="font-display mt-1 text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.05] text-cream/55"
            delay={0.12}
          />
        </div>

        <Reveal className="mt-10" delay={0.1}>
          <div
            role="tablist"
            aria-label="Επιλογή γλώσσας"
            className="inline-flex border border-cream/15 p-1"
          >
            <LangTab
              active={lang === "de"}
              onClick={() => setLang("de")}
              label="Γερμανικά"
              code="DE"
            />
            <LangTab
              active={lang === "en"}
              onClick={() => setLang("en")}
              label="Αγγλικά"
              code="EN"
            />
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {levels.map((level, i) => (
              <button
                key={level.code}
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                aria-pressed={active === i}
                className={cn(
                  "focus-ring min-w-[5.5rem] border px-4 py-4 text-left transition duration-300 lg:min-w-0",
                  active === i
                    ? "border-gold/40 bg-wine/35 text-cream"
                    : "border-cream/10 bg-cream/[0.03] text-cream/55 hover:border-cream/25 hover:text-cream",
                )}
              >
                <span className="font-display block text-2xl">{level.code}</span>
                <span className="mt-1 hidden text-xs uppercase tracking-[0.16em] lg:block">
                  {level.title}
                </span>
              </button>
            ))}
          </div>

          <div className="relative min-h-[280px]">
            <AnimatePresence mode="wait">
              <motion.article
                key={`${lang}-${levels[active].code}`}
                className="depth-card h-full p-7 md:p-10"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-end justify-between gap-4">
                  <p className="font-display text-6xl text-gold md:text-7xl">
                    {levels[active].code}
                  </p>
                  <p className="text-right text-xs uppercase tracking-[0.22em] text-cream/45">
                    {lang === "de" ? "Γερμανικά" : "Αγγλικά"}
                  </p>
                </div>
                <div className="gold-rule mt-6" />
                <h3 className="font-display mt-6 text-3xl md:text-4xl">
                  {levels[active].title}
                </h3>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-cream/65 md:text-lg">
                  {levels[active].description}
                </p>
                <div className="mt-8 flex items-center gap-2">
                  {levels.map((level, i) => (
                    <span
                      key={level.code}
                      className={cn(
                        "h-1 flex-1 transition-colors duration-300",
                        i <= active ? "bg-gold" : "bg-cream/15",
                      )}
                    />
                  ))}
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function LangTab({
  active,
  onClick,
  label,
  code,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  code: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "focus-ring px-4 py-2.5 text-sm transition",
        active ? "bg-cream text-ink" : "text-cream/60 hover:text-cream",
      )}
    >
      <span className="mr-2 text-[0.68rem] tracking-[0.18em] opacity-70">{code}</span>
      {label}
    </button>
  );
}
