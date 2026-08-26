import type { Metadata, Viewport } from "next";
import { Comfortaa, Manrope } from "next/font/google";
import { siteConfig } from "@/lib/config";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "greek"],
  display: "swap",
});

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin", "greek"],
  weight: ["500", "600", "700"],
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
  ],
  authors: [{ name: siteConfig.teacher }],
  openGraph: {
    title: "Γερμανικά με Στυλ | Μαθήματα Γερμανικών & Αγγλικών",
    description: siteConfig.tagline,
    type: "website",
    locale: "el_GR",
    siteName: siteConfig.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#12103a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el" className={`${manrope.variable} ${comfortaa.variable}`}>
      <body className="min-h-screen bg-cream text-ink antialiased">
        <noscript>
          <style>{`.word-portal{display:none!important}.hero-from-portal{opacity:1!important;transform:none!important;filter:none!important}`}</style>
        </noscript>
        {children}
        <PageViewTracker />
      </body>
    </html>
  );
}
