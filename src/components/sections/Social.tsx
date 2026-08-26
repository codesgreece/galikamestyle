"use client";

import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { FacebookIcon } from "@/components/ui/FacebookIcon";
import { siteConfig } from "@/lib/config";
import { DEFAULT_CONTENT, type SiteContentMap } from "@/lib/defaults";

export function Social({ content = DEFAULT_CONTENT }: { content?: SiteContentMap }) {
  const facebookHref = content["contact.facebook_href"] || siteConfig.facebook.href;

  return (
    <section className="border-t-[3px] border-ink bg-paper">
      <div className="container-shell py-10 lg:py-12">
        <Reveal>
          <a
            href={facebookHref}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring group flex flex-col items-start justify-between gap-5 rounded-3xl border-[3px] border-ink bg-cream px-6 py-7 shadow-[8px_8px_0_#3d8bff] transition hover:-translate-y-1 hover:shadow-[10px_10px_0_#ff5d7a] sm:flex-row sm:items-center sm:px-8"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border-[3px] border-ink bg-blue text-paper">
                <FacebookIcon className="text-[22px]" />
              </span>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-muted">
                  Social quest
                </p>
                <p className="font-display mt-1 text-2xl md:text-3xl">
                  Ακολούθησε τα {siteConfig.name} στο Facebook
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide">
              Follow
              <ArrowUpRight size={16} />
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
