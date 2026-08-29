"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, DropWords } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { unlockAchievement } from "@/data/achievements";
import { scrollToId } from "@/lib/utils";

const countries = [
  { flag: "🇬🇷", name: "Ελλάδα" },
  { flag: "🇩🇪", name: "Γερμανία" },
  { flag: "🇦🇹", name: "Αυστρία" },
  { flag: "🇨🇭", name: "Ελβετία" },
];

const exams = [
  { name: "Goethe", tip: "Boss fight με γερμανική κομψότητα.", emoji: "🎓" },
  { name: "ÖSD", tip: "Level up για Αυστρία & όχι μόνο.", emoji: "🎓" },
  { name: "TELC", tip: "Mission: επικοινωνία χωρίς πανικό.", emoji: "🎓" },
  { name: "ΚΠΓ", tip: "Ελληνική αποστολή, διεθνές στόχοι.", emoji: "🎓" },
  { name: "DaF", tip: "Για όταν θες academic mode.", emoji: "🎓" },
];

export function ExamPrep() {
  const [activeMission, setActiveMission] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  const startMission = (name: string) => {
    setActiveMission(name);
    setStarted(true);
    unlockAchievement("exam-hunter");
  };

  return (
    <section id="exams" className="relative overflow-hidden bg-navy text-cream">
      <div className="container-shell section-pad">
        <Reveal>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-coral">
            Exam Missions
          </p>
        </Reveal>
        <h2 className="section-title font-display">
          <DropWords text="Οι εξετάσεις." />{" "}
          <span className="text-yellow">🎯</span>
        </h2>
        <Reveal delay={0.1}>
          <p className="mt-3 text-cream/70 sm:mt-4">
            Ελλάδα. Γερμανία. Αυστρία. Ελβετία. Εσύ διαλέγεις την αποστολή.
          </p>
        </Reveal>

        <div className="mt-4 flex flex-wrap gap-2">
          {countries.map((c) => (
            <span
              key={c.name}
              className="rounded-full border-2 border-cream/30 bg-cream/10 px-3 py-1 text-sm font-bold"
            >
              {c.flag} {c.name}
            </span>
          ))}
        </div>

        <div className="section-stack grid gap-4 sm:grid-cols-2 md:grid-cols-5 md:gap-3">
          {exams.map((exam, i) => (
            <motion.article
              key={exam.name}
              className="group rounded-3xl border-[3px] border-ink bg-cream p-5 text-ink shadow-[6px_6px_0_#3d8bff] transition hover:-translate-y-1 hover:shadow-[8px_8px_0_#ffe14a] lg:p-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-muted">
                Mission {i + 1}
              </p>
              <h3 className="font-display mt-2 text-3xl lg:text-2xl">
                {exam.emoji} {exam.name}
              </h3>
              <p className="mt-2 text-sm text-ink/70">{exam.tip}</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink/10">
                <motion.div
                  className="h-full rounded-full bg-coral"
                  initial={{ width: "18%" }}
                  whileHover={{ width: "88%" }}
                  whileInView={{ width: `${35 + i * 10}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <button
                type="button"
                onClick={() => startMission(exam.name)}
                className="focus-ring mt-4 w-full rounded-xl border-2 border-ink bg-yellow px-3 py-2 text-sm font-extrabold transition hover:bg-coral hover:text-paper"
              >
                Mission Start →
              </button>
            </motion.article>
          ))}
        </div>

        <AnimatePresence>
          {started && activeMission ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 rounded-2xl border-[3px] border-yellow bg-cream/10 p-5 text-center"
            >
              <p className="font-display text-2xl text-yellow">
                🚀 {activeMission} Mission activated!
              </p>
              <p className="mt-2 text-cream/80">
                Η Βιργινία θα σε καθοδηγήσει στην προετοιμασία. Κλείσε την πρώτη συνάντηση για να ξεκινήσεις.
              </p>
              <Button
                variant="primary"
                className="mt-4"
                onClick={() => scrollToId("booking")}
              >
                Κλείσε την πρώτη σου συνάντηση →
              </Button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
