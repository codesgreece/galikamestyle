"use client";

import { motion } from "framer-motion";
import { FIELD_WORDS, RING_RADIUS, type FieldWord } from "@/lib/portal";

export type FieldPhase = "multiply" | "vortex" | "hold" | "still" | "brand" | "enter";

const easePull = [0.45, 0.02, 0.18, 1] as const;
const easePop = [0.16, 1, 0.3, 1] as const;

function orbit(index: number, count: number, radius: number) {
  const angle = (index / count) * Math.PI * 2 - Math.PI / 2;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}

function WordGlyph({
  item,
  index,
  count,
  phase,
}: {
  item: FieldWord;
  index: number;
  count: number;
  phase: FieldPhase;
}) {
  const pos = orbit(index, count, RING_RADIUS[item.ring]);
  const far = item.ring === 2;
  const mid = item.ring === 1;

  const scatter = {
    x: `${item.x}vmin`,
    y: `${item.y}vmin`,
    scale: 1,
    rotate: item.r,
    opacity: far ? 0.42 : mid ? 0.78 : 1,
  };

  const pulled = {
    x: `${pos.x}vmin`,
    y: `${pos.y}vmin`,
    scale: far ? 0.38 : mid ? 0.58 : 0.9,
    rotate: item.r + (far ? -70 : mid ? 110 : 28),
    opacity: far ? 0.34 : mid ? 0.72 : 0.96,
  };

  const rushing = {
    x: `${pos.x * 4.2}vmin`,
    y: `${pos.y * 4.2}vmin`,
    scale: 0.12,
    rotate: item.r + 260,
    opacity: 0,
  };

  return (
    <motion.span
      className="absolute left-0 top-0 will-change-transform"
      initial={{
        x: `${item.x * 0.28}vmin`,
        y: `${item.y * 0.28}vmin`,
        opacity: 0,
        scale: 0.42,
        rotate: item.r,
      }}
      animate={phase === "multiply" ? scatter : phase === "enter" ? rushing : pulled}
      transition={
        phase === "multiply"
          ? { duration: 0.4, delay: index * 0.014, ease: easePop }
          : phase === "enter"
            ? { duration: 0.42, delay: index * 0.006, ease: [0.4, 0, 0.2, 1] }
            : { duration: 0.7, delay: index * 0.005, ease: easePull }
      }
    >
      <span
        className="block whitespace-nowrap font-display font-bold uppercase"
        style={{
          color: item.c,
          fontSize: `clamp(0.65rem, ${item.s}vmin, 4.6rem)`,
          transform: "translate(-50%, -50%)",
          filter: far ? "blur(1.5px)" : mid ? "blur(0.35px)" : "none",
        }}
      >
        {item.text}
      </span>
    </motion.span>
  );
}

export function VortexField({ phase }: { phase: FieldPhase }) {
  const rings: FieldWord[][] = [[], [], []];
  FIELD_WORDS.forEach((w) => rings[w.ring].push(w));

  const spinning = phase !== "multiply";
  const spinMod =
    phase === "enter"
      ? "portal-spin-fast"
      : phase === "still" || phase === "brand"
        ? "portal-spin-paused"
        : "";
  const speeds = ["portal-spin-a", "portal-spin-b", "portal-spin-c"];

  return (
    <div
      className="absolute left-1/2 top-1/2 z-[1]"
      style={{ perspective: "1100px", perspectiveOrigin: "50% 50%" }}
    >
      <motion.div
        style={{ transformStyle: "preserve-3d" }}
        initial={false}
        animate={
          phase === "multiply"
            ? { rotateX: 10, scale: 1 }
            : phase === "enter"
              ? { rotateX: 16, scale: 2.6 }
              : { rotateX: 58, scale: 1.04 }
        }
        transition={{ duration: phase === "enter" ? 0.42 : 0.7, ease: [0.4, 0, 0.2, 1] }}
      >
        {rings.map((ring, r) => (
          <div
            key={r}
            className={spinning ? `${speeds[r]} ${spinMod}` : ""}
            style={{
              width: 0,
              height: 0,
              transformStyle: "preserve-3d",
              transform: spinning ? undefined : `translateZ(${[-28, -72, -120][r]}px)`,
            }}
          >
            {ring.map((item, i) => (
              <WordGlyph
                key={`${item.text}-${r}-${i}`}
                item={item}
                index={i}
                count={ring.length}
                phase={phase}
              />
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
