"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HeroBackground } from "@/components/effects/HeroBackground";
import { FloatingLanguageElements } from "@/components/effects/FloatingLanguageElements";
import { scrollToId } from "@/lib/utils";
import { siteConfig } from "@/lib/config";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative isolate min-h-[100svh] overflow-hidden bg-ink text-cream"
    >
      <HeroBackground />
      <FloatingLanguageElements />

      <div className="container-shell relative z-10 flex min-h-[100svh] flex-col justify-end pb-16 pt-32 md:justify-center md:pb-24 md:pt-36">
        <div className="max-w-4xl">
          <motion.p
            className="mb-6 text-[0.72rem] uppercase tracking-[0.32em] text-gold/90"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {siteConfig.tagline}
          </motion.p>

          <div className="space-y-1 md:space-y-2" aria-label="Γερμανικά με Στυλ">
            <MaskedLine delay={0.15} className="font-display text-[clamp(2.8rem,10vw,6.5rem)] leading-[0.9] tracking-[-0.03em]">
              ΓΕΡΜΑΝΙΚΑ
            </MaskedLine>
            <MaskedLine
              delay={0.28}
              className="font-display text-[clamp(1.4rem,4vw,2.4rem)] leading-none tracking-[0.35em] text-cream/55"
            >
              ΜΕ
            </MaskedLine>
            <MaskedLine
              delay={0.4}
              className="font-display gradient-text text-[clamp(4.5rem,18vw,11rem)] leading-[0.82] tracking-[-0.04em]"
            >
              ΣΤΥΛ
            </MaskedLine>
          </div>

          <motion.div
            className="mt-8 max-w-xl space-y-4 md:mt-10"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
          >
            <p className="font-display text-2xl text-cream/90 md:text-3xl">
              Μαθαίνεις τη γλώσσα. Χτίζεις αυτοπεποίθηση.
            </p>
            <p className="text-base leading-relaxed text-cream/60 md:text-lg">
              Μαθήματα Γερμανικών και Αγγλικών για παιδιά από 10 ετών και άνω,
              με στόχο την πραγματική γνώση, την πρόοδο και την επιτυχία στις
              εξετάσεις.
            </p>
          </motion.div>

          <motion.div
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.85 }}
          >
            <Button
              variant="primary"
              magnetic
              onClick={() => scrollToId("contact")}
              className="min-h-12"
            >
              Κλείσε Επικοινωνία
            </Button>
            <Button
              variant="secondary"
              magnetic
              onClick={() => scrollToId("pricing")}
              className="min-h-12"
            >
              Δες τα Προγράμματα
              <ArrowDownRight size={16} />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MaskedLine({
  children,
  className,
  delay,
}: {
  children: string;
  className?: string;
  delay: number;
}) {
  const reduce = useReducedMotion();
  return (
    <div className="overflow-hidden">
      <motion.p
        className={className}
        initial={reduce ? false : { y: "110%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.p>
    </div>
  );
}
