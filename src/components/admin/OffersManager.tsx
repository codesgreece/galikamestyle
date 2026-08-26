"use client";

import { useMemo, useState, useTransition } from "react";
import { deleteOfferAction, saveOfferAction } from "@/app/admingermanika/actions/offers";
import { Toast } from "@/components/admin/ui";

export type OfferFormModel = {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  currentPrice: number;
  billingPeriod: string;
  isActive: boolean;
  badgeText: string | null;
  startDate: string;
  endDate: string;
  sortOrder: number;
  accent: "navy" | "paper";
};

function toDateInput(value: Date | string | null | undefined) {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export function OffersManager({
  initialOffers,
}: {
  initialOffers: Array<{
    id: string;
    title: string;
    description: string;
    originalPrice: number;
    currentPrice: number;
    billingPeriod: string;
    isActive: boolean;
    badgeText: string | null;
    startDate: Date | null;
    endDate: Date | null;
    sortOrder: number;
    accent: string;
  }>;
}) {
  const [offers] = useState<OfferFormModel[]>(
    initialOffers.map((o) => ({
      id: o.id,
      title: o.title,
      description: o.description,
      originalPrice: o.originalPrice,
      currentPrice: o.currentPrice,
      billingPeriod: o.billingPeriod,
      isActive: o.isActive,
      badgeText: o.badgeText,
      startDate: toDateInput(o.startDate),
      endDate: toDateInput(o.endDate),
      sortOrder: o.sortOrder,
      accent: o.accent === "paper" ? "paper" : "navy",
    })),
  );
  const [selectedId, setSelectedId] = useState<string | "new">(
    offers[0]?.id ?? "new",
  );
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const selected = useMemo(() => {
    if (selectedId === "new") {
      return {
        id: "",
        title: "",
        description: "",
        originalPrice: 100,
        currentPrice: 90,
        billingPeriod: "8 ώρες / μήνα",
        isActive: true,
        badgeText: "Προσφορά",
        startDate: "",
        endDate: "",
        sortOrder: offers.length,
        accent: "navy" as const,
      };
    }
    return offers.find((o) => o.id === selectedId) ?? offers[0];
  }, [offers, selectedId]);

  const [draft, setDraft] = useState<OfferFormModel | null>(null);
  const form = draft && draft.id === (selected?.id ?? "") ? draft : selected;

  if (!form) {
    return <p>Δεν υπάρχουν προσφορές ακόμα.</p>;
  }

  const update = <K extends keyof OfferFormModel>(key: K, value: OfferFormModel[K]) => {
    setDraft({ ...form, [key]: value });
  };

  const onSave = () => {
    setError(null);
    const fd = new FormData();
    fd.set("title", form.title);
    fd.set("description", form.description);
    fd.set("originalPrice", String(form.originalPrice));
    fd.set("currentPrice", String(form.currentPrice));
    fd.set("billingPeriod", form.billingPeriod);
    fd.set("isActive", form.isActive ? "true" : "false");
    fd.set("badgeText", form.badgeText ?? "");
    fd.set("startDate", form.startDate);
    fd.set("endDate", form.endDate);
    fd.set("sortOrder", String(form.sortOrder));
    fd.set("accent", form.accent);

    startTransition(async () => {
      const result = await saveOfferAction(form.id || null, fd);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setToast(result.message ?? "Αποθηκεύτηκε");
      setDraft(null);
      window.location.reload();
    });
  };

  const onDelete = () => {
    if (!form.id) return;
    if (!window.confirm("Σίγουρα θέλεις να διαγράψεις αυτή την προσφορά;")) return;
    startTransition(async () => {
      const result = await deleteOfferAction(form.id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setToast(result.message ?? "Διαγράφηκε");
      window.location.reload();
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="admin-card p-3">
        <button
          type="button"
          className="admin-btn admin-btn-accent mb-3 w-full"
          onClick={() => {
            setSelectedId("new");
            setDraft(null);
          }}
        >
          + Νέα προσφορά
        </button>
        <ul className="space-y-1">
          {offers.map((offer) => (
            <li key={offer.id}>
              <button
                type="button"
                onClick={() => {
                  setSelectedId(offer.id);
                  setDraft(null);
                }}
                className={`w-full rounded-xl px-3 py-3 text-left transition ${
                  selectedId === offer.id
                    ? "bg-[var(--admin-accent-soft)]"
                    : "hover:bg-black/[0.03]"
                }`}
              >
                <p className="font-semibold">{offer.title}</p>
                <p className="text-xs text-[var(--admin-muted)]">
                  {offer.currentPrice}€ · {offer.isActive ? "Ενεργή" : "Ανενεργή"}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-5">
        <div className="admin-card p-5 md:p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Τίτλος">
              <input
                className="admin-input"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
              />
            </Field>
            <Field label="Badge">
              <input
                className="admin-input"
                value={form.badgeText ?? ""}
                onChange={(e) => update("badgeText", e.target.value)}
              />
            </Field>
            <Field label="Περιγραφή" className="md:col-span-2">
              <textarea
                className="admin-input min-h-24"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
              />
            </Field>
            <Field label="Αρχική τιμή (€)">
              <input
                type="number"
                step="0.01"
                className="admin-input"
                value={form.originalPrice}
                onChange={(e) => update("originalPrice", Number(e.target.value))}
              />
            </Field>
            <Field label="Τρέχουσα τιμή (€)">
              <input
                type="number"
                step="0.01"
                className="admin-input"
                value={form.currentPrice}
                onChange={(e) => update("currentPrice", Number(e.target.value))}
              />
            </Field>
            <Field label="Περίοδος / billing text" className="md:col-span-2">
              <input
                className="admin-input"
                value={form.billingPeriod}
                onChange={(e) => update("billingPeriod", e.target.value)}
              />
            </Field>
            <Field label="Έναρξη">
              <input
                type="date"
                className="admin-input"
                value={form.startDate}
                onChange={(e) => update("startDate", e.target.value)}
              />
            </Field>
            <Field label="Λήξη">
              <input
                type="date"
                className="admin-input"
                value={form.endDate}
                onChange={(e) => update("endDate", e.target.value)}
              />
            </Field>
            <Field label="Σειρά εμφάνισης">
              <input
                type="number"
                className="admin-input"
                value={form.sortOrder}
                onChange={(e) => update("sortOrder", Number(e.target.value))}
              />
            </Field>
            <Field label="Στυλ κάρτας">
              <select
                className="admin-input"
                value={form.accent}
                onChange={(e) =>
                  update("accent", e.target.value === "paper" ? "paper" : "navy")
                }
              >
                <option value="navy">Navy (Solo)</option>
                <option value="paper">Paper (Team)</option>
              </select>
            </Field>
            <label className="flex items-center gap-3 md:col-span-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => update("isActive", e.target.checked)}
              />
              <span className="text-sm font-medium">Ενεργή προσφορά</span>
            </label>
          </div>

          {error ? (
            <p className="mt-4 rounded-xl bg-[#fdecea] px-3 py-2 text-sm text-[var(--admin-danger)]">
              {error}
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              disabled={pending}
              onClick={onSave}
            >
              {pending ? "Αποθήκευση…" : "Αποθήκευση"}
            </button>
            {form.id ? (
              <button
                type="button"
                className="admin-btn admin-btn-danger"
                disabled={pending}
                onClick={onDelete}
              >
                Διαγραφή
              </button>
            ) : null}
          </div>
        </div>

        <div className="admin-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--admin-muted)]">
            Preview
          </p>
          <article
            className={`mt-4 rounded-[1.5rem] border-[3px] border-[#1a1433] p-5 ${
              form.accent === "navy"
                ? "bg-[#12103a] text-[#fff8eb] shadow-[6px_6px_0_#ff5d7a]"
                : "bg-[#fffdf8] text-[#1a1433] shadow-[6px_6px_0_#3d8bff]"
            }`}
          >
            {form.badgeText ? (
              <span className="inline-block rounded-full border-2 border-[#1a1433] bg-[#ffe14a] px-2.5 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-wide text-[#1a1433]">
                {form.badgeText}
              </span>
            ) : null}
            <h3 className="mt-3 text-2xl font-bold">{form.title || "Τίτλος"}</h3>
            <p className="mt-1 text-sm opacity-70">{form.billingPeriod}</p>
            <div className="mt-3 flex items-end gap-2">
              <p className="text-4xl font-bold">{form.currentPrice}€</p>
              <p className="pb-1 text-sm line-through opacity-40">
                {form.originalPrice}€
              </p>
            </div>
            <p className="mt-3 max-w-md text-sm opacity-80">
              {form.description || "Περιγραφή προσφοράς"}
            </p>
          </article>
        </div>
      </div>

      <Toast message={toast} onDone={() => setToast(null)} />
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="admin-label">{label}</span>
      {children}
    </label>
  );
}
