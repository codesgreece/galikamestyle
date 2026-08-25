"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Reveal, DropWords } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const levels = [
  { code: "A1", line: "Ξεκινάμε!", color: "bg-yellow" },
  { code: "A2", line: "Τώρα αρχίζει να βγάζει νόημα.", color: "bg-coral text-paper" },
  { code: "B1", line: "Μπορώ να συνεννοηθώ. Κάτι γίνεται εδώ.", color: "bg-blue text-paper" },
  { code: "B2", line: "Μιλάω άνετα. Πρόσεχε κόσμο.", color: "bg-green text-ink" },
  { code: "C1", line: "Εντάξει, το ’χω.", color: "bg-lilac text-ink" },
];

export function Levels() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="levels" className="relative overflow-hidden bg-navy text-cream">
      <div className="container-shell section-pad">
        <Reveal>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-yellow">
            Από “Hallo” μέχρι “Μιλάω και δεν σταματάω”
          </p>
        </Reveal>
        <h2 className="font-display mt-4 max-w-3xl text-[clamp(1.9rem,6.5vw,3.6rem)] leading-[1.18] sm:leading-[1.12]">
          <DropWords text="Πού βρίσκεσαι τώρα;" />
        </h2>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-xl text-cream/70">
            Δεν έχει σημασία. Το μόνο σημαντικό είναι προς τα πού πας.
          </p>
        </Reveal>

        <div ref={ref} className="relative mt-14">
          <div className="absolute left-6 top-4 bottom-4 w-1 rounded-full bg-cream/15 md:left-1/2 md:-translate-x-1/2" />
          <motion.div
            className="absolute left-6 top-4 w-1 origin-top rounded-full bg-yellow md:left-1/2 md:-translate-x-1/2"
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: (active + 1) / levels.length } : { scaleY: 0 }}
            style={{ height: "calc(100% - 2rem)" }}
            transition={{ duration: 0.5 }}
          />

          <div className="space-y-6">
            {levels.map((level, i) => {
              const unlocked = inView && i <= active;
              return (
                <motion.button
                  key={level.code}
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    "relative ml-12 block w-[calc(100%-3rem)] rounded-3xl border-[3px] border-ink p-6 text-left transition sm:ml-14 sm:w-[calc(100%-3.5rem)] md:ml-0 md:w-full md:max-w-xl",
                    i % 2 === 0 ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8",
                    unlocked ? "bg-cream text-ink shadow-[8px_8px_0_#ffe14a]" : "bg-navy-soft text-cream/50",
                  )}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <span
                    className={cn(
                      "absolute -left-[2.85rem] top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-ink text-xs font-extrabold text-ink md:left-1/2 md:-translate-x-1/2",
                      unlocked ? level.color : "bg-cream/20 text-cream",
                    )}
                  >
                    {unlocked ? "✓" : i + 1}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className={cn("rounded-xl px-3 py-1 font-display text-2xl text-ink", level.color)}>
                      {level.code}
                    </span>
                    <p className="font-bold">{level.line}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {levels.map((level, i) => (
              <button
                key={level.code}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "focus-ring rounded-full border-2 border-ink px-3 py-1 text-xs font-extrabold",
                  i <= active ? "bg-yellow text-ink" : "bg-cream/10 text-cream/60",
                )}
              >
                {level.code}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
