"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navLinks, siteConfig } from "@/lib/config";
import { scrollToId } from "@/lib/utils";
import { useContactModal } from "@/components/providers/ContactProvider";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { openContact } = useContactModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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
    const id = href.replace("#", "");
    setOpen(false);
    requestAnimationFrame(() => scrollToId(id));
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-cream/10 bg-ink/85 backdrop-blur-xl"
            : "bg-transparent",
        )}
      >
        <div className="container-shell flex h-[4.25rem] items-center justify-between md:h-[5rem]">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              go("#hero");
            }}
            className="focus-ring group"
          >
            <span className="font-display text-xl tracking-tight text-cream md:text-2xl">
              Γερμανικά{" "}
              <span className="text-gold transition group-hover:text-gold-soft">
                με Στυλ
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Κύριο μενού">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  go(link.href);
                }}
                className="focus-ring text-[0.78rem] uppercase tracking-[0.18em] text-cream/90 transition hover:text-gold"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => openContact()}
              className="focus-ring hidden items-center gap-1.5 border border-cream/20 px-4 py-2 text-[0.72rem] uppercase tracking-[0.18em] text-cream transition hover:border-gold/50 hover:text-gold sm:inline-flex"
            >
              Επικοινωνία
              <ArrowUpRight size={14} />
            </button>
            <button
              type="button"
              className="focus-ring inline-flex h-11 w-11 items-center justify-center border border-cream/20 text-cream lg:hidden"
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
            className="fixed inset-0 z-40 bg-ink"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="noise-overlay" />
            <div className="container-shell flex h-full flex-col justify-between pb-10 pt-28">
              <nav aria-label="Κινητό μενού" className="space-y-2">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      go(link.href);
                    }}
                    className="font-display block border-b border-cream/10 py-4 text-4xl text-cream sm:text-5xl"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.45 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>
              <div className="space-y-4">
                <p className="text-sm text-cream/55">{siteConfig.tagline}</p>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    openContact();
                  }}
                  className="focus-ring inline-flex items-center gap-2 bg-wine px-5 py-3 text-sm uppercase tracking-[0.16em] text-cream"
                >
                  Επικοινωνία
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
