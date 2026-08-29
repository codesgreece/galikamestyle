export type PersonalityResult =
  | "explorer"
  | "grammar-master"
  | "speed-learner"
  | "team-player";

export type PersonalityQuestion = {
  question: string;
  options: Array<{
    label: string;
    scores: Partial<Record<PersonalityResult, number>>;
  }>;
};

export const PERSONALITY_QUESTIONS: PersonalityQuestion[] = [
  {
    question: "Πώς μαθαίνεις καλύτερα;",
    options: [
      { label: "Με games και challenges", scores: { explorer: 2, "speed-learner": 1 } },
      { label: "Με κανόνες και δομή", scores: { "grammar-master": 2 } },
      { label: "Γρήγορα, on-the-go", scores: { "speed-learner": 2 } },
      { label: "Με φίλους / ομάδα", scores: { "team-player": 2, explorer: 1 } },
    ],
  },
  {
    question: "Τι σου αρέσει περισσότερο;",
    options: [
      { label: "Νέες λέξεις κάθε μέρα", scores: { explorer: 2 } },
      { label: "Σωστή γραμματική", scores: { "grammar-master": 2 } },
      { label: "Γρήγορη πρόοδος", scores: { "speed-learner": 2 } },
      { label: "Group energy", scores: { "team-player": 2 } },
    ],
  },
  {
    question: "Πώς αντιδράς σε λάθος;",
    options: [
      { label: "Το κάνω game — next round!", scores: { explorer: 1, "speed-learner": 1 } },
      { label: "Θέλω να καταλάβω γιατί", scores: { "grammar-master": 2 } },
      { label: "Δεν πειράζει, συνεχίζω", scores: { "speed-learner": 2 } },
      { label: "Ρωτάω τους άλλους", scores: { "team-player": 2 } },
    ],
  },
];

export const PERSONALITY_RESULTS: Record<
  PersonalityResult,
  { title: string; emoji: string; description: string }
> = {
  explorer: {
    title: "Language Explorer",
    emoji: "🧭",
    description: "Λατρεύεις να ανακαλύπτεις — κάθε λέξη είναι adventure!",
  },
  "grammar-master": {
    title: "Grammar Master",
    emoji: "📐",
    description: "Θες δομή, κανόνες και σωστή χρήση. Precision is your style.",
  },
  "speed-learner": {
    title: "Speed Learner",
    emoji: "⚡",
    description: "Γρήγορος ρυθμός, άμεσα αποτελέσματα. Let's go!",
  },
  "team-player": {
    title: "Team Player",
    emoji: "👥",
    description: "Μαθαίνεις καλύτερα μαζί — η ομάδα σε ενεργοποιεί!",
  },
};

export function calculatePersonality(
  answers: number[],
): PersonalityResult {
  const scores: Record<PersonalityResult, number> = {
    explorer: 0,
    "grammar-master": 0,
    "speed-learner": 0,
    "team-player": 0,
  };

  answers.forEach((optionIndex, qIndex) => {
    const option = PERSONALITY_QUESTIONS[qIndex]?.options[optionIndex];
    if (!option) return;
    for (const [key, val] of Object.entries(option.scores)) {
      scores[key as PersonalityResult] += val ?? 0;
    }
  });

  return (Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    "explorer") as PersonalityResult;
}
