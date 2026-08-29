"use client";

import { useState } from "react";
import type { AvailabilitySchedule, AvailabilityRule, BlockedDate } from "@prisma/client";
import {
  addBlockedDateAction,
  deleteAvailabilityScheduleAction,
  removeBlockedDateAction,
  saveAvailabilityScheduleAction,
} from "@/app/admingermanika/actions/bookings";
import { PageHeader } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

const DAY_LABELS = [
  { value: 1, label: "Δευτέρα" },
  { value: 2, label: "Τρίτη" },
  { value: 3, label: "Τετάρτη" },
  { value: 4, label: "Πέμπτη" },
  { value: 5, label: "Παρασκευή" },
  { value: 6, label: "Σάββατο" },
  { value: 0, label: "Κυριακή" },
];

type ScheduleWithRules = AvailabilitySchedule & { rules: AvailabilityRule[] };

type RuleDraft = { dayOfWeek: number; startTime: string; endTime: string };

export function AvailabilityManager({
  schedules,
  blockedDates,
}: {
  schedules: ScheduleWithRules[];
  blockedDates: BlockedDate[];
}) {
  const [editing, setEditing] = useState<ScheduleWithRules | null>(
    schedules[0] ?? null,
  );
  const [name, setName] = useState(editing?.name ?? "Default");
  const [isActive, setIsActive] = useState(editing?.isActive ?? true);
  const [rules, setRules] = useState<RuleDraft[]>(
    editing?.rules.map((r) => ({
      dayOfWeek: r.dayOfWeek,
      startTime: r.startTime,
      endTime: r.endTime,
    })) ?? [{ dayOfWeek: 1, startTime: "16:00", endTime: "20:00" }],
  );
  const [blockDate, setBlockDate] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const addRule = () => {
    setRules((prev) => [...prev, { dayOfWeek: 1, startTime: "16:00", endTime: "20:00" }]);
  };

  const updateRule = (index: number, patch: Partial<RuleDraft>) => {
    setRules((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  };

  const removeRule = (index: number) => {
    setRules((prev) => prev.filter((_, i) => i !== index));
  };

  const saveSchedule = async () => {
    setBusy(true);
    setMessage(null);
    const fd = new FormData();
    fd.set("name", name);
    fd.set("isActive", String(isActive));
    fd.set("rules", JSON.stringify(rules));
    const result = await saveAvailabilityScheduleAction(editing?.id ?? null, fd);
    setBusy(false);
    setMessage(result.ok ? "Αποθηκεύτηκε!" : result.error);
  };

  const blockDay = async () => {
    if (!blockDate) return;
    setBusy(true);
    const fd = new FormData();
    fd.set("date", blockDate);
    fd.set("reason", blockReason);
    const result = await addBlockedDateAction(fd);
    setBusy(false);
    setMessage(result.ok ? "Η ημερομηνία μπλοκάρεται." : result.error);
    if (result.ok) {
      setBlockDate("");
      setBlockReason("");
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Availability"
        description="Διαθέσιμες ημέρες, ώρες και αποκλεισμένες ημερομηνίες."
      />

      {message ? (
        <p className="rounded-xl bg-[var(--admin-accent-soft)] px-4 py-2 text-sm">{message}</p>
      ) : null}

      <section className="admin-card p-5">
        <h2 className="admin-display mb-4 text-xl">Πρόγραμμα διαθεσιμότητας</h2>

        {schedules.length > 1 ? (
          <div className="mb-4 flex flex-wrap gap-2">
            {schedules.map((s) => (
              <button
                key={s.id}
                type="button"
                className={cn(
                  "admin-btn",
                  editing?.id === s.id ? "admin-btn-primary" : "admin-btn-ghost",
                )}
                onClick={() => {
                  setEditing(s);
                  setName(s.name);
                  setIsActive(s.isActive);
                  setRules(
                    s.rules.map((r) => ({
                      dayOfWeek: r.dayOfWeek,
                      startTime: r.startTime,
                      endTime: r.endTime,
                    })),
                  );
                }}
              >
                {s.name}
              </button>
            ))}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            Όνομα
            <input
              className="admin-input mt-1 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Ενεργό
          </label>
        </div>

        <div className="mt-4 space-y-3">
          {rules.map((rule, i) => (
            <div key={i} className="grid gap-2 rounded-xl border border-[var(--admin-line)] p-3 sm:grid-cols-4">
              <select
                className="admin-input"
                value={rule.dayOfWeek}
                onChange={(e) => updateRule(i, { dayOfWeek: Number(e.target.value) })}
              >
                {DAY_LABELS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
              <input
                type="time"
                className="admin-input"
                value={rule.startTime}
                onChange={(e) => updateRule(i, { startTime: e.target.value })}
              />
              <input
                type="time"
                className="admin-input"
                value={rule.endTime}
                onChange={(e) => updateRule(i, { endTime: e.target.value })}
              />
              <button
                type="button"
                className="admin-btn admin-btn-ghost"
                onClick={() => removeRule(i)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="admin-btn admin-btn-ghost" onClick={addRule}>
            + Κανόνας
          </button>
          <button
            type="button"
            disabled={busy}
            className="admin-btn admin-btn-primary"
            onClick={saveSchedule}
          >
            Αποθήκευση
          </button>
          {editing ? (
            <button
              type="button"
              disabled={busy}
              className="admin-btn admin-btn-ghost text-red-700"
              onClick={async () => {
                if (!confirm("Διαγραφή προγράμματος;")) return;
                await deleteAvailabilityScheduleAction(editing.id);
              }}
            >
              Διαγραφή
            </button>
          ) : null}
        </div>
      </section>

      <section className="admin-card p-5">
        <h2 className="admin-display mb-4 text-xl">Αποκλεισμένες ημερομηνίες</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <input
            type="date"
            className="admin-input"
            value={blockDate}
            onChange={(e) => setBlockDate(e.target.value)}
          />
          <input
            type="text"
            className="admin-input sm:col-span-2"
            placeholder="Λόγος (προαιρετικά)"
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
          />
        </div>
        <button
          type="button"
          disabled={busy || !blockDate}
          className="admin-btn admin-btn-accent mt-3"
          onClick={blockDay}
        >
          Block date
        </button>

        <ul className="mt-4 divide-y divide-[var(--admin-line)]">
          {blockedDates.length === 0 ? (
            <li className="py-3 text-sm text-[var(--admin-muted)]">Καμία αποκλεισμένη ημερομηνία.</li>
          ) : (
            blockedDates.map((bd) => (
              <li key={bd.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div>
                  <span className="font-medium">{bd.date.toISOString().slice(0, 10)}</span>
                  {bd.reason ? (
                    <span className="ml-2 text-[var(--admin-muted)]">— {bd.reason}</span>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="admin-btn admin-btn-ghost text-red-700"
                  onClick={() => removeBlockedDateAction(bd.id)}
                >
                  ✕
                </button>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
