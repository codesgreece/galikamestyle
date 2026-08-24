"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function Philosophy() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const opacity = useTransform(scrollYProgress, [0.15, 0.35, 0.7, 0.9], [0, 1, 1, 0.4]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-charcoal py-[clamp(6rem,14vw,10rem)] text-cream"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(110,36,53,0.28),transparent_55%)]" />
      <div className="noise-overlay" />
      <motion.div
        style={{ y, opacity }}
        className="container-shell relative z-10 mx-auto max-w-4xl text-center"
      >
        <p className="text-[0.72rem] uppercase tracking-[0.32em] text-gold">Φιλοσοφία</p>
        <blockquote className="font-display mt-8 text-[clamp(1.8rem,4.5vw,3.4rem)] leading-[1.2] text-balance">
          «Μια γλώσσα δεν μαθαίνεται απλά για να περάσεις μια εξέταση.
          <span className="mt-3 block text-cream/55">
            Μαθαίνεται για να μπορείς να ανοίξεις μια πόρτα.»
          </span>
        </blockquote>
        <div className="mx-auto mt-10 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
      </motion.div>
    </section>
  );
}
