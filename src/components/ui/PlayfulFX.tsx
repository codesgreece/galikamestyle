"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function ConfettiBurst({ show }: { show: boolean }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: 10 + ((i * 17) % 80),
        color: ["#ffe14a", "#ff5d7a", "#3d8bff", "#2fd67b", "#b48cff"][i % 5],
        delay: (i % 6) * 0.04,
        rot: (i % 5) * 40,
      })),
    [],
  );

  if (!show) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-4 h-2.5 w-2.5 rounded-sm"
          style={{ left: `${p.left}%`, background: p.color }}
          initial={{ opacity: 0, y: 0, rotate: 0 }}
          animate={{ opacity: [0, 1, 0], y: 90, rotate: p.rot + 180 }}
          transition={{ duration: 0.9, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export function ToastBubble({
  message,
  show,
}: {
  message: string;
  show: boolean;
}) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="speech-bubble absolute left-1/2 top-4 z-20 w-[min(90%,20rem)] -translate-x-1/2 px-4 py-3 text-center text-sm font-bold shadow-[4px_4px_0_#1a1433]"
          initial={{ opacity: 0, y: -12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8 }}
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function useTimedFlag(ms = 1800) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!on) return;
    const t = window.setTimeout(() => setOn(false), ms);
    return () => window.clearTimeout(t);
  }, [on, ms]);
  return [on, () => setOn(true), setOn] as const;
}
