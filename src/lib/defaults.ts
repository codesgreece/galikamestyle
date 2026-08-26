import type { Offer } from "@prisma/client";
import { siteConfig } from "@/lib/config";
import type { SiteContentKey } from "@/lib/content-keys";

export type PublicOffer = {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  currentPrice: number;
  billingPeriod: string;
  badgeText: string | null;
  accent: string;
  sortOrder: number;
};

export type SiteContentMap = Record<SiteContentKey, string>;

export const DEFAULT_CONTENT: SiteContentMap = {
  "hero.eyebrow": "Γερμανικά με Στυλ",
  "hero.title_line1": "Μάθε Γερμανικά.",
  "hero.title_line2": "Μάθε Αγγλικά.",
  "hero.title_line3_prefix": "Και κάν’ το με",
  "hero.subtitle":
    "Εδώ δεν θα βαρεθείς να μάθεις γλώσσες. Μαθήματα για παιδιά από 10+ και εφήβους — με πραγματική πρόοδο και λίγο χιούμορ.",
  "hero.cta_primary": "Πάμε να γνωριστούμε →",
  "hero.cta_secondary": "Ποιο είναι το δικό σου στυλ;",
  "contact.section_eyebrow": "Πάμε να γνωριστούμε",
  "contact.section_title": "Έτοιμος για το πρώτο σου “Hallo”;",
  "contact.section_subtitle": "Η Βιργινία είναι ένα μήνυμα μακριά. Κυριολεκτικά.",
  "contact.cta": "Επικοινώνησε σήμερα →",
  "contact.phone_display": siteConfig.phone.display,
  "contact.phone_href": siteConfig.phone.href,
  "contact.whatsapp_display": siteConfig.whatsapp.display,
  "contact.whatsapp_href": siteConfig.whatsapp.href,
  "contact.viber_display": siteConfig.viber.display,
  "contact.viber_href": siteConfig.viber.href,
  "contact.email_display": siteConfig.email.display,
  "contact.email_href": siteConfig.email.href,
  "contact.facebook_label": siteConfig.facebook.label,
  "contact.facebook_href": siteConfig.facebook.href,
  "general.site_tagline": siteConfig.tagline,
  "general.footer_blurb":
    "Γλώσσες με σύγχρονο τρόπο. Λιγότερο βαρετό διάβασμα, περισσότερο στυλ.",
};

export const DEFAULT_OFFERS: PublicOffer[] = [
  {
    id: "default-private",
    title: "Ιδιαίτερα",
    description: "Ένας μαθητής. Ένα πρόγραμμα φτιαγμένο στα μέτρα του.",
    originalPrice: siteConfig.pricing.private.regular,
    currentPrice: siteConfig.pricing.private.offer,
    billingPeriod: "8 ώρες / μήνα",
    badgeText: "Προσφορά",
    accent: "navy",
    sortOrder: 0,
  },
  {
    id: "default-group",
    title: "Ομαδικά",
    description: "Μαθαίνεις μαζί. Προχωράτε μαζί. Και ναι, είναι πιο fun.",
    originalPrice: siteConfig.pricing.group.regular,
    currentPrice: siteConfig.pricing.group.offer,
    billingPeriod: "3–4 άτομα · 8 ώρες / μήνα",
    badgeText: "Προσφορά",
    accent: "paper",
    sortOrder: 1,
  },
];

export function mapOffer(offer: Offer): PublicOffer {
  return {
    id: offer.id,
    title: offer.title,
    description: offer.description,
    originalPrice: Number(offer.originalPrice),
    currentPrice: Number(offer.currentPrice),
    billingPeriod: offer.billingPeriod,
    badgeText: offer.badgeText,
    accent: offer.accent,
    sortOrder: offer.sortOrder,
  };
}

export function mergeContent(
  rows: Array<{ key: string; value: string }>,
): SiteContentMap {
  const next = { ...DEFAULT_CONTENT };
  for (const row of rows) {
    if (row.key in next) {
      next[row.key as SiteContentKey] = row.value;
    }
  }
  return next;
}
