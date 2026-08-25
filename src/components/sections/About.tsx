"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Reveal, DropWords } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/config";

const badges = [
  { text: "Goethe C2", className: "bg-yellow -rotate-6 top-4 -left-3 md:-left-8" },
  { text: "NOCN C2", className: "bg-blue text-paper rotate-6 top-8 -right-2 md:-right-8" },
  { text: "10+", className: "bg-coral text-paper -rotate-3 bottom-16 -left-2 md:-left-6" },
  { text: "A1 → C1", className: "bg-green rotate-3 bottom-8 -right-2 md:-right-6" },
];

export function About() {
  return (
    <section id="about" className="relative bg-paper">
      <div className="container-shell section-pad">
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal>
            <div className="relative mx-auto max-w-md">
              <div className="pop-card overflow-hidden rounded-[2rem] border-[3px] border-ink bg-white shadow-[8px_8px_0_#1a1433]">
                <div className="relative aspect-[4/5] bg-white">
                  <Image
                    src="/images/virginia-panaki.png"
                    alt={`${siteConfig.teacher} — καθηγήτρια Γερμανικών και Αγγλικών`}
                    fill
                    sizes="(max-width: 768px) 90vw, 420px"
                    className="object-cover object-[center_18%]"
                    priority={false}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/90 to-transparent p-5 pt-16">
                    <div className="rounded-2xl border-2 border-ink bg-cream p-4 text-ink shadow-[5px_5px_0_#ffe14a]">
                      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-muted">
                        Meet Virginia
                      </p>
                      <p className="font-display mt-1 text-3xl">{siteConfig.teacher}</p>
                      <p className="mt-1 text-sm text-ink/65">
                        Γερμανικά & Αγγλικά με ρυθμό και στυλ.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {badges.map((b) => (
                <motion.span
                  key={b.text}
                  className={`sticker absolute rounded-full px-3 py-1.5 text-xs font-extrabold ${b.className}`}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  {b.text}
                </motion.span>
              ))}
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-coral">
                Meet the teacher
              </p>
            </Reveal>
            <h2 className="font-display mt-4 text-[clamp(1.9rem,6.5vw,3.5rem)] leading-[1.18] sm:leading-[1.12]">
              <DropWords text="Η δασκάλα πίσω από το «Γερμανικά με Στυλ»." />
            </h2>
            <Reveal delay={0.1}>
              <p className="mt-5 text-lg text-ink/70">
                Όχι βαρετό βιογραφικό. Απλά μια καθηγήτρια που πιστεύει ότι η
                γλώσσα μαθαίνεται καλύτερα όταν έχει ρυθμό, νόημα και λίγο στυλ.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <InfoCard title="🎓 Γερμανικά" text="ÖSD • ΚΠΓ • Goethe C2" tone="bg-yellow" />
              <InfoCard title="🇬🇧 Αγγλικά" text="NOCN C2" tone="bg-blue text-paper" />
              <InfoCard
                title="🎯 Mission"
                text="Να κάνουμε τη γλώσσα λιγότερο «διάβασμα» και περισσότερο εμπειρία."
                tone="bg-coral text-paper"
              />
              <InfoCard title="👦👧 Για ποιους;" text="Παιδιά από 10 ετών και άνω." tone="bg-green" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  title,
  text,
  tone,
}: {
  title: string;
  text: string;
  tone: string;
}) {
  return (
    <div className={`rounded-3xl border-[3px] border-ink p-5 shadow-[5px_5px_0_#1a1433] ${tone}`}>
      <p className="font-display text-xl">{title}</p>
      <p className="mt-2 text-sm font-medium opacity-90">{text}</p>
    </div>
  );
}
