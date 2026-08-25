"use client";

import { Mail, MessageCircle, Phone, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, DropWords } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { useContactModal } from "@/components/providers/ContactProvider";
import { useJourney } from "@/components/providers/JourneyProvider";
import { siteConfig } from "@/lib/config";
import { goalLabels } from "@/data/goals";

const contacts = [
  {
    label: "Κάλεσε",
    value: siteConfig.phone.display,
    href: siteConfig.phone.href,
    icon: Phone,
    tone: "bg-yellow",
  },
  {
    label: "WhatsApp",
    value: siteConfig.whatsapp.display,
    href: siteConfig.whatsapp.href,
    icon: MessageCircle,
    tone: "bg-green",
  },
  {
    label: "Viber",
    value: siteConfig.viber.display,
    href: siteConfig.viber.href,
    icon: Smartphone,
    tone: "bg-lilac",
  },
  {
    label: "Email",
    value: siteConfig.email.display,
    href: siteConfig.email.href,
    icon: Mail,
    tone: "bg-blue text-paper",
  },
];

export function Contact() {
  const { openContact } = useContactModal();
  const journey = useJourney();

  return (
    <section id="contact" className="relative overflow-hidden bg-navy text-cream">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,225,74,0.2),transparent_35%),radial-gradient(circle_at_85%_80%,rgba(255,93,122,0.2),transparent_40%)]" />
      <div className="container-shell section-pad relative z-10">
        <Reveal>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-yellow">
            Πάμε να γνωριστούμε
          </p>
        </Reveal>
        <h2 className="font-display mt-4 max-w-3xl text-[clamp(2rem,6.8vw,4rem)] leading-[1.18] sm:leading-[1.12]">
          <DropWords text="Έτοιμος για το πρώτο σου “Hallo”;" />{" "}
          <span>👋</span>
        </h2>
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-xl text-lg text-cream/70">
            Η Βιργινία είναι ένα μήνυμα μακριά. Κυριολεκτικά.
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
            Επικοινώνησε σήμερα →
          </Button>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {contacts.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="focus-ring flex items-center gap-4 rounded-3xl border-[3px] border-ink bg-cream p-6 text-ink shadow-[6px_6px_0_#ffe14a] transition hover:-translate-y-1"
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
                <span>
                  <span className="block text-xs font-extrabold uppercase tracking-[0.16em] text-muted">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-base font-bold md:text-lg">
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
