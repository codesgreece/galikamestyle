"use client";

import { FormEvent, useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ContactPreset } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/config";

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
  preset?: Partial<ContactPreset>;
};

type FormState = {
  name: string;
  phone: string;
  email: string;
  interest: "german" | "english";
  format: "private" | "group";
  message: string;
};

function createFormState(preset?: Partial<ContactPreset>): FormState {
  return {
    name: "",
    phone: "",
    email: "",
    interest: preset?.interest ?? "german",
    format: preset?.format ?? "private",
    message: "",
  };
}

export function ContactModal({ open, onClose, preset }: ContactModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <ContactModalContent
          key={`${preset?.interest ?? "german"}-${preset?.format ?? "private"}`}
          onClose={onClose}
          preset={preset}
        />
      ) : null}
    </AnimatePresence>
  );
}

function ContactModalContent({
  onClose,
  preset,
}: {
  onClose: () => void;
  preset?: Partial<ContactPreset>;
}) {
  const titleId = useId();
  const [form, setForm] = useState<FormState>(() => createFormState(preset));
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      source: siteConfig.name,
      createdAt: new Date().toISOString(),
    };
    console.info("[contact-form]", payload);
    setSubmitted(true);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        type="button"
        aria-label="Κλείσιμο φόρμας"
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 max-h-[92vh] w-full overflow-y-auto border border-cream/10 bg-charcoal text-cream shadow-[0_40px_100px_rgba(0,0,0,0.55)] sm:max-w-xl sm:rounded-sm"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-cream/10 px-6 py-5 sm:px-8">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.28em] text-gold">
              Επικοινωνία
            </p>
            <h2 id={titleId} className="font-display mt-2 text-3xl text-cream">
              Ας ξεκινήσουμε μαζί
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="focus-ring rounded-sm p-2 text-cream/70 transition hover:text-cream"
            aria-label="Κλείσιμο"
          >
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="space-y-4 px-6 py-10 sm:px-8">
            <p className="font-display text-3xl text-cream">Ευχαριστούμε!</p>
            <p className="max-w-md text-cream/70">
              Το μήνυμά σου καταχωρήθηκε. Η Βιργινία θα επικοινωνήσει μαζί σου
              σύντομα. Μπορείς επίσης να καλέσεις ή να στείλεις WhatsApp άμεσα.
            </p>
            <Button variant="light" onClick={onClose}>
              Κλείσιμο
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5 px-6 py-7 sm:px-8">
            <Field
              label="Ονοματεπώνυμο"
              required
              value={form.name}
              onChange={(v) => setForm((s) => ({ ...s, name: v }))}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Τηλέφωνο"
                type="tel"
                required
                value={form.phone}
                onChange={(v) => setForm((s) => ({ ...s, phone: v }))}
              />
              <Field
                label="Email"
                type="email"
                required
                value={form.email}
                onChange={(v) => setForm((s) => ({ ...s, email: v }))}
              />
            </div>

            <fieldset>
              <legend className="mb-3 text-xs uppercase tracking-[0.2em] text-muted-light">
                Ενδιαφέρομαι για
              </legend>
              <div className="grid grid-cols-2 gap-3">
                <Choice
                  active={form.interest === "german"}
                  onClick={() => setForm((s) => ({ ...s, interest: "german" }))}
                  label="Γερμανικά"
                />
                <Choice
                  active={form.interest === "english"}
                  onClick={() => setForm((s) => ({ ...s, interest: "english" }))}
                  label="Αγγλικά"
                />
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-xs uppercase tracking-[0.2em] text-muted-light">
                Τρόπος μαθημάτων
              </legend>
              <div className="grid grid-cols-2 gap-3">
                <Choice
                  active={form.format === "private"}
                  onClick={() => setForm((s) => ({ ...s, format: "private" }))}
                  label="Ιδιαίτερα"
                />
                <Choice
                  active={form.format === "group"}
                  onClick={() => setForm((s) => ({ ...s, format: "group" }))}
                  label="Ομαδικά"
                />
              </div>
            </fieldset>

            <label className="block space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-light">
                Μήνυμα
              </span>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) =>
                  setForm((s) => ({ ...s, message: e.target.value }))
                }
                className="focus-ring w-full resize-y border border-cream/15 bg-ink/40 px-4 py-3 text-cream placeholder:text-cream/30"
                placeholder="Πες μας λίγα λόγια για το επίπεδό σου ή τον στόχο σου..."
              />
            </label>

            <Button type="submit" variant="primary" className="w-full" magnetic>
              Αποστολή μηνύματος
            </Button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs uppercase tracking-[0.2em] text-muted-light">
        {label}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="focus-ring w-full border border-cream/15 bg-ink/40 px-4 py-3 text-cream placeholder:text-cream/30"
      />
    </label>
  );
}

function Choice({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`focus-ring border px-4 py-3 text-sm transition ${
        active
          ? "border-gold/50 bg-wine/40 text-cream"
          : "border-cream/15 bg-transparent text-cream/70 hover:border-cream/30"
      }`}
    >
      {label}
    </button>
  );
}
