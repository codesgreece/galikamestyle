import type { Metadata, Viewport } from "next";
import { EB_Garamond, Manrope } from "next/font/google";
import { siteConfig } from "@/lib/config";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "greek"],
  display: "swap",
});

const ebGaramond = EB_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "greek"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Γερμανικά με Στυλ | Μαθήματα Γερμανικών & Αγγλικών",
  description:
    "Μαθήματα Γερμανικών και Αγγλικών από τη Βιργινία Πανάκη. Επίπεδα A1 έως C1, ιδιαίτερα και ομαδικά μαθήματα, καθώς και προετοιμασία για Goethe, ÖSD, TELC, ΚΠΓ και DaF.",
  keywords: [
    "Γερμανικά",
    "Αγγλικά",
    "μαθήματα",
    "Βιργινία Πανάκη",
    "Goethe",
    "ÖSD",
    "TELC",
    "ΚΠΓ",
    "DaF",
    "ιδιαίτερα μαθήματα",
  ],
  authors: [{ name: siteConfig.teacher }],
  openGraph: {
    title: "Γερμανικά με Στυλ | Μαθήματα Γερμανικών & Αγγλικών",
    description: siteConfig.tagline,
    type: "website",
    locale: "el_GR",
    siteName: siteConfig.name,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0b0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el" className={`${manrope.variable} ${ebGaramond.variable}`}>
      <body className="min-h-screen bg-cream text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
