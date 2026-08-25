"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navLinks, siteConfig } from "@/lib/config";
import { scrollToId, cn } from "@/lib/utils";
import { useContactModal } from "@/components/providers/ContactProvider";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { openContact } = useContactModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    requestAnimationFrame(() => scrollToId(href.replace("#", "")));
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b-[3px] border-ink bg-cream/95 backdrop-blur-md"
            : "bg-transparent",
        )}
      >
        <div className="container-shell flex h-[4.25rem] items-center justify-between md:h-[4.75rem]">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              go("#hero");
            }}
            className="focus-ring font-display text-lg md:text-xl"
          >
            Γερμανικά{" "}
            <span className="rounded-md bg-yellow px-1.5 py-0.5 text-ink">
              με Στυλ
            </span>
          </a>

          <nav className="hidden items-center gap-5 lg:flex" aria-label="Κύριο μενού">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  go(link.href);
                }}
                className="focus-ring text-sm font-bold text-ink/75 transition hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openContact()}
              className="focus-ring hidden items-center gap-1 rounded-full border-[3px] border-ink bg-coral px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-paper shadow-[3px_3px_0_#1a1433] sm:inline-flex"
            >
              Πάμε!
              <ArrowUpRight size={14} />
            </button>
            <button
              type="button"
              className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-xl border-[3px] border-ink bg-yellow lg:hidden"
              aria-label={open ? "Κλείσιμο μενού" : "Άνοιγμα μενού"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-40 bg-navy text-cream"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="container-shell flex h-full flex-col justify-between pb-10 pt-28">
              <nav aria-label="Κινητό μενού" className="space-y-1">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      go(link.href);
                    }}
                    className="font-display block border-b-2 border-cream/15 py-4 text-4xl text-cream"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>
              <div className="space-y-4">
                <p className="text-cream/70">{siteConfig.tagline}</p>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    openContact();
                  }}
                  className="focus-ring inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-yellow px-5 py-3 font-extrabold text-ink"
                >
                  Πάμε να γνωριστούμε
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
