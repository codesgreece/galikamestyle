"use client";

import { motion } from "framer-motion";
import { Award, BadgeCheck, Sparkles } from "lucide-react";
import { Reveal, TextReveal } from "@/components/ui/Reveal";

const germanCerts = [
  {
    name: "ÖSD",
    detail: "Αναγνωρισμένη πιστοποίηση γερμανικής γλώσσας",
    icon: Award,
  },
  {
    name: "ΚΠΓ",
    detail: "Κρατικό Πιστοποιητικό Γλωσσομάθειας",
    icon: BadgeCheck,
  },
  {
    name: "Goethe C2",
    detail: "Υψηλότατο επίπεδο πιστοποίησης Goethe-Institut",
    icon: Sparkles,
  },
];

const englishCerts = [
  {
    name: "NOCN C2",
    detail: "Πιστοποίηση Αγγλικών επιπέδου C2",
    icon: Award,
  },
];

export function Certificates() {
  return (
    <section id="certificates" className="relative bg-paper text-ink">
      <div className="container-shell section-pad">
        <div className="max-w-3xl">
          <Reveal>
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-wine">
              Πτυχία & Πιστοποιήσεις
            </p>
          </Reveal>
          <TextReveal
            text="Η γνώση χρειάζεται βάση."
            className="font-display mt-5 text-[clamp(2.2rem,5vw,4rem)] leading-[1.05]"
          />
          <TextReveal
            text="Η επιτυχία χρειάζεται προετοιμασία."
            className="font-display mt-1 text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] text-ink/45"
            delay={0.12}
          />
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-start">
          <CertGroup title="Πιστοποιήσεις Γερμανικών" items={germanCerts} tone="dark" />
          <CertGroup title="Πιστοποιήσεις Αγγλικών" items={englishCerts} tone="light" />
        </div>
      </div>
    </section>
  );
}

function CertGroup({
  title,
  items,
  tone,
}: {
  title: string;
  items: typeof germanCerts;
  tone: "dark" | "light";
}) {
  return (
    <div>
      <Reveal>
        <h3 className="text-xs uppercase tracking-[0.24em] text-ink/50">{title}</h3>
      </Reveal>
      <div className="mt-5 space-y-4">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.article
              key={item.name}
              className={
                tone === "dark"
                  ? "depth-card group overflow-hidden p-6 text-cream md:p-7"
                  : "depth-card-light group overflow-hidden p-6 md:p-7"
              }
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ delay: i * 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-start gap-5">
                <div
                  className={
                    tone === "dark"
                      ? "flex h-12 w-12 items-center justify-center border border-gold/30 text-gold"
                      : "flex h-12 w-12 items-center justify-center border border-wine/20 text-wine"
                  }
                >
                  <Icon size={20} />
                </div>
                <div>
                  <p className="font-display text-3xl">{item.name}</p>
                  <p
                    className={
                      tone === "dark"
                        ? "mt-2 text-sm leading-relaxed text-cream/60"
                        : "mt-2 text-sm leading-relaxed text-ink/65"
                    }
                  >
                    {item.detail}
                  </p>
                </div>
              </div>
              <div
                className={
                  tone === "dark"
                    ? "mt-6 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-gold to-transparent transition duration-500 group-hover:scale-x-100"
                    : "mt-6 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-wine to-transparent transition duration-500 group-hover:scale-x-100"
                }
              />
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
