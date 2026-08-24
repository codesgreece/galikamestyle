"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Reveal, TextReveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { useContactModal } from "@/components/providers/ContactProvider";
import { siteConfig } from "@/lib/config";

const plans = [
  {
    id: "private" as const,
    title: "Ιδιαίτερα",
    offer: siteConfig.pricing.private.offer,
    regular: siteConfig.pricing.private.regular,
    meta: `${siteConfig.pricing.private.hours} διδακτικές ώρες τον μήνα`,
    ideal: [
      "Προσωπικό ρυθμό μάθησης",
      "Απόλυτη προσοχή στις ανάγκες του μαθητή",
      "Εξατομικευμένη προετοιμασία",
      "Στοχευμένη πρόοδο",
    ],
    cta: "Επικοινώνησε τώρα",
    featured: true,
  },
  {
    id: "group" as const,
    title: "Ομαδικά",
    offer: siteConfig.pricing.group.offer,
    regular: siteConfig.pricing.group.regular,
    meta: `${siteConfig.pricing.group.hours} διδακτικές ώρες τον μήνα · Ομάδες ${siteConfig.pricing.group.size} ατόμων`,
    ideal: [
      "Διαδραστική μάθηση",
      "Συνεργασία",
      "Σταθερό πρόγραμμα",
      "Οικονομικότερη επιλογή",
    ],
    cta: "Βρες τη θέση σου",
    featured: false,
  },
];

export function Pricing() {
  const { openContact } = useContactModal();

  return (
    <section id="pricing" className="relative bg-cream-deep text-ink">
      <div className="container-shell section-pad">
        <div className="max-w-3xl">
          <Reveal>
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-wine">
              Προγράμματα & Τιμές
            </p>
          </Reveal>
          <TextReveal
            text="Διάλεξε τον τρόπο"
            className="font-display mt-5 text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.05]"
          />
          <TextReveal
            text="που σου ταιριάζει."
            className="font-display mt-1 text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.05] text-wine"
            delay={0.12}
          />
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {plans.map((plan, i) => (
            <motion.article
              key={plan.id}
              className={
                plan.featured
                  ? "relative overflow-hidden border border-wine/20 bg-charcoal p-7 text-cream shadow-[0_30px_80px_rgba(20,10,12,0.28)] md:p-10"
                  : "relative overflow-hidden border border-ink/10 bg-paper p-7 shadow-[0_24px_60px_rgba(40,24,18,0.1)] md:p-10"
              }
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className={
                  plan.featured
                    ? "absolute right-6 top-6 rotate-[-8deg] border border-gold/40 bg-wine px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.24em] text-gold"
                    : "absolute right-6 top-6 rotate-[-8deg] border border-wine/25 bg-cream px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.24em] text-wine"
                }
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
              >
                Προσφορά
              </motion.div>

              <p className="text-xs uppercase tracking-[0.24em] opacity-55">{plan.title}</p>
              <div className="mt-8 flex items-end gap-4">
                <motion.p
                  className="font-display text-6xl leading-none md:text-7xl"
                  initial={{ opacity: 0.4 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  {plan.offer}€
                </motion.p>
                <div className="pb-2">
                  <p
                    className={
                      plan.featured
                        ? "text-sm text-cream/40 line-through"
                        : "text-sm text-ink/40 line-through"
                    }
                  >
                    {plan.regular}€
                  </p>
                  <p
                    className={
                      plan.featured
                        ? "text-xs uppercase tracking-[0.16em] text-gold"
                        : "text-xs uppercase tracking-[0.16em] text-wine"
                    }
                  >
                    / μήνα
                  </p>
                </div>
              </div>

              <p
                className={
                  plan.featured
                    ? "mt-5 text-sm text-cream/60"
                    : "mt-5 text-sm text-ink/60"
                }
              >
                {plan.meta}
              </p>

              <div
                className={
                  plan.featured
                    ? "my-8 h-px bg-gradient-to-r from-gold/50 to-transparent"
                    : "my-8 h-px bg-gradient-to-r from-wine/40 to-transparent"
                }
              />

              <p className="text-xs uppercase tracking-[0.2em] opacity-50">Ιδανικό για</p>
              <ul className="mt-4 space-y-3">
                {plan.ideal.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm md:text-base">
                    <Check
                      size={16}
                      className={plan.featured ? "mt-1 text-gold" : "mt-1 text-wine"}
                    />
                    <span className={plan.featured ? "text-cream/80" : "text-ink/75"}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <Button
                  variant={plan.featured ? "light" : "primary"}
                  className="w-full sm:w-auto"
                  magnetic
                  onClick={() =>
                    openContact({
                      format: plan.id,
                      interest: "german",
                    })
                  }
                >
                  {plan.cta}
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
