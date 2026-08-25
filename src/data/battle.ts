export type BattleSide = "german" | "english";

export type BattleRound = {
  id: string;
  title: string;
  prompt: string;
  german: {
    label: string;
    detail?: string;
  };
  english: {
    label: string;
    detail?: string;
  };
  explanations: {
    german: string;
    english: string;
  };
};

export const battleRounds: BattleRound[] = [
  {
    id: "round-1",
    title: "ROUND 1",
    prompt: "Ποια λέξη σου φαίνεται πιο τρομακτική;",
    german: { label: "SCHMETTERLING" },
    english: { label: "THOUGHT" },
    explanations: {
      german:
        "German takes this round. 🇩🇪 Το “Schmetterling” έχει 13 γράμματα. Αλλά τουλάχιστον είναι μια πεταλούδα. 🦋",
      english:
        "English takes this round. 🇬🇧 Το “thought” φαίνεται μικρό… μέχρι να το προφέρεις σωστά. 😅",
    },
  },
  {
    id: "round-2",
    title: "ROUND 2",
    prompt: "Ποιο ακούγεται πιο δύσκολο;",
    german: { label: "CH", detail: "στα Γερμανικά" },
    english: { label: "TH", detail: "στα Αγγλικά" },
    explanations: {
      german:
        "German takes this round. 🇩🇪 Το “ch” μπορεί να σε κάνει να ακούγεσαι σαν δράκος. Με καλό τρόπο.",
      english:
        "English takes this round. 🇬🇧 Το “th” είναι η στιγμή που πολλοί λένε “tank you”.",
    },
  },
  {
    id: "round-3",
    title: "ROUND 3",
    prompt: "Ποιο θα προτιμούσες να μάθεις;",
    german: { label: "der / die / das" },
    english: { label: "irregular verbs" },
    explanations: {
      german:
        "German takes this round. 🇩🇪 Τα άρθρα είναι σαν μίνι puzzle κάθε μέρα. Καλή τύχη με το Mädchen.",
      english:
        "English takes this round. 🇬🇧 Go, went, gone… και άλλα 49 για το κέφι σου.",
    },
  },
];
