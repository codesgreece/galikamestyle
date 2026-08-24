import { FacebookIcon } from "@/components/ui/FacebookIcon";
import { siteConfig } from "@/lib/config";

const footerLinks = [
  { href: "#hero", label: "Αρχική" },
  { href: "#levels", label: "Μαθήματα" },
  { href: "#pricing", label: "Τιμές" },
  { href: "#contact", label: "Επικοινωνία" },
];

export function Footer() {
  return (
    <footer className="border-t border-cream/10 bg-ink text-cream">
      <div className="container-shell section-pad !py-14 md:!py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
          <div>
            <p className="font-display text-3xl md:text-4xl">{siteConfig.name}</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/55">
              Γερμανικά & Αγγλικά με σύγχρονο τρόπο διδασκαλίας.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 md:justify-end">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="focus-ring text-sm text-cream/65 transition hover:text-cream"
              >
                {link.label}
              </a>
            ))}
            <a
              href={siteConfig.facebook.href}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex items-center gap-2 text-sm text-cream/65 transition hover:text-gold"
            >
              <FacebookIcon className="text-[15px]" />
              Facebook
            </a>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-cream/10 pt-6 text-xs text-cream/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {siteConfig.name}</p>
          <p>{siteConfig.teacher}</p>
        </div>
      </div>
    </footer>
  );
}
