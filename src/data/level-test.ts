import type { CEFRLevel, LanguageChoice } from "@/lib/types";

export type LevelQuestion = {
  id: string;
  level: CEFRLevel;
  prompt: string;
  options: string[];
  answer: string;
};

export type LevelBand = {
  id: CEFRLevel | "A1-A2";
  minCorrect: number;
  emoji: string;
  title: string;
  body: string;
  proposal: string;
};

export const germanLevelQuestions: LevelQuestion[] = [
  {
    id: "de-a1-1",
    level: "A1",
    prompt: "Was bedeutet „Hallo“?",
    options: ["Γεια σου", "Αντίο", "Ευχαριστώ", "Παρακαλώ"],
    answer: "Γεια σου",
  },
  {
    id: "de-a1-2",
    level: "A1",
    prompt: "Wie sagt man „ευχαριστώ“ auf Deutsch?",
    options: ["Bitte", "Danke", "Tschüss", "Guten Tag"],
    answer: "Danke",
  },
  {
    id: "de-a2-1",
    level: "A2",
    prompt: "Ich ___ aus Griechenland.",
    options: ["komme", "kommt", "kommen", "kommst"],
    answer: "komme",
  },
  {
    id: "de-a2-2",
    level: "A2",
    prompt: "Gestern ___ ich im Park.",
    options: ["war", "bin", "ist", "sei"],
    answer: "war",
  },
  {
    id: "de-b1-1",
    level: "B1",
    prompt: "Wenn ich mehr Zeit hätte, ___ ich öfter reisen.",
    options: ["würde", "werde", "bin", "hatte"],
    answer: "würde",
  },
  {
    id: "de-b1-2",
    level: "B1",
    prompt: "Welche Antwort passt? „Warum lernst du Deutsch?“",
    options: [
      "Weil ich in Deutschland studieren möchte.",
      "Weil ich möchte studieren in Deutschland.",
      "Weil ich studiere möchte Deutschland.",
      "Weil möchte ich studieren.",
    ],
    answer: "Weil ich in Deutschland studieren möchte.",
  },
  {
    id: "de-b2-1",
    level: "B2",
    prompt: "Welche Form ist korrekt?",
    options: [
      "Obwohl es regnete, gingen wir spazieren.",
      "Obwohl es regnete, wir gingen spazieren.",
      "Obwohl regnete es, gingen wir spazieren.",
      "Obwohl es regnete wir spazieren gingen.",
    ],
    answer: "Obwohl es regnete, gingen wir spazieren.",
  },
  {
    id: "de-c1-1",
    level: "C1",
    prompt:
      "Welche Formulierung klingt am natürlichsten? „Η απόφαση πάρθηκε χωρίς να μας ρωτήσουν.“",
    options: [
      "Die Entscheidung wurde getroffen, ohne uns zu fragen.",
      "Die Entscheidung hat getroffen, ohne uns fragen.",
      "Die Entscheidung wurde treffen, ohne uns zu fragen.",
      "Die Entscheidung war getroffen, ohne uns fragen zu.",
    ],
    answer: "Die Entscheidung wurde getroffen, ohne uns zu fragen.",
  },
];

export const englishLevelQuestions: LevelQuestion[] = [
  {
    id: "en-a1-1",
    level: "A1",
    prompt: "I ___ from Greece.",
    options: ["am", "is", "are", "be"],
    answer: "am",
  },
  {
    id: "en-a1-2",
    level: "A1",
    prompt: "How ___ you?",
    options: ["are", "is", "am", "be"],
    answer: "are",
  },
  {
    id: "en-a2-1",
    level: "A2",
    prompt: "Yesterday I ___ to school.",
    options: ["went", "go", "gone", "going"],
    answer: "went",
  },
  {
    id: "en-a2-2",
    level: "A2",
    prompt: "She ___ English every day.",
    options: ["studies", "study", "studied", "studying"],
    answer: "studies",
  },
  {
    id: "en-b1-1",
    level: "B1",
    prompt: "If I ___ more money, I would travel more.",
    options: ["had", "have", "will have", "having"],
    answer: "had",
  },
  {
    id: "en-b1-2",
    level: "B1",
    prompt: "I’ve been learning English ___ three years.",
    options: ["for", "since", "during", "from"],
    answer: "for",
  },
  {
    id: "en-b2-1",
    level: "B2",
    prompt: "By the time we arrived, the film ___.",
    options: [
      "had already started",
      "already starts",
      "has already started",
      "was already start",
    ],
    answer: "had already started",
  },
  {
    id: "en-c1-1",
    level: "C1",
    prompt:
      "Which option best completes the sentence? “She finally ___ her fear of speaking in public.”",
    options: ["overcame", "overcame with", "overcame against", "overcame from"],
    answer: "overcame",
  },
];

export const levelBands: LevelBand[] = [
  {
    id: "A1-A2",
    minCorrect: 0,
    emoji: "🌱",
    title: "Looks like you’re around A1–A2",
    body: "Κάθε μεγάλη διαδρομή ξεκινάει από μία λέξη.",
    proposal:
      "Ξεκίνα με γερές βάσεις και χτίσε την αυτοπεποίθησή σου βήμα-βήμα.",
  },
  {
    id: "B1",
    minCorrect: 4,
    emoji: "🚀",
    title: "You’re moving through B1",
    body: "Τώρα αρχίζουν τα ωραία.",
    proposal:
      "Μπορείς ήδη να επικοινωνήσεις. Τώρα πάμε να το κάνουμε πιο φυσικό και άνετο.",
  },
  {
    id: "B2",
    minCorrect: 6,
    emoji: "🔥",
    title: "B2 is calling",
    body: "Έχεις ήδη δυνατό επίπεδο.",
    proposal:
      "Ώρα να ανεβάσουμε την ακρίβεια, τη φυσικότητα και την αυτοπεποίθησή σου.",
  },
  {
    id: "C1",
    minCorrect: 7,
    emoji: "🧠",
    title: "C1 detected",
    body: "Εντάξει. Δεν ήρθες εδώ για τα βασικά.",
    proposal:
      "Πάμε για πραγματικά advanced χρήση της γλώσσας και υψηλού επιπέδου στόχους.",
  },
];

export function getQuestions(lang: LanguageChoice): LevelQuestion[] {
  return lang === "german" ? germanLevelQuestions : englishLevelQuestions;
}

export function resolveLevelBand(correct: number): LevelBand {
  if (correct >= 7) return levelBands[3];
  if (correct >= 6) return levelBands[2];
  if (correct >= 4) return levelBands[1];
  return levelBands[0];
}
