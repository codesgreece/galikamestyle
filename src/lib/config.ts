export const siteConfig = {
  name: "Γερμανικά με Στυλ",
  tagline: "Εδώ δεν θα βαρεθείς να μάθεις γλώσσες.",
  teacher: "Βιργινία Πανάκη",
  url: "https://galikamestyle.vercel.app",
  phone: {
    display: "698 820 9141",
    href: "tel:+306988209141",
  },
  whatsapp: {
    display: "+49 151 29829437",
    href: "https://wa.me/4915129829437",
  },
  viber: {
    display: "+49 151 29829437",
    href: "viber://chat?number=%2B4915129829437",
  },
  email: {
    display: "panakebirginia@gmail.com",
    href: "mailto:panakebirginia@gmail.com",
  },
  facebook: {
    label: "Γερμανικά με Στυλ",
    href: "https://www.facebook.com/",
  },
  pricing: {
    private: {
      offer: 90,
      regular: 100,
      hours: 8,
    },
    group: {
      offer: 45,
      regular: 50,
      hours: 8,
      size: "3 έως 4",
    },
  },
} as const;

export const navLinks = [
  { href: "#hero", label: "Αρχική" },
  { href: "#goal", label: "Στόχος" },
  { href: "#level-test", label: "Test" },
  { href: "#battle", label: "Battle" },
  { href: "#pricing", label: "Modes" },
  { href: "#contact", label: "Πάμε!" },
] as const;
