"use client";

import { motion } from "framer-motion";
import { BookOpen, GraduationCap, Target } from "lucide-react";
import { Reveal, TextReveal } from "@/components/ui/Reveal";

const audiences = [
  {
    title: "Παιδιά 10+",
    text: "Για παιδιά από 10 ετών και άνω.",
    icon: BookOpen,
    tone: "light" as const,
  },
  {
    title: "Μαθητές",
    text: "Για εξέλιξη σε όλα τα επίπεδα από A1 έως C1.",
    icon: GraduationCap,
    tone: "dark" as const,
  },
  {
    title: "Εξετάσεις & Πιστοποιήσεις",
    text: "Για στοχευμένη προετοιμασία αναγνωρισμένων εξετάσεων.",
    icon: Target,
    tone: "wine" as const,
  },
];

export function Audience() {
  return (
    <section id="audience" className="bg-cream text-ink">
      <div className="container-shell section-pad">
        <div className="max-w-3xl">
          <Reveal>
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-wine">
              Για ποιους είναι
            </p>
          </Reveal>
          <TextReveal
            text="Για όσους θέλουν"
            className="font-display mt-5 text-[clamp(2.2rem,5vw,4rem)] leading-[1.05]"
          />
          <TextReveal
            text="να μάθουν πραγματικά."
            className="font-display mt-1 text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] text-ink/45"
            delay={0.12}
          />
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {audiences.map((item, i) => {
            const Icon = item.icon;
            const styles =
              item.tone === "dark"
                ? "bg-charcoal text-cream border-charcoal"
                : item.tone === "wine"
                  ? "bg-wine text-cream border-wine"
                  : "bg-paper text-ink border-ink/10";

            return (
              <motion.article
                key={item.title}
                className={`group relative min-h-[280px] overflow-hidden border p-7 md:p-8 ${styles}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.65 }}
                whileHover={{ y: -8 }}
              >
                <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gold/10 blur-2xl transition duration-500 group-hover:bg-gold/20" />
                <Icon
                  size={28}
                  className={
                    item.tone === "light" ? "text-wine" : "text-gold"
                  }
                />
                <h3 className="font-display mt-16 text-3xl leading-tight md:text-4xl">
                  {item.title}
                </h3>
                <p
                  className={
                    item.tone === "light"
                      ? "mt-4 text-base leading-relaxed text-ink/65"
                      : "mt-4 text-base leading-relaxed text-cream/70"
                  }
                >
                  {item.text}
                </p>
                <div
                  className={
                    item.tone === "light"
                      ? "absolute bottom-0 left-0 h-[2px] w-0 bg-wine transition-all duration-500 group-hover:w-full"
                      : "absolute bottom-0 left-0 h-[2px] w-0 bg-gold transition-all duration-500 group-hover:w-full"
                  }
                />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
