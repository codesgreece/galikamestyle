"use client";

import { motion } from "framer-motion";
import { Reveal, DropWords } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { useContactModal } from "@/components/providers/ContactProvider";
import { DEFAULT_OFFERS, type PublicOffer } from "@/lib/defaults";

export function Pricing({ offers }: { offers?: PublicOffer[] }) {
  const { openContact } = useContactModal();
  const list = offers && offers.length > 0 ? offers : DEFAULT_OFFERS;

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
          {list.map((offer, index) => {
            const isNavy = offer.accent !== "paper";
            const format = index === 0 ? "private" : "group";
            return (
              <motion.article
                key={offer.id}
                className={`group relative overflow-hidden rounded-[1.5rem] border-[3px] border-ink p-4 md:p-5 ${
                  isNavy
                    ? "bg-navy text-cream shadow-[6px_6px_0_#ff5d7a]"
                    : "bg-paper shadow-[6px_6px_0_#3d8bff]"
                }`}
                whileHover={{ y: -4 }}
              >
                {offer.badgeText ? (
                  <span
                    className={`absolute right-4 top-4 rounded-full border-2 border-ink px-2.5 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-wide ${
                      isNavy
                        ? "rotate-[-8deg] bg-yellow text-ink"
                        : "rotate-[8deg] bg-coral text-paper"
                    }`}
                  >
                    {offer.badgeText}
                  </span>
                ) : null}
                <p
                  className={`text-[0.65rem] font-extrabold uppercase tracking-[0.2em] ${
                    isNavy ? "text-yellow" : "text-blue"
                  }`}
                >
                  {isNavy ? "Solo Mode" : "Team Mode"}
                </p>
                <div className="mt-1 flex items-end justify-between gap-3 pr-16">
                  <div>
                    <h3 className="font-display text-2xl leading-tight">
                      {offer.title}
                    </h3>
                    <p
                      className={`mt-0.5 text-sm ${
                        isNavy ? "text-cream/65" : "text-ink/60"
                      }`}
                    >
                      {offer.billingPeriod}
                    </p>
                  </div>
                  <div className="flex items-end gap-2">
                    <p
                      className={`font-display text-4xl leading-none ${
                        isNavy ? "text-yellow" : "text-blue"
                      }`}
                    >
                      {offer.currentPrice}€
                    </p>
                    <p
                      className={`pb-1 text-sm line-through ${
                        isNavy ? "text-cream/40" : "text-ink/35"
                      }`}
                    >
                      {offer.originalPrice}€
                    </p>
                  </div>
                </div>
                <p
                  className={`mt-2 max-w-sm text-sm ${
                    isNavy ? "text-cream/75" : "text-ink/70"
                  }`}
                >
                  {offer.description}
                </p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <Button
                    variant={isNavy ? "yellow" : "secondary"}
                    onClick={() =>
                      openContact({ format, interest: "german" })
                    }
                  >
                    {isNavy ? "Ξεκινάμε →" : "Μπαίνω στην ομάδα →"}
                  </Button>
                  {!isNavy ? (
                    <div className="flex -space-x-2">
                      {[0, 1, 2, 3].map((i) => (
                        <motion.span
                          key={i}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink bg-yellow text-xs font-extrabold"
                          animate={{ y: [0, -3, 0] }}
                          transition={{
                            duration: 1.8,
                            delay: i * 0.12,
                            repeat: Infinity,
                          }}
                        >
                          {i + 1}
                        </motion.span>
                      ))}
                    </div>
                  ) : null}
                </div>
                {isNavy ? (
                  <div className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-coral/30 blur-2xl transition group-hover:scale-150" />
                ) : null}
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
