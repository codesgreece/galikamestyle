"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function EndSurprise() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  return (
    <section ref={ref} className="relative overflow-hidden bg-cream py-20 md:py-28">
      <div className="container-shell text-center">
        <motion.blockquote
          className="font-display mx-auto max-w-3xl text-[clamp(1.6rem,4vw,3rem)] leading-[1.15]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Μια γλώσσα δεν μαθαίνεται για να περάσεις μια εξέταση.
          <span className="mt-3 block text-coral">
            Μαθαίνεται για να ανοίξεις μια πόρτα — με στυλ.
          </span>
        </motion.blockquote>

        {inView ? (
          <motion.p
            className="mx-auto mt-10 inline-flex rounded-full border-[3px] border-ink bg-yellow px-5 py-3 text-sm font-extrabold shadow-[5px_5px_0_#1a1433]"
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
          >
            🎉 Μπράβο, έφτασες μέχρι εδώ. Τώρα μένει να μάθεις και τη γλώσσα.
          </motion.p>
        ) : null}
      </div>
    </section>
  );
}
