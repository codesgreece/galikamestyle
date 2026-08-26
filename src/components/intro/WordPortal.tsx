"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { OpeningWord } from "@/components/intro/OpeningWord";
import { VortexField, type FieldPhase } from "@/components/intro/VortexField";
import {
  OPENING_WORDS,
  PORTAL_SESSION_KEY,
  TIMING,
  openingTotalMs,
} from "@/lib/portal";

type Mode = "boot" | "full" | "short" | "skip";
type Phase =
  | "idle"
  | "opening"
  | "multiply"
  | "vortex"
  | "hold"
  | "still"
  | "brand"
  | "enter"
  | "done";

const ease = [0.16, 1, 0.3, 1] as const;

export function WordPortal({
  onKind,
  onEnter,
  onComplete,
}: {
  onKind: (kind: "full" | "short" | "skip") => void;
  onEnter: () => void;
  onComplete: () => void;
}) {
  const [mode, setMode] = useState<Mode>("boot");
  const [phase, setPhase] = useState<Phase>("idle");
  const [wordIndex, setWordIndex] = useState(0);
  const [shortStep, setShortStep] = useState<"hallo" | "hello" | "brand">("hallo");
  const readyRef = useRef(false);
  const enteredRef = useRef(false);
  const completedRef = useRef(false);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 70, damping: 22, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 70, damping: 22, mass: 0.4 });

  const onKindRef = useRef(onKind);
  const onEnterRef = useRef(onEnter);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onKindRef.current = onKind;
    onEnterRef.current = onEnter;
    onCompleteRef.current = onComplete;
  }, [onKind, onEnter, onComplete]);

  const finishEnter = useCallback(() => {
    if (enteredRef.current) return;
    enteredRef.current = true;
    px.set(0);
    py.set(0);
    window.scrollTo(0, 0);
    onEnterRef.current();
  }, [px, py]);

  const finishAll = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    try {
      sessionStorage.setItem(PORTAL_SESSION_KEY, "1");
    } catch {
      /* private mode */
    }
    window.scrollTo(0, 0);
    onCompleteRef.current();
    setPhase("done");
  }, []);

  useEffect(() => {
    const onLoad = () => {
      readyRef.current = true;
    };
    if (document.readyState === "complete") readyRef.current = true;
    else window.addEventListener("load", onLoad);
    void document.fonts?.ready.then(() => {
      readyRef.current = true;
    });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      let reduce = false;
      try {
        reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      } catch {
        reduce = false;
      }
      let seen = false;
      try {
        seen = sessionStorage.getItem(PORTAL_SESSION_KEY) === "1";
      } catch {
        seen = false;
      }

      if (reduce) {
        setMode("skip");
        onKindRef.current("skip");
        return;
      }
      const next = seen ? "short" : "full";
      setMode(next);
      onKindRef.current(next);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (phase === "done" || mode === "skip") return;
    const prev = history.scrollRestoration;
    try {
      history.scrollRestoration = "manual";
    } catch {
      /* older browsers */
    }
    window.scrollTo(0, 0);
    root.classList.add("portal-lock");
    return () => {
      root.classList.remove("portal-lock");
      window.scrollTo(0, 0);
      try {
        history.scrollRestoration = prev;
      } catch {
        /* older browsers */
      }
    };
  }, [mode, phase]);

  useEffect(() => {
    if (mode !== "skip") return;
    finishEnter();
    const id = window.setTimeout(finishAll, 40);
    return () => window.clearTimeout(id);
  }, [mode, finishEnter, finishAll]);

  useEffect(() => {
    if (mode !== "short") return;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };
    later(() => {
      setPhase("opening");
      setShortStep("hallo");
    }, 0);
    later(() => setShortStep("hello"), TIMING.shortHalloMs);
    later(() => setShortStep("brand"), TIMING.shortHalloMs + TIMING.shortHelloMs);
    later(() => {
      setPhase("enter");
      finishEnter();
    }, TIMING.shortHalloMs + TIMING.shortHelloMs + TIMING.shortBrandMs);
    later(
      finishAll,
      TIMING.shortHalloMs +
        TIMING.shortHelloMs +
        TIMING.shortBrandMs +
        TIMING.shortEnterMs,
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [mode, finishEnter, finishAll]);

  useEffect(() => {
    if (mode !== "full") return;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };
    let cancelled = false;
    let holdPoll: number | undefined;

    later(() => {
      setPhase("opening");
      setWordIndex(0);
    }, 0);
    OPENING_WORDS.forEach((_, i) => {
      if (i === 0) return;
      later(() => setWordIndex(i), i * TIMING.wordMs);
    });

    const afterOpen = openingTotalMs();
    later(() => setPhase("multiply"), afterOpen);
    later(() => setPhase("vortex"), afterOpen + TIMING.multiplyMs);

    later(() => {
      const continueToStill = () => {
        if (cancelled) return;
        setPhase("still");
        later(() => setPhase("brand"), TIMING.stillMs);
        later(() => {
          setPhase("enter");
          finishEnter();
        }, TIMING.stillMs + TIMING.brandMs);
        later(finishAll, TIMING.stillMs + TIMING.brandMs + TIMING.enterMs);
      };

      if (readyRef.current) {
        continueToStill();
        return;
      }
      setPhase("hold");
      const holdStart = performance.now();
      holdPoll = window.setInterval(() => {
        const waited = performance.now() - holdStart;
        if (!readyRef.current && waited < TIMING.holdCapMs) return;
        if (holdPoll) window.clearInterval(holdPoll);
        continueToStill();
      }, 80);
    }, afterOpen + TIMING.multiplyMs + TIMING.vortexMs);

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
      if (holdPoll) window.clearInterval(holdPoll);
    };
  }, [mode, finishEnter, finishAll]);

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (phase === "enter" || phase === "still" || phase === "brand") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width - 0.5) * 16);
    py.set(((e.clientY - r.top) / r.height - 0.5) * 10);
  };

  const showField =
    phase === "multiply" ||
    phase === "vortex" ||
    phase === "hold" ||
    phase === "still" ||
    phase === "brand" ||
    phase === "enter";

  const fieldPhase: FieldPhase =
    phase === "multiply"
      ? "multiply"
      : phase === "hold"
        ? "hold"
        : phase === "still"
          ? "still"
          : phase === "brand"
            ? "brand"
            : phase === "enter"
              ? "enter"
              : "vortex";

  const showBrand =
    phase === "brand" ||
    phase === "enter" ||
    (mode === "short" && shortStep === "brand");

  if (mode === "skip" || phase === "done") return null;

  const current = OPENING_WORDS[wordIndex];

  return (
    <>
      <noscript>
        <style>{`.word-portal{display:none!important}`}</style>
      </noscript>
      <motion.div
        className="word-portal fixed inset-0 z-[90] origin-center overflow-hidden bg-navy text-cream"
        aria-hidden
        onPointerMove={onPointerMove}
        initial={{ opacity: 1, scale: 1 }}
        animate={
          phase === "enter"
            ? { opacity: 0, scale: 3.6 }
            : { opacity: 1, scale: 1 }
        }
        transition={
          phase === "enter"
            ? { duration: TIMING.enterMs / 1000, ease: [0.4, 0, 0.2, 1] }
            : { duration: 0.18 }
        }
        style={{
          touchAction: "none",
          transformOrigin: "50% 50%",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,93,122,0.32),transparent_42%),radial-gradient(circle_at_82%_12%,rgba(61,139,255,0.28),transparent_38%),radial-gradient(circle_at_70%_82%,rgba(255,225,74,0.2),transparent_42%)]" />

        <motion.div
          className="absolute inset-0"
          style={{ x: sx, y: sy, transformStyle: "preserve-3d" }}
        >
          {showField ? <VortexField phase={fieldPhase} /> : null}

          {mode === "full" && phase === "opening" && current ? (
            <AnimatePresence mode="sync">
              <OpeningWord
                key={current.text}
                text={current.text}
                personality={current.personality}
                color={current.color}
              />
            </AnimatePresence>
          ) : null}

          {mode === "short" && phase === "opening" ? (
            <AnimatePresence mode="sync">
              {shortStep === "hallo" ? (
                <OpeningWord
                  key="s-hallo"
                  text="HALLO"
                  personality="letters"
                  color="var(--yellow)"
                />
              ) : null}
              {shortStep === "hello" ? (
                <OpeningWord
                  key="s-hello"
                  text="HELLO"
                  personality="stretch"
                  color="var(--blue-bright)"
                />
              ) : null}
            </AnimatePresence>
          ) : null}

          <AnimatePresence>
            {showBrand ? <BrandMark key="brand" /> : null}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
}

function BrandMark() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.16 }}
    >
      <motion.p
        className="font-display text-[clamp(1.1rem,3.4vw,2rem)] font-bold tracking-[0.28em] text-cream/80"
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2, ease }}
      >
        ΓΕΡΜΑΝΙΚΑ
      </motion.p>
      <motion.p
        className="font-display mt-1 text-[clamp(0.85rem,2.2vw,1.25rem)] font-bold tracking-[0.42em] text-cream/45"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05, duration: 0.16 }}
      >
        ΜΕ
      </motion.p>
      <motion.p
        className="font-display mt-1 text-[clamp(3.6rem,16vw,10.5rem)] font-bold leading-[0.86] tracking-tight text-yellow"
        initial={{ scale: 0.38, opacity: 0, y: 26 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.07, duration: 0.34, ease: [0.16, 1.2, 0.3, 1] }}
      >
        ΣΤΥΛ
      </motion.p>
    </motion.div>
  );
}
