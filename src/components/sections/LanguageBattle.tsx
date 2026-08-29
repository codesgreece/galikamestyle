"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Reveal, DropWords } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { useJourney } from "@/components/providers/JourneyProvider";
import { useContactModal } from "@/components/providers/ContactProvider";
import { battleRounds, type BattleSide } from "@/data/battle";
import { unlockAchievement } from "@/data/achievements";
import { cn } from "@/lib/utils";

export function LanguageBattle() {
  const reduce = useReducedMotion();
  const {
    setLanguage,
    setBattleResult,
    selectedGoal,
    estimatedLevel,
    testScore,
  } = useJourney();
  const { openContact } = useContactModal();

  const [roundIndex, setRoundIndex] = useState(0);
  const [germanScore, setGermanScore] = useState(0);
  const [englishScore, setEnglishScore] = useState(0);
  const [picked, setPicked] = useState<BattleSide | null>(null);
  const [finished, setFinished] = useState(false);
  const [finalWinner, setFinalWinner] = useState<"german" | "english" | "draw">(
    "draw",
  );

  const round = battleRounds[roundIndex];

  const choose = (side: BattleSide) => {
    if (picked || finished) return;
    setPicked(side);
    if (side === "german") setGermanScore((s) => s + 1);
    else setEnglishScore((s) => s + 1);
  };

  const goNextRound = () => {
    if (!picked) return;

    const nextGerman = germanScore;
    const nextEnglish = englishScore;

    if (roundIndex + 1 >= battleRounds.length) {
      const winner =
        nextGerman === nextEnglish
          ? "draw"
          : nextGerman > nextEnglish
            ? "german"
            : "english";
      setFinalWinner(winner);
      setBattleResult(winner);
      unlockAchievement("battle-veteran");
      setFinished(true);
      return;
    }

    setRoundIndex((i) => i + 1);
    setPicked(null);
  };

  const restart = () => {
    setRoundIndex(0);
    setGermanScore(0);
    setEnglishScore(0);
    setPicked(null);
    setFinished(false);
    setFinalWinner("draw");
    setBattleResult(null);
  };

  const openWithTeam = (team: "german" | "english") => {
    setLanguage(team);
    openContact({
      interest: team,
      goal: selectedGoal ?? undefined,
      estimatedLevel: estimatedLevel ?? undefined,
      testScore: testScore ?? undefined,
      battleResult: finalWinner,
    });
  };

  return (
    <section id="battle" className="relative overflow-hidden bg-cream-deep">
      <div className="container-shell section-pad">
        <Reveal>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue">
            Language battle
          </p>
        </Reveal>
        <h2 className="section-title font-display text-[clamp(1.85rem,6vw,3.2rem)] md:text-[1.75rem]">
          <span className="inline-flex flex-col items-start sm:flex-row sm:items-baseline">
            <span className="text-coral">GERMAN</span>
            <span className="mx-0 my-0.5 text-[0.55em] text-ink/30 sm:mx-2 sm:my-0 sm:text-[1em]">
              VS
            </span>
            <span className="text-blue">ENGLISH</span>
          </span>
        </h2>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 md:mt-2">
          <p className="max-w-xl text-sm text-ink/70 md:text-sm">
            <DropWords text="Ποια γλώσσα θα σου βάλει πιο δύσκολα;" />
          </p>
          <div className="flex items-center gap-2">
          <ScorePill side="GERMAN" score={germanScore} tone="bg-coral text-paper" />
          <span className="font-display text-sm text-ink/35">VS</span>
          <ScorePill side="ENGLISH" score={englishScore} tone="bg-blue text-paper" />
          </div>
        </div>

        <div className="section-stack mx-auto max-w-3xl">
          <AnimatePresence mode="wait">
            {!finished && round ? (
              <motion.div
                key={round.id}
                className="rounded-[1.5rem] border-[3px] border-ink bg-paper p-4 shadow-[6px_6px_0_#1a1433]"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-muted">
                  {round.title}
                </p>
                <p className="font-display mt-1.5 text-lg leading-snug md:text-xl">
                  {round.prompt}
                </p>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <BattleChoice
                    side="german"
                    label={round.german.label}
                    detail={round.german.detail}
                    active={picked === "german"}
                    disabled={Boolean(picked)}
                    onClick={() => choose("german")}
                  />
                  <BattleChoice
                    side="english"
                    label={round.english.label}
                    detail={round.english.detail}
                    active={picked === "english"}
                    disabled={Boolean(picked)}
                    onClick={() => choose("english")}
                  />
                </div>

                <AnimatePresence>
                  {picked ? (
                    <motion.div
                      className="mt-3 rounded-2xl border-2 border-ink bg-yellow/80 p-3"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p className="font-bold leading-relaxed">
                        {round.explanations[picked]}
                      </p>
                      <Button
                        className="mt-3"
                        variant="primary"
                        onClick={goNextRound}
                      >
                        {roundIndex + 1 >= battleRounds.length
                          ? "Δες τον νικητή →"
                          : "Next round →"}
                      </Button>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            ) : null}

            {finished ? (
              <motion.div
                key="finale"
                className="rounded-[1.75rem] border-[3px] border-ink bg-navy p-6 text-cream shadow-[8px_8px_0_#ffe14a] sm:p-8"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {finalWinner === "german" ? (
                  <>
                    <p className="font-display text-3xl sm:text-4xl">
                      🇩🇪 GERMAN WINS!
                    </p>
                    <p className="mt-3 text-cream/75">
                      Αλλά μην ενθουσιάζεσαι. Έχουμε ακόμα τα der, die και das.
                      😈
                    </p>
                  </>
                ) : null}
                {finalWinner === "english" ? (
                  <>
                    <p className="font-display text-3xl sm:text-4xl">
                      🇬🇧 ENGLISH WINS!
                    </p>
                    <p className="mt-3 text-cream/75">
                      Μέχρι να συναντήσεις 50 irregular verbs στη σειρά. Καλή
                      τύχη.
                    </p>
                  </>
                ) : null}
                {finalWinner === "draw" ? (
                  <>
                    <p className="font-display text-3xl sm:text-4xl">
                      🤝 IT’S A DRAW!
                    </p>
                    <p className="mt-3 text-cream/75">
                      Τελικά και οι δύο γλώσσες έχουν τα δικά τους κόλπα.
                    </p>
                  </>
                ) : null}

                <p className="mt-8 font-display text-2xl">
                  Εσύ με ποια ομάδα είσαι;
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Button variant="coral" onClick={() => openWithTeam("german")}>
                    Μάθε Γερμανικά →
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => openWithTeam("english")}
                  >
                    Μάθε Αγγλικά →
                  </Button>
                  <Button variant="yellow" onClick={restart}>
                    Rematch
                  </Button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function ScorePill({
  side,
  score,
  tone,
}: {
  side: string;
  score: number;
  tone: string;
}) {
  return (
    <div
      className={cn(
        "min-w-[5.5rem] rounded-xl border-[3px] border-ink px-3 py-1.5 text-center shadow-[3px_3px_0_#1a1433]",
        tone,
      )}
    >
      <p className="text-[0.65rem] font-extrabold tracking-[0.16em]">{side}</p>
      <p className="font-display mt-0.5 text-xl leading-none">{score}</p>
    </div>
  );
}

function BattleChoice({
  side,
  label,
  detail,
  active,
  disabled,
  onClick,
}: {
  side: BattleSide;
  label: string;
  detail?: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled && !active}
      aria-pressed={active}
      className={cn(
        "focus-ring rounded-2xl border-[3px] border-ink p-3 text-left transition",
        side === "german" ? "bg-coral/15" : "bg-blue/15",
        active &&
          (side === "german" ? "bg-coral text-paper" : "bg-blue text-paper"),
        disabled && !active && "opacity-45",
      )}
    >
      <p className="text-xs font-extrabold uppercase tracking-[0.16em]">
        {side === "german" ? "🇩🇪 German Team" : "🇬🇧 English Team"}
      </p>
      <p className="font-display mt-1 text-lg leading-tight md:text-xl">
        {label}
      </p>
      {detail ? <p className="mt-1 text-xs opacity-80">{detail}</p> : null}
    </button>
  );
}
