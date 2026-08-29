export type DailyChallenge = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

function hashDate(date: Date): number {
  const str = date.toISOString().slice(0, 10);
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

const CHALLENGES: DailyChallenge[] = [
  {
    id: "wunderbar",
    question: 'Was bedeutet "Wunderbar"?',
    options: ["Υπέροχο", "Γρήγορο", "Ακριβό"],
    correctIndex: 0,
    explanation: "Wunderbar = υπέροχο, θαυμάσιο. Classic German enthusiasm!",
  },
  {
    id: "danke",
    question: 'Τι σημαίνει "Danke"?',
    options: ["Γεια", "Ευχαριστώ", "Παρακαλώ"],
    correctIndex: 1,
    explanation: "Danke schön! One of the first words everyone learns.",
  },
  {
    id: "butterfly",
    question: 'What is a "butterfly" in German?',
    options: ["Vogel", "Schmetterling", "Biene"],
    correctIndex: 1,
    explanation: "Schmetterling — one of the most beautiful German words!",
  },
  {
    id: "hello-de",
    question: 'How do you say "Hello" in German?',
    options: ["Hallo", "Tschüss", "Bitte"],
    correctIndex: 0,
    explanation: "Hallo! Or Guten Tag for a more formal vibe.",
  },
  {
    id: "please-en",
    question: 'What does "Please" mean in Greek?',
    options: ["Ευχαριστώ", "Παρακαλώ", "Συγγνώμη"],
    correctIndex: 1,
    explanation: "Please = Παρακαλώ. Bitte in German!",
  },
  {
    id: "cat-de",
    question: 'Was ist "die Katze"?',
    options: ["Σκύλος", "Γάτα", "Πουλί"],
    correctIndex: 1,
    explanation: "Die Katze = η γάτα. All nouns are capitalized in German!",
  },
  {
    id: "good-morning",
    question: '"Guten Morgen" means...',
    options: ["Good night", "Good morning", "Good luck"],
    correctIndex: 1,
    explanation: "Start your day the German way!",
  },
];

export function getTodaysChallenge(date = new Date()): DailyChallenge {
  const index = hashDate(date) % CHALLENGES.length;
  return CHALLENGES[index];
}
