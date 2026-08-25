"use client";

import { motion } from "framer-motion";
import { Reveal, DropWords } from "@/components/ui/Reveal";

const exams = [
  { name: "TELC", tip: "Mission: επικοινωνία χωρίς πανικό." },
  { name: "Goethe", tip: "Boss fight με γερμανική κομψότητα." },
  { name: "ÖSD", tip: "Level up για Αυστρία & όχι μόνο." },
  { name: "ΚΠΓ", tip: "Ελληνική αποστολή, διεθνές στόχοι." },
  { name: "DaF", tip: "Για όταν θες academic mode." },
];

export function ExamPrep() {
  return (
    <section id="exams" className="relative overflow-hidden bg-navy text-cream">
      <div className="container-shell section-pad">
        <Reveal>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-coral">
            Boss level
          </p>
        </Reveal>
        <h2 className="font-display mt-4 text-[clamp(1.9rem,6.5vw,3.6rem)] leading-[1.18] sm:leading-[1.12]">
          <DropWords text="Οι εξετάσεις." />{" "}
          <span className="text-yellow">🎯</span>
        </h2>
        <Reveal delay={0.1}>
          <p className="mt-4 text-cream/70">
            Ελλάδα. Γερμανία. Αυστρία. Ελβετία. Εσύ διαλέγεις την αποστολή.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam, i) => (
            <motion.article
              key={exam.name}
              className="group rounded-3xl border-[3px] border-ink bg-cream p-6 text-ink shadow-[6px_6px_0_#3d8bff] transition hover:-translate-y-1 hover:shadow-[8px_8px_0_#ffe14a]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileTap={{ scale: 0.98 }}
            >
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-muted">
                Mission {i + 1}
              </p>
              <h3 className="font-display mt-3 text-3xl">🎓 {exam.name}</h3>
              <p className="mt-3 text-sm text-ink/70">{exam.tip}</p>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-ink/10">
                <motion.div
                  className="h-full rounded-full bg-coral"
                  initial={{ width: "18%" }}
                  whileHover={{ width: "88%" }}
                  whileInView={{ width: `${35 + i * 10}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
