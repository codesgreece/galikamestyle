"use client";

import { Mail, MessageCircle, Phone, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, TextReveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { useContactModal } from "@/components/providers/ContactProvider";
import { siteConfig } from "@/lib/config";

const contacts = [
  {
    label: "Τηλέφωνο",
    value: siteConfig.phone.display,
    href: siteConfig.phone.href,
    icon: Phone,
    hint: "Κάλεσε τώρα",
  },
  {
    label: "WhatsApp",
    value: siteConfig.whatsapp.display,
    href: siteConfig.whatsapp.href,
    icon: MessageCircle,
    hint: "Άμεσο μήνυμα",
  },
  {
    label: "Viber",
    value: siteConfig.viber.display,
    href: siteConfig.viber.href,
    icon: Smartphone,
    hint: "Άνοιγμα στο Viber",
  },
  {
    label: "Email",
    value: siteConfig.email.display,
    href: siteConfig.email.href,
    icon: Mail,
    hint: "Στείλε email",
  },
];

export function Contact() {
  const { openContact } = useContactModal();

  return (
    <section id="contact" className="relative overflow-hidden bg-ink text-cream">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_0%,rgba(140,48,69,0.25),transparent_40%),radial-gradient(ellipse_at_90%_100%,rgba(196,165,116,0.12),transparent_35%)]" />
      <div className="container-shell section-pad relative z-10">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <Reveal>
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-gold">
                Επικοινωνία
              </p>
            </Reveal>
            <TextReveal
              text="Η επόμενη λέξη"
              className="font-display mt-5 text-[clamp(2.4rem,6vw,4.6rem)] leading-[1.02]"
            />
            <TextReveal
              text="μπορεί να είναι η αρχή σου."
              className="font-display mt-1 text-[clamp(2.4rem,6vw,4.6rem)] leading-[1.02] text-cream/50"
              delay={0.12}
            />
            <Reveal delay={0.2} className="mt-6 max-w-lg">
              <p className="text-base leading-relaxed text-cream/60 md:text-lg">
                Επικοινώνησε με τη Βιργινία και βρες το πρόγραμμα που ταιριάζει σε
                εσένα.
              </p>
            </Reveal>
            <Reveal delay={0.28} className="mt-8">
              <Button variant="primary" magnetic onClick={() => openContact()}>
                Επικοινώνησε σήμερα
              </Button>
            </Reveal>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {contacts.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="focus-ring group depth-card flex items-center gap-4 p-5 transition duration-300 hover:-translate-y-1"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.55 }}
                >
                  <span className="flex h-12 w-12 items-center justify-center border border-gold/25 text-gold transition group-hover:border-gold/50">
                    <Icon size={18} />
                  </span>
                  <span>
                    <span className="block text-[0.68rem] uppercase tracking-[0.2em] text-cream/45">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-base text-cream md:text-lg">
                      {item.value}
                    </span>
                    <span className="mt-1 block text-xs text-gold/70 opacity-0 transition group-hover:opacity-100">
                      {item.hint}
                    </span>
                  </span>
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
