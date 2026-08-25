import { FacebookIcon } from "@/components/ui/FacebookIcon";
import { siteConfig } from "@/lib/config";

const links = [
  { href: "#hero", label: "Αρχική" },
  { href: "#levels", label: "Επίπεδα" },
  { href: "#pricing", label: "Modes" },
  { href: "#contact", label: "Επικοινωνία" },
];

export function Footer() {
  return (
    <footer className="border-t-[3px] border-ink bg-navy text-cream">
      <div className="container-shell py-12 md:py-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-3xl">
              Γερμανικά{" "}
              <span className="rounded-md bg-yellow px-2 text-ink">με Στυλ</span>
            </p>
            <p className="mt-3 max-w-sm text-sm text-cream/65">
              Γλώσσες με σύγχρονο τρόπο. Λιγότερο βαρετό διάβασμα, περισσότερο
              στυλ.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="focus-ring text-sm text-cream/70 hover:text-yellow">
                {l.label}
              </a>
            ))}
            <a
              href={siteConfig.facebook.href}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex items-center gap-2 text-sm text-cream/70 hover:text-yellow"
            >
              <FacebookIcon className="text-[15px]" />
              Facebook
            </a>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-cream/15 pt-5 text-xs text-cream/45 sm:flex-row sm:justify-between">
          <p>© 2026 {siteConfig.name}</p>
          <p>{siteConfig.teacher}</p>
        </div>
      </div>
    </footer>
  );
}
