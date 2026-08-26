import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./admin.css";

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-admin-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-admin-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Admin | Γερμανικά με Στυλ",
    template: "%s | Admin · Γερμανικά με Στυλ",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${dmSans.variable} ${fraunces.variable}`}>{children}</div>
  );
}
