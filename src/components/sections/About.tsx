"use client";

import { motion } from "framer-motion";
import { Reveal, TextReveal } from "@/components/ui/Reveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { siteConfig } from "@/lib/config";

const stats = [
  {
    value: "2",
    label: "Γλώσσες",
    detail: "Γερμανικά & Αγγλικά",
  },
  {
    value: "A1→C1",
    label: "Επίπεδα",
    detail: "Διδασκαλία όλων των επιπέδων",
  },
  {
    value: "C2",
    label: "Πιστοποιήσεις",
    detail: "Υψηλό επίπεδο πιστοποιήσεων",
  },
  {
    value: "10+",
    label: "Ηλικία",
    detail: "Για παιδιά από 10 ετών και άνω",
  },
];

export function About() {
  return (
    <section id="about" className="relative bg-cream text-ink">
      <div className="container-shell section-pad">
        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <Reveal>
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-wine">
                Η Βιργινία
              </p>
            </Reveal>
            <TextReveal
              text="Η γλώσσα θέλει γνώση."
              className="font-display mt-5 text-[clamp(2.2rem,5vw,4rem)] leading-[1.05]"
            />
            <TextReveal
              text="Η διδασκαλία θέλει τρόπο."
              className="font-display mt-1 text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] text-wine"
              delay={0.15}
            />
            <Reveal delay={0.2} className="mt-8 max-w-xl">
              <p className="text-lg leading-relaxed text-ink/70">
                Καθηγήτρια Γερμανικών και Αγγλικών με εξειδίκευση στη διδασκαλία
                μαθητών από 10 ετών και άνω και στην προετοιμασία για
                αναγνωρισμένες εξετάσεις πιστοποίησης.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="relative">
              <div className="absolute -inset-3 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(110,36,53,0.12),transparent_55%)]" />
              <figure className="depth-card-light overflow-hidden">
                <div className="relative aspect-[4/5] bg-[linear-gradient(145deg,#1f1c19_0%,#3a242c_45%,#6e2435_100%)]">
                  <div className="absolute inset-0 opacity-40 mix-blend-soft-light bg-[radial-gradient(circle_at_70%_20%,rgba(196,165,116,0.45),transparent_40%)]" />
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                    <div className="glass-panel rounded-sm px-5 py-4">
                      <p className="text-[0.68rem] uppercase tracking-[0.24em] text-gold">
                        Portrait
                      </p>
                      <p className="font-display mt-2 text-3xl text-cream">
                        {siteConfig.teacher}
                      </p>
                      <p className="mt-1 text-sm text-cream/60">
                        Αντικατέστησε εύκολα αυτό το frame με τη φωτογραφία σου.
                      </p>
                    </div>
                  </div>
                  <div className="absolute right-5 top-5 h-16 w-16 border border-gold/40" />
                  <div className="absolute right-8 top-8 h-16 w-16 border border-cream/20" />
                </div>
              </figure>
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.article
              key={stat.label}
              className="depth-card-light p-6"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ delay: i * 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-display text-4xl text-wine md:text-5xl">
                <AnimatedCounter value={stat.value} />
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-ink/45">
                {stat.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{stat.detail}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
