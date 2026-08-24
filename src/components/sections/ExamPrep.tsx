"use client";

import { motion } from "framer-motion";
import { Reveal, TextReveal } from "@/components/ui/Reveal";

const countries = [
  {
    name: "Ελλάδα",
    accent: "from-[#6e2435]/35) via-transparent to-transparent",
    mark: "GR",
  },
  {
    name: "Γερμανία",
    accent: "from-[#c4a574]/30) via-transparent to-transparent",
    mark: "DE",
  },
  {
    name: "Αυστρία",
    accent: "from-[#8c3045]/30) via-transparent to-transparent",
    mark: "AT",
  },
  {
    name: "Ελβετία",
    accent: "from-[#f6f1e8]/18) via-transparent to-transparent",
    mark: "CH",
  },
];

const exams = ["TELC", "Goethe", "ÖSD", "ΚΠΓ", "DaF"];

export function ExamPrep() {
  return (
    <section id="exams" className="relative overflow-hidden bg-ink text-cream">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <svg className="h-full w-full opacity-[0.18]" viewBox="0 0 1000 700" fill="none">
          <motion.circle
            cx="220"
            cy="180"
            r="120"
            stroke="#C4A574"
            strokeOpacity="0.35"
            strokeDasharray="4 8"
            animate={{ rotate: 360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "220px 180px" }}
          />
          <motion.circle
            cx="720"
            cy="420"
            r="180"
            stroke="#8C3045"
            strokeOpacity="0.4"
            strokeDasharray="2 10"
            animate={{ rotate: -360 }}
            transition={{ duration: 110, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "720px 420px" }}
          />
          <path
            d="M120 360 C 260 240, 380 480, 520 340 S 780 220, 920 360"
            stroke="#F6F1E8"
            strokeOpacity="0.15"
          />
          <circle cx="260" cy="300" r="4" fill="#C4A574" fillOpacity="0.7" />
          <circle cx="520" cy="340" r="4" fill="#8C3045" fillOpacity="0.8" />
          <circle cx="780" cy="280" r="4" fill="#F6F1E8" fillOpacity="0.5" />
        </svg>
      </div>

      <div className="container-shell section-pad relative z-10">
        <div className="max-w-3xl">
          <Reveal>
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-gold">
              Προετοιμασία εξετάσεων
            </p>
          </Reveal>
          <TextReveal
            text="Προετοιμασία για εκεί που θέλεις να φτάσεις."
            className="font-display mt-5 text-[clamp(2.2rem,5vw,4rem)] leading-[1.05]"
          />
          <Reveal delay={0.15} className="mt-6 max-w-xl">
            <p className="text-base leading-relaxed text-cream/60 md:text-lg">
              Εξειδικευμένη προετοιμασία εξετάσεων και πιστοποιήσεων για:
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {countries.map((country, i) => (
            <motion.article
              key={country.name}
              className="group relative overflow-hidden border border-cream/10 bg-charcoal-soft p-6"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              whileHover={{ y: -6 }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${country.accent} opacity-80 transition duration-500 group-hover:opacity-100`}
              />
              <div className="relative">
                <p className="text-[0.68rem] tracking-[0.28em] text-gold/80">
                  {country.mark}
                </p>
                <p className="font-display mt-8 text-3xl">{country.name}</p>
                <div className="mt-10 h-px w-10 bg-gold/50 transition duration-500 group-hover:w-16" />
              </div>
            </motion.article>
          ))}
        </div>

        <Reveal className="mt-12" delay={0.1}>
          <p className="text-xs uppercase tracking-[0.24em] text-cream/45">Εξετάσεις</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {exams.map((exam, i) => (
              <motion.span
                key={exam}
                className="border border-cream/15 bg-cream/[0.04] px-5 py-3 text-sm tracking-[0.14em] text-cream/85 backdrop-blur-sm"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * i }}
                whileHover={{
                  borderColor: "rgba(196,165,116,0.5)",
                  color: "#d8c09a",
                }}
              >
                {exam}
              </motion.span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
