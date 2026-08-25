"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  BattleWinner,
  CEFRLevel,
  JourneyState,
  LanguageChoice,
  LearningGoal,
} from "@/lib/types";

type JourneyContextValue = JourneyState & {
  setGoal: (goal: LearningGoal) => void;
  setLanguage: (language: LanguageChoice) => void;
  setLevelResult: (level: CEFRLevel | "A1-A2", score: number) => void;
  setBattleResult: (result: BattleWinner) => void;
  resetJourney: () => void;
};

const initialState: JourneyState = {
  selectedGoal: null,
  selectedLanguage: null,
  estimatedLevel: null,
  testScore: null,
  battleResult: null,
};

const JourneyContext = createContext<JourneyContextValue | null>(null);

export function useJourney() {
  const ctx = useContext(JourneyContext);
  if (!ctx) {
    throw new Error("useJourney must be used within JourneyProvider");
  }
  return ctx;
}

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<JourneyState>(initialState);

  const setGoal = useCallback((goal: LearningGoal) => {
    setState((prev) => ({ ...prev, selectedGoal: goal }));
  }, []);

  const setLanguage = useCallback((language: LanguageChoice) => {
    setState((prev) => ({ ...prev, selectedLanguage: language }));
  }, []);

  const setLevelResult = useCallback(
    (level: CEFRLevel | "A1-A2", score: number) => {
      setState((prev) => ({
        ...prev,
        estimatedLevel: level,
        testScore: score,
      }));
    },
    [],
  );

  const setBattleResult = useCallback((result: BattleWinner) => {
    setState((prev) => ({ ...prev, battleResult: result }));
  }, []);

  const resetJourney = useCallback(() => setState(initialState), []);

  const value = useMemo(
    () => ({
      ...state,
      setGoal,
      setLanguage,
      setLevelResult,
      setBattleResult,
      resetJourney,
    }),
    [state, setGoal, setLanguage, setLevelResult, setBattleResult, resetJourney],
  );

  return (
    <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
  );
}
