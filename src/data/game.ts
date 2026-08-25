export type QuizQuestion = {
  word: string;
  lang: "de" | "en";
  options: [string, string, string];
  answer: string;
};

export const miniGameQuestions: QuizQuestion[] = [
  {
    word: "HUND",
    lang: "de",
    options: ["Σκύλος", "Γάτα", "Άλογο"],
    answer: "Σκύλος",
  },
  {
    word: "KATZE",
    lang: "de",
    options: ["Πουλί", "Γάτα", "Ψάρι"],
    answer: "Γάτα",
  },
  {
    word: "APPLE",
    lang: "en",
    options: ["Μήλο", "Πορτοκάλι", "Ψωμί"],
    answer: "Μήλο",
  },
  {
    word: "SCHULE",
    lang: "de",
    options: ["Σπίτι", "Σχολείο", "Πάρκο"],
    answer: "Σχολείο",
  },
  {
    word: "FRIEND",
    lang: "en",
    options: ["Φίλος", "Δάσκαλος", "Γιατρός"],
    answer: "Φίλος",
  },
  {
    word: "WASSER",
    lang: "de",
    options: ["Νερό", "Φωτιά", "Αέρας"],
    answer: "Νερό",
  },
  {
    word: "BOOK",
    lang: "en",
    options: ["Μολύβι", "Βιβλίο", "Τραπέζι"],
    answer: "Βιβλίο",
  },
  {
    word: "SONNE",
    lang: "de",
    options: ["Σελήνη", "Ήλιος", "Αστέρι"],
    answer: "Ήλιος",
  },
];

export function pickRandomQuestion(exclude?: string): QuizQuestion {
  const pool = exclude
    ? miniGameQuestions.filter((q) => q.word !== exclude)
    : miniGameQuestions;
  return pool[Math.floor(Math.random() * pool.length)] ?? miniGameQuestions[0];
}
