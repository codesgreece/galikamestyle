"use client";

import { useState } from "react";
import { ContactProvider } from "@/components/providers/ContactProvider";
import { JourneyProvider } from "@/components/providers/JourneyProvider";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { WordPortal } from "@/components/intro/WordPortal";
import { Hero } from "@/components/sections/Hero";
import { GoalJourney } from "@/components/sections/GoalJourney";
import { LanguageSelect } from "@/components/sections/LanguageSelect";
import { LevelTest } from "@/components/sections/LevelTest";
import { LanguageJourney } from "@/components/sections/LanguageJourney";
import { LanguageBattle } from "@/components/sections/LanguageBattle";
import { DailyChallenge } from "@/components/sections/DailyChallenge";
import { RandomWordMachine } from "@/components/sections/RandomWordMachine";
import { ExamPrep } from "@/components/sections/ExamPrep";
import { Pricing } from "@/components/sections/Pricing";
import { PersonalityQuiz } from "@/components/sections/PersonalityQuiz";
import { BookingFlow } from "@/components/sections/BookingFlow";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { EndSurprise } from "@/components/sections/EndSurprise";
import { Social } from "@/components/sections/Social";
import { BlogPreview, type HomeBlogPost } from "@/components/sections/BlogPreview";
import { AchievementsPanel } from "@/components/sections/AchievementsPanel";
import type { PublicOffer, SiteContentMap } from "@/lib/defaults";

export function HomeClient({
  offers,
  content,
  posts,
}: {
  offers: PublicOffer[];
  content: SiteContentMap;
  posts: HomeBlogPost[];
}) {
  const [kind, setKind] = useState<"full" | "short" | "skip" | "pending">(
    "pending",
  );
  const [reveal, setReveal] = useState(false);
  const [portalOn, setPortalOn] = useState(true);
  const cinematic = portalOn && (kind === "full" || kind === "pending");

  return (
    <JourneyProvider>
      <ContactProvider content={content}>
        <WordPortal
          onKind={(next) => {
            setKind(next);
            if (next === "skip") setPortalOn(false);
          }}
          onEnter={() => setReveal(true)}
          onComplete={() => {
            setReveal(true);
            setPortalOn(false);
          }}
        />
        <a
          href="#main"
          className="focus-ring sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-yellow focus:px-4 focus:py-2 focus:text-ink"
        >
          Μετάβαση στο περιεχόμενο
        </a>
        <Navigation />
        <main id="main">
          <Hero reveal={reveal} cinematic={cinematic} content={content} />
          <GoalJourney />
          <LanguageSelect />
          <LevelTest />
          <LanguageJourney />
          <LanguageBattle />
          <DailyChallenge />
          <RandomWordMachine />
          <ExamPrep />
          <Pricing offers={offers} />
          <BookingFlow />
          <PersonalityQuiz />
          <AchievementsPanel />
          <About />
          <BlogPreview posts={posts} />
          <Contact content={content} />
          <EndSurprise />
          <Social content={content} />
        </main>
        <Footer content={content} />
      </ContactProvider>
    </JourneyProvider>
  );
}
