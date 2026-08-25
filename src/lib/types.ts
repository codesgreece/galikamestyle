export type LearningGoal = "travel" | "certificate" | "germany" | "curious";
export type LanguageChoice = "german" | "english";
export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1";
export type BattleWinner = "german" | "english" | "draw" | null;

export type ContactPreset = {
  interest: LanguageChoice;
  format: "private" | "group";
  goal?: LearningGoal;
  estimatedLevel?: CEFRLevel | "A1-A2";
  testScore?: number;
  battleResult?: BattleWinner;
};

export type JourneyState = {
  selectedGoal: LearningGoal | null;
  selectedLanguage: LanguageChoice | null;
  estimatedLevel: CEFRLevel | "A1-A2" | null;
  testScore: number | null;
  battleResult: BattleWinner;
};
