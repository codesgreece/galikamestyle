"use client";

import { FormEvent, useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ContactPreset } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/config";
import { goalLabels } from "@/data/goals";
import { useJourney } from "@/components/providers/JourneyProvider";

type FormState = {
  name: string;
  phone: string;
  email: string;
  interest: "german" | "english";
  format: "private" | "group";
  message: string;
};

function createForm(preset?: Partial<ContactPreset>): FormState {
  return {
    name: "",
    phone: "",
    email: "",
    interest: preset?.interest ?? "german",
    format: preset?.format ?? "private",
    message: "",
  };
}

export function ContactModal({
  open,
  onClose,
  preset,
}: {
  open: boolean;
  onClose: () => void;
  preset?: Partial<ContactPreset>;
}) {
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
          key={`${preset?.interest}-${preset?.format}-${preset?.estimatedLevel}-${preset?.goal}`}
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
  const journey = useJourney();
  const merged: Partial<ContactPreset> = {
    interest: preset?.interest ?? journey.selectedLanguage ?? "german",
    format: preset?.format ?? "private",
    goal: preset?.goal ?? journey.selectedGoal ?? undefined,
    estimatedLevel: preset?.estimatedLevel ?? journey.estimatedLevel ?? undefined,
    testScore: preset?.testScore ?? journey.testScore ?? undefined,
    battleResult: preset?.battleResult ?? journey.battleResult ?? undefined,
  };
  const [form, setForm] = useState(() => createForm(merged));
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.info("[contact-form]", {
      ...form,
      journey: merged,
      source: siteConfig.name,
    });
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
        className="absolute inset-0 bg-navy/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 max-h-[92vh] w-full overflow-y-auto border-[3px] border-ink bg-cream shadow-[10px_10px_0_#1a1433] sm:max-w-xl sm:rounded-3xl"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <div className="flex items-start justify-between gap-4 border-b-[3px] border-ink px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral">
              Πάμε να γνωριστούμε
            </p>
            <h2 id={titleId} className="font-display mt-1 text-3xl">
              Ένα μήνυμα μακριά
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="focus-ring rounded-xl border-2 border-ink bg-yellow p-2"
            aria-label="Κλείσιμο"
          >
            <X size={18} />
          </button>
        </div>

        {(merged.goal || merged.estimatedLevel || merged.interest) && (
          <div className="mx-6 mt-5 grid gap-2 rounded-2xl border-2 border-ink bg-yellow/50 p-4 text-sm">
            {merged.goal ? (
              <p>
                <span className="font-extrabold">Ο στόχος σου: </span>
                {goalLabels[merged.goal]}
              </p>
            ) : null}
            <p>
              <span className="font-extrabold">Γλώσσα: </span>
              {merged.interest === "english" ? "🇬🇧 Αγγλικά" : "🇩🇪 Γερμανικά"}
            </p>
            {merged.estimatedLevel ? (
              <p>
                <span className="font-extrabold">Ενδεικτικό επίπεδο: </span>
                {merged.estimatedLevel}
                {typeof merged.testScore === "number"
                  ? ` · ${merged.testScore}/8`
                  : ""}
              </p>
            ) : null}
          </div>
        )}

        {submitted ? (
          <div className="space-y-4 px-6 py-10">
            <p className="font-display text-3xl">Ωραίααα! 🎉</p>
            <p className="text-ink/70">
              Το μήνυμα καταχωρήθηκε με το journey σου. Η Βιργινία θα
              επικοινωνήσει σύντομα.
            </p>
            <Button variant="yellow" onClick={onClose}>
              Κλείσιμο
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4 px-6 py-6">
            <Field
              label="Ονοματεπώνυμο"
              required
              value={form.name}
              onChange={(v) => setForm((s) => ({ ...s, name: v }))}
            />
            <div className="grid gap-4 sm:grid-cols-2">
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
              <legend className="mb-2 text-xs font-bold uppercase tracking-[0.16em]">
                Ενδιαφέρομαι για
              </legend>
              <div className="grid grid-cols-2 gap-2">
                <Choice
                  active={form.interest === "german"}
                  label="Γερμανικά"
                  onClick={() => setForm((s) => ({ ...s, interest: "german" }))}
                />
                <Choice
                  active={form.interest === "english"}
                  label="Αγγλικά"
                  onClick={() => setForm((s) => ({ ...s, interest: "english" }))}
                />
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-2 text-xs font-bold uppercase tracking-[0.16em]">
                Mode
              </legend>
              <div className="grid grid-cols-2 gap-2">
                <Choice
                  active={form.format === "private"}
                  label="Solo"
                  onClick={() => setForm((s) => ({ ...s, format: "private" }))}
                />
                <Choice
                  active={form.format === "group"}
                  label="Team"
                  onClick={() => setForm((s) => ({ ...s, format: "group" }))}
                />
              </div>
            </fieldset>
            <label className="block space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.16em]">
                Μήνυμα
              </span>
              <textarea
                rows={3}
                value={form.message}
                onChange={(e) =>
                  setForm((s) => ({ ...s, message: e.target.value }))
                }
                className="focus-ring w-full rounded-2xl border-2 border-ink bg-paper px-4 py-3"
                placeholder="Πες μας τον στόχο σου..."
              />
            </label>
            <Button type="submit" variant="primary" className="w-full">
              Αποστολή →
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
      <span className="text-xs font-bold uppercase tracking-[0.16em]">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="focus-ring w-full rounded-2xl border-2 border-ink bg-paper px-4 py-3"
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
      className={`focus-ring rounded-2xl border-2 border-ink px-3 py-3 text-sm font-bold transition ${
        active ? "bg-yellow shadow-[3px_3px_0_#1a1433]" : "bg-paper"
      }`}
    >
      {label}
    </button>
  );
}
