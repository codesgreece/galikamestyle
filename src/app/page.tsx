"use client";

import { ContactProvider } from "@/components/providers/ContactProvider";
import { JourneyProvider } from "@/components/providers/JourneyProvider";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { GoalJourney } from "@/components/sections/GoalJourney";
import { LanguageSelect } from "@/components/sections/LanguageSelect";
import { LevelTest } from "@/components/sections/LevelTest";
import { Levels } from "@/components/sections/Levels";
import { MiniGame } from "@/components/sections/MiniGame";
import { LanguageBattle } from "@/components/sections/LanguageBattle";
import { About } from "@/components/sections/About";
import { ExamPrep } from "@/components/sections/ExamPrep";
import { Pricing } from "@/components/sections/Pricing";
import { FitQuiz } from "@/components/sections/FitQuiz";
import { Contact } from "@/components/sections/Contact";
import { EndSurprise } from "@/components/sections/EndSurprise";
import { Social } from "@/components/sections/Social";

export default function HomePage() {
  return (
    <JourneyProvider>
      <ContactProvider>
        <a
          href="#main"
          className="focus-ring sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-yellow focus:px-4 focus:py-2 focus:text-ink"
        >
          Μετάβαση στο περιεχόμενο
        </a>
        <Navigation />
        <main id="main">
          <Hero />
          <GoalJourney />
          <LanguageSelect />
          <div className="desktop-pair">
            <LevelTest />
            <MiniGame />
          </div>
          <Levels />
          <div className="desktop-pair">
            <LanguageBattle />
            <FitQuiz />
          </div>
          <About />
          <ExamPrep />
          <Pricing />
          <Contact />
          <EndSurprise />
          <Social />
        </main>
        <Footer />
      </ContactProvider>
    </JourneyProvider>
  );
}
