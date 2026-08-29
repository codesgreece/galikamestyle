export type WordEntry = {
  word: string;
  translation: string;
  language: "german" | "english";
  funFact: string;
  pronunciation?: string;
};

export const RANDOM_WORDS: WordEntry[] = [
  {
    word: "Wunderbar",
    translation: "Υπέροχο",
    language: "german",
    funFact: "Χρησιμοποιείται και στα ελληνικά — «βούντερbar»!",
    pronunciation: "ˈvʊndɐbaːɐ̯",
  },
  {
    word: "Schmetterling",
    translation: "Πεταλούδα",
    language: "german",
    funFact: "Μία από τις πιο όμορφες γερμανικές λέξεις.",
    pronunciation: "ˈʃmɛtɐlɪŋ",
  },
  {
    word: "Gemütlichkeit",
    translation: "Ζεστασιά / coziness",
    language: "german",
    funFact: "Δεν έχει ακριβή μετάφραση — είναι μια whole vibe.",
  },
  {
    word: "Fernweh",
    translation: "Λαχτάρα για ταξίδι",
    language: "german",
    funFact: "Το αντίθετο του Heimweh (νοσταλγία για το σπίτι).",
  },
  {
    word: "Kummerspeck",
    translation: "Κιλά από stress-eating",
    language: "german",
    funFact: "Κυριολεκτικά: «λίπος λύπης» (Speck = bacon).",
  },
  {
    word: "Serendipity",
    translation: "Ευτυχής τυχαία ανακάλυψη",
    language: "english",
    funFact: "Μία από τις αγαπημένες λέξεις των native speakers.",
    pronunciation: "ˌserənˈdɪpəti",
  },
  {
    word: "Petrichor",
    translation: "Μυρωδιά βροχής στο χώμα",
    language: "english",
    funFact: "Από τα ελληνικά πέτρα + ιχώρ (αιμώδης χυμός).",
    pronunciation: "ˈpetrɪkɔː",
  },
  {
    word: "Ephemeral",
    translation: "Εφήμερο",
    language: "english",
    funFact: "Perfect for describing summer vibes.",
  },
  {
    word: "Hallo",
    translation: "Γεια",
    language: "german",
    funFact: "Η πρώτη λέξη που μαθαίνουν όλοι!",
    pronunciation: "ˈhaloː",
  },
  {
    word: "Zeitgeist",
    translation: "Πνεύμα της εποχής",
    language: "german",
    funFact: "Γερμανική λέξη που χρησιμοποιείται παγκοσμίως.",
    pronunciation: "ˈtsaɪtɡaɪst",
  },
  {
    word: "Whimsical",
    translation: "Παιχνιδιάρικο",
    language: "english",
    funFact: "Describes this website pretty well.",
  },
  {
    word: "Backpfeifengesicht",
    translation: "Πρόσωπο που θες να σου δώσεις μια",
    language: "german",
    funFact: "Classic German compound word energy.",
  },
];

export function getRandomWord(): WordEntry {
  return RANDOM_WORDS[Math.floor(Math.random() * RANDOM_WORDS.length)];
}
