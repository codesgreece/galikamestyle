export const siteConfig = {
  name: "Γερμανικά με Στυλ",
  tagline: "Μάθε Γερμανικά και Αγγλικά με αυτοπεποίθηση.",
  teacher: "Βιργινία Πανάκη",
  url: "https://germanikamesstyl.gr",
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
    // Replace with the real Facebook page URL when ready
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
  { href: "#about", label: "Η Βιργινία" },
  { href: "#levels", label: "Μαθήματα" },
  { href: "#certificates", label: "Πιστοποιήσεις" },
  { href: "#pricing", label: "Τιμές" },
  { href: "#contact", label: "Επικοινωνία" },
] as const;
