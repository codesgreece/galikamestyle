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
        <h2 className="font-display mt-4 max-w-3xl text-[clamp(1.9rem,6.5vw,3.6rem)] leading-[1.18] sm:leading-[1.12]">
          <DropWords text="Διάλεξε το δικό σου learning mode." />
        </h2>
        <Reveal delay={0.1}>
          <p className="mt-4 text-ink/65">Ποιο είναι το δικό σου στυλ;</p>
        </Reveal>

        <div className="mt-14 grid gap-7 lg:grid-cols-2">
          <motion.article
            className="group relative overflow-hidden rounded-[2rem] border-[3px] border-ink bg-navy p-7 text-cream shadow-[8px_8px_0_#ff5d7a] md:p-9 md:shadow-[10px_10px_0_#ff5d7a]"
            whileHover={{ y: -6 }}
          >
            <span className="absolute right-5 top-5 rotate-[-8deg] rounded-full border-2 border-ink bg-yellow px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-ink">
              Προσφορά
            </span>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-yellow">
              Solo Mode
            </p>
            <h3 className="font-display mt-4 text-3xl leading-tight sm:text-4xl">Ιδιαίτερα</h3>
            <p className="mt-2 text-cream/65">8 ώρες / μήνα</p>
            <div className="mt-6 flex items-end gap-3">
              <p className="font-display text-6xl text-yellow">
                {siteConfig.pricing.private.offer}€
              </p>
              <p className="pb-2 text-cream/40 line-through">
                {siteConfig.pricing.private.regular}€
              </p>
            </div>
            <p className="mt-5 max-w-sm text-sm text-cream/75">
              Ένας μαθητής. Ένα πρόγραμμα φτιαγμένο στα μέτρα του.
            </p>
            <div className="mt-8">
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
            className="group relative overflow-hidden rounded-[2rem] border-[3px] border-ink bg-paper p-7 shadow-[8px_8px_0_#3d8bff] md:p-9 md:shadow-[10px_10px_0_#3d8bff]"
            whileHover={{ y: -6 }}
          >
            <span className="absolute right-5 top-5 rotate-[8deg] rounded-full border-2 border-ink bg-coral px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-paper">
              Προσφορά
            </span>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue">
              Team Mode
            </p>
            <h3 className="font-display mt-4 text-3xl leading-tight sm:text-4xl">Ομαδικά</h3>
            <p className="mt-2 text-ink/60">
              3–4 άτομα · 8 ώρες / μήνα
            </p>
            <div className="mt-6 flex items-end gap-3">
              <p className="font-display text-6xl text-blue">
                {siteConfig.pricing.group.offer}€
              </p>
              <p className="pb-2 text-ink/35 line-through">
                {siteConfig.pricing.group.regular}€
              </p>
            </div>
            <p className="mt-5 max-w-sm text-sm text-ink/70">
              Μαθαίνεις μαζί. Προχωράτε μαζί. Και ναι, είναι πιο fun.
            </p>
            <div className="mt-8">
              <Button
                variant="secondary"
                onClick={() => openContact({ format: "group", interest: "german" })}
              >
                Μπαίνω στην ομάδα →
              </Button>
            </div>
            <div className="mt-6 flex -space-x-2">
              {[0, 1, 2, 3].map((i) => (
                <motion.span
                  key={i}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink bg-yellow text-xs font-extrabold"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 1.8, delay: i * 0.12, repeat: Infinity }}
                >
                  {i + 1}
                </motion.span>
              ))}
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
