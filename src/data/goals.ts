import type { LearningGoal } from "@/lib/types";

export type GoalOption = {
  id: LearningGoal;
  emoji: string;
  title: string;
  microcopy: string;
  accent: string;
  messageTitle: string;
  messageBody: string;
  nextHint: string;
};

export const goalOptions: GoalOption[] = [
  {
    id: "travel",
    emoji: "✈️",
    title: "Θέλω να ταξιδέψω",
    microcopy: "Να μπορείς να παραγγείλεις χωρίς παντομίμα. Χρήσιμο πράγμα.",
    accent: "bg-blue text-paper",
    messageTitle: "Passport mode: ON. ✈️",
    messageBody:
      "Τέλεια. Θα χτίσουμε τις λέξεις και τις φράσεις που χρειάζεσαι για πραγματικές στιγμές στο ταξίδι.",
    nextHint: "Ας δούμε πρώτα από ποιο επίπεδο ξεκινάς.",
  },
  {
    id: "certificate",
    emoji: "🎓",
    title: "Θέλω πτυχίο",
    microcopy: "Goethe, ÖSD, TELC, ΚΠΓ και άλλες αποστολές.",
    accent: "bg-yellow text-ink",
    messageTitle: "Mission accepted. 🎯",
    messageBody:
      "Τότε μάλλον θα σε ενδιαφέρει η προετοιμασία για εξετάσεις. Πάμε να δούμε τι χρειάζεσαι.",
    nextHint: "Συνέχισε με το γρήγορο level test.",
  },
  {
    id: "germany",
    emoji: "🇩🇪",
    title: "Θέλω να πάω Γερμανία",
    microcopy: "Νέα χώρα. Νέα αρχή. Η γλώσσα είναι το πρώτο σου βήμα.",
    accent: "bg-coral text-paper",
    messageTitle: "Willkommen, σχεδόν. 🇩🇪",
    messageBody:
      "Νέα αρχή θέλει στέρεη γλώσσα. Θα σε προετοιμάσουμε για καθημερινότητα, σχολείο και πραγματική επικοινωνία.",
    nextHint: "Ας βρούμε το επίπεδό σου πριν κάνουμε το πρώτο βήμα.",
  },
  {
    id: "curious",
    emoji: "🧠",
    title: "Θέλω απλά να μάθω",
    microcopy: "Δεν χρειάζεται πάντα να υπάρχει λόγος. Η γνώση αρκεί.",
    accent: "bg-green text-ink",
    messageTitle: "Curiosity unlocked. 🧠",
    messageBody:
      "Το καλύτερο κίνητρο. Θα κρατήσουμε τη μάθηση fun, σταθερή και με πραγματική πρόοδο.",
    nextHint: "Πάμε να δούμε από πού ξεκινάς.",
  },
];

export const goalLabels: Record<LearningGoal, string> = {
  travel: "✈️ Ταξίδι",
  certificate: "🎓 Πτυχίο",
  germany: "🇩🇪 Γερμανία",
  curious: "🧠 Απλά να μάθω",
};
