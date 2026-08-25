"use client";

import { motion } from "framer-motion";
import { Reveal, DropWords } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { useContactModal } from "@/components/providers/ContactProvider";
import { siteConfig } from "@/lib/config";

export function Pricing() {
  const { openContact } = useContactModal();

  return (
    <section id="pricing" className="relative bg-cream">
      <div className="container-shell section-pad">
        <Reveal>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-coral">
            Learning modes
          </p>
        </Reveal>
        <h2 className="section-title font-display max-w-3xl">
          <DropWords text="Διάλεξε το δικό σου learning mode." />
        </h2>
        <Reveal delay={0.1}>
          <p className="mt-1 text-sm text-ink/65">Ποιο είναι το δικό σου στυλ;</p>
        </Reveal>

        <div className="section-stack grid gap-3 md:grid-cols-2">
          <motion.article
            className="group relative overflow-hidden rounded-[1.5rem] border-[3px] border-ink bg-navy p-4 text-cream shadow-[6px_6px_0_#ff5d7a] md:p-5"
            whileHover={{ y: -4 }}
          >
            <span className="absolute right-4 top-4 rotate-[-8deg] rounded-full border-2 border-ink bg-yellow px-2.5 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-wide text-ink">
              Προσφορά
            </span>
            <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-yellow">
              Solo Mode
            </p>
            <div className="mt-1 flex items-end justify-between gap-3 pr-16">
              <div>
                <h3 className="font-display text-2xl leading-tight">Ιδιαίτερα</h3>
                <p className="mt-0.5 text-sm text-cream/65">8 ώρες / μήνα</p>
              </div>
              <div className="flex items-end gap-2">
                <p className="font-display text-4xl leading-none text-yellow">
                  {siteConfig.pricing.private.offer}€
                </p>
                <p className="pb-1 text-sm text-cream/40 line-through">
                  {siteConfig.pricing.private.regular}€
                </p>
              </div>
            </div>
            <p className="mt-2 max-w-sm text-sm text-cream/75">
              Ένας μαθητής. Ένα πρόγραμμα φτιαγμένο στα μέτρα του.
            </p>
            <div className="mt-3">
              <Button
                variant="yellow"
                onClick={() => openContact({ format: "private", interest: "german" })}
              >
                Ξεκινάμε →
              </Button>
            </div>
            <div className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-coral/30 blur-2xl transition group-hover:scale-150" />
          </motion.article>

          <motion.article
            className="group relative overflow-hidden rounded-[1.5rem] border-[3px] border-ink bg-paper p-4 shadow-[6px_6px_0_#3d8bff] md:p-5"
            whileHover={{ y: -4 }}
          >
            <span className="absolute right-4 top-4 rotate-[8deg] rounded-full border-2 border-ink bg-coral px-2.5 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-wide text-paper">
              Προσφορά
            </span>
            <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-blue">
              Team Mode
            </p>
            <div className="mt-1 flex items-end justify-between gap-3 pr-16">
              <div>
                <h3 className="font-display text-2xl leading-tight">Ομαδικά</h3>
                <p className="mt-0.5 text-sm text-ink/60">
                  3–4 άτομα · 8 ώρες / μήνα
                </p>
              </div>
              <div className="flex items-end gap-2">
                <p className="font-display text-4xl leading-none text-blue">
                  {siteConfig.pricing.group.offer}€
                </p>
                <p className="pb-1 text-sm text-ink/35 line-through">
                  {siteConfig.pricing.group.regular}€
                </p>
              </div>
            </div>
            <p className="mt-2 max-w-sm text-sm text-ink/70">
              Μαθαίνεις μαζί. Προχωράτε μαζί. Και ναι, είναι πιο fun.
            </p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <Button
                variant="secondary"
                onClick={() => openContact({ format: "group", interest: "german" })}
              >
                Μπαίνω στην ομάδα →
              </Button>
              <div className="flex -space-x-2">
              {[0, 1, 2, 3].map((i) => (
                <motion.span
                  key={i}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink bg-yellow text-xs font-extrabold"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 1.8, delay: i * 0.12, repeat: Infinity }}
                >
                  {i + 1}
                </motion.span>
              ))}
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
