"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimatedCounterProps = {
  value: string;
  className?: string;
};

export function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const reduce = useReducedMotion();
  const numeric = Number(value.replace(/[^\d]/g, ""));
  const suffix = value.replace(/[\d]/g, "");
  const isNumeric = !Number.isNaN(numeric) && /\d/.test(value);

  useEffect(() => {
    if (!ref.current || !inView) return;
    if (!isNumeric || reduce) {
      ref.current.textContent = value;
      return;
    }

    const controls = animate(0, numeric, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        if (ref.current) {
          ref.current.textContent = `${Math.round(latest)}${suffix}`;
        }
      },
    });

    return () => controls.stop();
  }, [inView, isNumeric, numeric, reduce, suffix, value]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {reduce || !isNumeric ? value : "0"}
    </span>
  );
}
