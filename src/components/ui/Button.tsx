"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import type { MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "yellow" | "coral" | "ghost";

const styles: Record<Variant, string> = {
  primary:
    "bg-coral text-paper border-ink hover:bg-coral-hot",
  secondary:
    "bg-blue text-paper border-ink hover:bg-blue-bright",
  yellow:
    "bg-yellow text-ink border-ink hover:bg-yellow-hot",
  coral:
    "bg-coral text-paper border-ink",
  ghost:
    "bg-paper text-ink border-ink hover:bg-cream-deep",
};

export function Button({
  children,
  onClick,
  href,
  variant = "primary",
  className,
  type = "button",
  magnetic = true,
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
  magnetic?: boolean;
  ariaLabel?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18 });
  const sy = useSpring(y, { stiffness: 260, damping: 18 });

  const onMove = (e: MouseEvent<HTMLElement>) => {
    if (!magnetic) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.15);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.15);
  };

  const classes = cn(
    "focus-ring inline-flex items-center justify-center gap-2 border-[3px] px-5 py-3 text-sm font-extrabold uppercase tracking-[0.04em] shadow-[5px_5px_0_#1a1433] transition hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0_#1a1433] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[3px_3px_0_#1a1433]",
    styles[variant],
    className,
  );

  if (href) {
    return (
      <motion.a
        href={href}
        aria-label={ariaLabel}
        className={classes}
        style={magnetic ? { x: sx, y: sy } : undefined}
        onMouseMove={onMove}
        onMouseLeave={() => {
          x.set(0);
          y.set(0);
        }}
        onClick={onClick}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      aria-label={ariaLabel}
      className={classes}
      style={magnetic ? { x: sx, y: sy } : undefined}
      onMouseMove={onMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
