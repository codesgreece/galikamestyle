"use client";

import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { ACHIEVEMENTS, loadAchievements } from "@/data/achievements";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  const interval = setInterval(onStoreChange, 2000);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    clearInterval(interval);
  };
}

function getSnapshot() {
  return loadAchievements().join(",");
}

function getServerSnapshot() {
  return "";
}

export function AchievementsPanel() {
  const unlockedKey = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const unlocked = unlockedKey ? unlockedKey.split(",").filter(Boolean) : [];

  if (unlocked.length === 0) return null;

  return (
    <section id="achievements" className="relative bg-cream py-8">
      <div className="container-shell">
        <Reveal>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-muted">
            Achievements
          </p>
          <h2 className="font-display text-2xl">🏆 Τα επιτεύγματά σου</h2>
        </Reveal>
        <div className="mt-4 flex flex-wrap gap-2">
          {ACHIEVEMENTS.filter((a) => unlocked.includes(a.id)).map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border-2 border-ink bg-yellow/40 px-3 py-2 text-sm font-bold"
              title={a.description}
            >
              {a.emoji} {a.title}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { unlockAchievement } from "@/data/achievements";
