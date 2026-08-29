export type Achievement = {
  id: string;
  emoji: string;
  title: string;
  description: string;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-hallo",
    emoji: "🏅",
    title: "First Hallo",
    description: "Επέλεξες γλώσσα για πρώτη φορά!",
  },
  {
    id: "language-explorer",
    emoji: "🔥",
    title: "Language Explorer",
    description: "Ολοκλήρωσες το language test!",
  },
  {
    id: "exam-hunter",
    emoji: "🎯",
    title: "Exam Hunter",
    description: "Ξεκίνησες exam mission!",
  },
  {
    id: "c1-territory",
    emoji: "🧠",
    title: "C1 Territory",
    description: "Έφτασες C1 στο test!",
  },
  {
    id: "battle-veteran",
    emoji: "⚔️",
    title: "Battle Veteran",
    description: "Ολοκλήρωσες German vs English battle!",
  },
  {
    id: "daily-champion",
    emoji: "☀️",
    title: "Daily Champion",
    description: "Σωστή απάντηση στο daily challenge!",
  },
  {
    id: "word-collector",
    emoji: "🎲",
    title: "Word Collector",
    description: "Έμαθες 5+ random words!",
  },
  {
    id: "personality-found",
    emoji: "✨",
    title: "Personality Found",
    description: "Ανακάλυψες τον μαθητή που είσαι!",
  },
  {
    id: "booking-ready",
    emoji: "📅",
    title: "Booking Ready",
    description: "Κλείσατε την πρώτη σου συνάντηση!",
  },
];

export const ACHIEVEMENTS_STORAGE_KEY = "gms_achievements";

export function loadAchievements(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function unlockAchievement(id: string): string[] {
  const current = loadAchievements();
  if (current.includes(id)) return current;
  const next = [...current, id];
  localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(next));
  return next;
}
