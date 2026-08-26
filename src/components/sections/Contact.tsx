"use client";

import { Mail, MessageCircle, Phone, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, DropWords } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { useContactModal } from "@/components/providers/ContactProvider";
import { useJourney } from "@/components/providers/JourneyProvider";
import { goalLabels } from "@/data/goals";
import { DEFAULT_CONTENT, type SiteContentMap } from "@/lib/defaults";

export function Contact({ content = DEFAULT_CONTENT }: { content?: SiteContentMap }) {
  const { openContact } = useContactModal();
  const journey = useJourney();

  const contacts = [
    {
      label: "Κάλεσε",
      value: content["contact.phone_display"],
      href: content["contact.phone_href"],
      icon: Phone,
      tone: "bg-yellow",
    },
    {
      label: "WhatsApp",
      value: content["contact.whatsapp_display"],
      href: content["contact.whatsapp_href"],
      icon: MessageCircle,
      tone: "bg-green",
    },
    {
      label: "Viber",
      value: content["contact.viber_display"],
      href: content["contact.viber_href"],
      icon: Smartphone,
      tone: "bg-lilac",
    },
    {
      label: "Email",
      value: content["contact.email_display"],
      href: content["contact.email_href"],
      icon: Mail,
      tone: "bg-blue text-paper",
    },
  ];

  return (
    <section id="contact" className="relative overflow-hidden bg-navy text-cream">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,225,74,0.2),transparent_35%),radial-gradient(circle_at_85%_80%,rgba(255,93,122,0.2),transparent_40%)]" />
      <div className="container-shell section-pad relative z-10">
        <Reveal>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-yellow">
            {content["contact.section_eyebrow"]}
          </p>
        </Reveal>
        <h2 className="section-title font-display max-w-3xl">
          <DropWords text={content["contact.section_title"]} />{" "}
          <span>👋</span>
        </h2>
        <Reveal delay={0.1}>
          <p className="mt-3 max-w-xl text-lg text-cream/70 sm:mt-4">
            {content["contact.section_subtitle"]}
          </p>
        </Reveal>

        {(journey.selectedGoal ||
          journey.estimatedLevel ||
          journey.selectedLanguage) && (
          <Reveal delay={0.12} className="mt-6">
            <div className="inline-flex max-w-xl flex-wrap gap-2 rounded-2xl border-2 border-cream/20 bg-cream/10 p-3 text-sm">
              {journey.selectedGoal ? (
                <span className="rounded-full bg-yellow px-3 py-1 font-bold text-ink">
                  {goalLabels[journey.selectedGoal]}
                </span>
              ) : null}
              {journey.selectedLanguage ? (
                <span className="rounded-full bg-blue px-3 py-1 font-bold text-paper">
                  {journey.selectedLanguage === "german"
                    ? "🇩🇪 Γερμανικά"
                    : "🇬🇧 Αγγλικά"}
                </span>
              ) : null}
              {journey.estimatedLevel ? (
                <span className="rounded-full bg-coral px-3 py-1 font-bold text-paper">
                  Level {journey.estimatedLevel}
                </span>
              ) : null}
            </div>
          </Reveal>
        )}

        <Reveal delay={0.15} className="mt-8">
          <Button
            variant="yellow"
            onClick={() =>
              openContact({
                interest: journey.selectedLanguage ?? "german",
                goal: journey.selectedGoal ?? undefined,
                estimatedLevel: journey.estimatedLevel ?? undefined,
                testScore: journey.testScore ?? undefined,
                battleResult: journey.battleResult ?? undefined,
              })
            }
          >
            {content["contact.cta"]}
          </Button>
        </Reveal>

        <div className="section-stack grid gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-3">
          {contacts.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="focus-ring flex items-center gap-3 rounded-3xl border-[3px] border-ink bg-cream p-4 text-ink shadow-[6px_6px_0_#ffe14a] transition hover:-translate-y-1 lg:p-4"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-ink ${item.tone}`}
                >
                  <Icon size={18} />
                </span>
                <span className="text-ink">
                  <span className="block text-xs font-extrabold uppercase tracking-[0.16em] text-muted">
                    {item.label}
                  </span>
                  <span className="mt-1 block break-words text-sm font-bold text-ink md:text-base lg:text-sm">
                    {item.value}
                  </span>
                </span>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
