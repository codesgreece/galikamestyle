"use client";

import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { FacebookIcon } from "@/components/ui/FacebookIcon";
import { siteConfig } from "@/lib/config";

export function Social() {
  return (
    <section className="border-t border-ink/5 bg-cream-deep text-ink">
      <div className="container-shell py-16 md:py-20">
        <Reveal>
          <a
            href={siteConfig.facebook.href}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring group flex flex-col items-start justify-between gap-6 border border-ink/10 bg-paper px-6 py-8 transition duration-500 hover:border-wine/30 hover:shadow-[0_24px_60px_rgba(40,24,18,0.1)] sm:flex-row sm:items-center sm:px-10"
          >
            <div className="flex items-start gap-4 sm:items-center">
              <span className="flex h-14 w-14 items-center justify-center border border-wine/20 bg-wine text-cream transition group-hover:scale-[1.03]">
                <FacebookIcon className="text-[22px]" />
              </span>
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-wine/70">
                  Social
                </p>
                <p className="font-display mt-2 text-2xl md:text-3xl">
                  Ακολούθησε τα {siteConfig.name} στο Facebook
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-ink/55 transition group-hover:text-wine">
              Ακολούθησε
              <ArrowUpRight size={16} />
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
