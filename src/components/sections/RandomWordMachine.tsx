"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, DropWords } from "@/components/ui/Reveal";
import { getRandomWord, type WordEntry } from "@/data/words";
import { unlockAchievement, loadAchievements } from "@/data/achievements";

export function RandomWordMachine() {
  const [word, setWord] = useState<WordEntry | null>(null);
  const [count, setCount] = useState(0);
  const [speaking, setSpeaking] = useState(false);

  const roll = () => {
    setWord(getRandomWord());
    const next = count + 1;
    setCount(next);
    if (next >= 5 && !loadAchievements().includes("word-collector")) {
      unlockAchievement("word-collector");
    }
  };

  const speak = () => {
    if (!word || typeof window === "undefined" || !window.speechSynthesis) return;
    setSpeaking(true);
    const utter = new SpeechSynthesisUtterance(word.word);
    utter.lang = word.language === "german" ? "de-DE" : "en-US";
    utter.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  return (
    <section id="word-machine" className="relative bg-cream-deep">
      <div className="container-shell section-pad">
        <Reveal>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-lilac">
            Random Word Machine
          </p>
        </Reveal>
        <h2 className="section-title font-display">
          <DropWords text="🎲 GIVE ME A WORD" />
        </h2>

        <div className="section-stack mx-auto max-w-lg text-center">
          <button
            type="button"
            onClick={roll}
            className="focus-ring mx-auto rounded-full border-[4px] border-ink bg-yellow px-8 py-4 font-display text-xl shadow-[6px_6px_0_#1a1433] transition hover:-translate-y-1 hover:shadow-[8px_8px_0_#ff6b5a] active:translate-y-0"
          >
            🎲 GIVE ME A WORD
          </button>

          <AnimatePresence mode="wait">
            {word ? (
              <motion.div
                key={word.word}
                initial={{ opacity: 0, rotate: -3, scale: 0.9 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-[1.5rem] border-[3px] border-ink bg-paper p-6 shadow-[6px_6px_0_#1a1433]"
              >
                <p className="font-display text-4xl md:text-5xl">{word.word}</p>
                <p className="mt-2 text-lg font-bold text-blue">{word.translation}</p>
                <p className="mt-3 text-sm text-ink/70">{word.funFact}</p>
                {typeof window !== "undefined" && window.speechSynthesis ? (
                  <button
                    type="button"
                    onClick={speak}
                    disabled={speaking}
                    className="focus-ring mt-4 rounded-full border-2 border-ink bg-cream px-4 py-2 text-sm font-bold"
                    aria-label="Ακούστε την προφορά"
                  >
                    🔊 {speaking ? "..." : "Προφορά"}
                  </button>
                ) : null}
              </motion.div>
            ) : (
              <motion.p
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-muted"
              >
                Πάτα το κουμπί για μια τυχαία λέξη!
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
