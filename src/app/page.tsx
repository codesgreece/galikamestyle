"use client";

import { ContactProvider } from "@/components/providers/ContactProvider";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Levels } from "@/components/sections/Levels";
import { Certificates } from "@/components/sections/Certificates";
import { ExamPrep } from "@/components/sections/ExamPrep";
import { Pricing } from "@/components/sections/Pricing";
import { Audience } from "@/components/sections/Audience";
import { Philosophy } from "@/components/sections/Philosophy";
import { Contact } from "@/components/sections/Contact";
import { Social } from "@/components/sections/Social";

export default function HomePage() {
  return (
    <ContactProvider>
      <a
        href="#main"
        className="focus-ring sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-cream focus:px-4 focus:py-2 focus:text-ink"
      >
        Μετάβαση στο περιεχόμενο
      </a>
      <Navigation />
      <main id="main">
        <Hero />
        <About />
        <Levels />
        <Certificates />
        <ExamPrep />
        <Pricing />
        <Audience />
        <Philosophy />
        <Contact />
        <Social />
      </main>
      <Footer />
    </ContactProvider>
  );
}
