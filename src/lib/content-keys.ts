export type ContentGroup = "hero" | "contact" | "general";

export type SiteContentKey =
  | "hero.eyebrow"
  | "hero.title_line1"
  | "hero.title_line2"
  | "hero.title_line3_prefix"
  | "hero.subtitle"
  | "hero.cta_primary"
  | "hero.cta_secondary"
  | "contact.section_eyebrow"
  | "contact.section_title"
  | "contact.section_subtitle"
  | "contact.cta"
  | "contact.phone_display"
  | "contact.phone_href"
  | "contact.whatsapp_display"
  | "contact.whatsapp_href"
  | "contact.viber_display"
  | "contact.viber_href"
  | "contact.email_display"
  | "contact.email_href"
  | "contact.facebook_label"
  | "contact.facebook_href"
  | "general.site_tagline"
  | "general.footer_blurb";

export type ContentFieldDef = {
  key: SiteContentKey;
  group: ContentGroup;
  label: string;
  multiline?: boolean;
};

export const CONTENT_FIELDS: ContentFieldDef[] = [
  { key: "hero.eyebrow", group: "hero", label: "Hero eyebrow" },
  { key: "hero.title_line1", group: "hero", label: "Hero τίτλος γραμμή 1" },
  { key: "hero.title_line2", group: "hero", label: "Hero τίτλος γραμμή 2" },
  {
    key: "hero.title_line3_prefix",
    group: "hero",
    label: "Hero τίτλος γραμμή 3 (πριν το ΣΤΥΛ)",
  },
  { key: "hero.subtitle", group: "hero", label: "Hero υπότιτλος", multiline: true },
  { key: "hero.cta_primary", group: "hero", label: "Hero CTA κύριο" },
  { key: "hero.cta_secondary", group: "hero", label: "Hero CTA δευτερεύον" },
  { key: "contact.section_eyebrow", group: "contact", label: "Contact eyebrow" },
  { key: "contact.section_title", group: "contact", label: "Contact τίτλος" },
  {
    key: "contact.section_subtitle",
    group: "contact",
    label: "Contact υπότιτλος",
    multiline: true,
  },
  { key: "contact.cta", group: "contact", label: "Contact CTA" },
  { key: "contact.phone_display", group: "contact", label: "Τηλέφωνο (εμφάνιση)" },
  { key: "contact.phone_href", group: "contact", label: "Τηλέφωνο (link)" },
  {
    key: "contact.whatsapp_display",
    group: "contact",
    label: "WhatsApp (εμφάνιση)",
  },
  { key: "contact.whatsapp_href", group: "contact", label: "WhatsApp (link)" },
  { key: "contact.viber_display", group: "contact", label: "Viber (εμφάνιση)" },
  { key: "contact.viber_href", group: "contact", label: "Viber (link)" },
  { key: "contact.email_display", group: "contact", label: "Email (εμφάνιση)" },
  { key: "contact.email_href", group: "contact", label: "Email (link)" },
  { key: "contact.facebook_label", group: "contact", label: "Facebook label" },
  { key: "contact.facebook_href", group: "contact", label: "Facebook URL" },
  { key: "general.site_tagline", group: "general", label: "Tagline" },
  {
    key: "general.footer_blurb",
    group: "general",
    label: "Footer κείμενο",
    multiline: true,
  },
];

export const CONTENT_GROUP_LABELS: Record<ContentGroup, string> = {
  hero: "Hero",
  contact: "Επικοινωνία",
  general: "Γενικά",
};
