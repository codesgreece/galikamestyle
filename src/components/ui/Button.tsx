"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import type { ReactNode, MouseEvent } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "light";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  className?: string;
  type?: "button" | "submit";
  magnetic?: boolean;
  ariaLabel?: string;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-wine text-cream hover:bg-wine-bright border border-transparent shadow-[0_12px_40px_rgba(110,36,53,0.35)]",
  secondary:
    "bg-transparent text-cream border border-cream/25 hover:border-gold/60 hover:text-gold-soft",
  ghost:
    "bg-transparent text-ink border border-ink/15 hover:border-wine hover:text-wine",
  light:
    "bg-cream text-ink hover:bg-paper border border-transparent shadow-[0_12px_36px_rgba(0,0,0,0.18)]",
};

export function Button({
  children,
  href,
  onClick,
  variant = "primary",
  className,
  type = "button",
  magnetic = false,
  ariaLabel,
}: ButtonProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: MouseEvent<HTMLElement>) => {
    if (!magnetic) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * 0.18);
    y.set(dy * 0.18);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const classes = cn(
    "focus-ring inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm tracking-[0.04em] uppercase transition-colors duration-300",
    variants[variant],
    className,
  );

  if (href) {
    return (
      <motion.a
        href={href}
        aria-label={ariaLabel}
        className={classes}
        style={magnetic ? { x: springX, y: springY } : undefined}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
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
      style={magnetic ? { x: springX, y: springY } : undefined}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
