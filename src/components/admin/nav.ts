export const ADMIN_NAV = [
  { href: "/admingermanika/dashboard", label: "Dashboard", icon: "home" },
  { href: "/admingermanika/bookings", label: "Bookings", icon: "calendar" },
  { href: "/admingermanika/availability", label: "Availability", icon: "clock" },
  { href: "/admingermanika/offers", label: "Προσφορές", icon: "tag" },
  { href: "/admingermanika/blog", label: "Blog", icon: "pen" },
  { href: "/admingermanika/content", label: "Περιεχόμενο Site", icon: "edit" },
  { href: "/admingermanika/media", label: "Media", icon: "image" },
  { href: "/admingermanika/analytics", label: "Στατιστικά", icon: "chart" },
  { href: "/admingermanika/settings", label: "Ρυθμίσεις", icon: "settings" },
] as const;

export type AdminNavItem = (typeof ADMIN_NAV)[number];
