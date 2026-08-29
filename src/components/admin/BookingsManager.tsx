"use client";

import { useCallback, useMemo, useState } from "react";
import type { Booking } from "@prisma/client";
import {
  addBookingNoteAction,
  cancelBookingAction,
  confirmBookingAction,
  rescheduleBookingAction,
} from "@/app/admingermanika/actions/bookings";
import { PageHeader } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

type ViewMode = "day" | "week" | "month";

const DAY_NAMES = ["Κυρ", "Δευ", "Τρι", "Τετ", "Πεμ", "Παρ", "Σαβ"];

const statusLabels: Record<string, string> = {
  PENDING_HOLD: "⏳ Hold",
  CONFIRMED: "✓ Confirmed",
  CANCELLED: "✕ Cancelled",
  EXPIRED: "↻ Expired",
};

const languageLabels: Record<string, string> = {
  GERMAN: "🇩🇪 Γερμανικά",
  ENGLISH: "🇬🇧 Αγγλικά",
};

const typeLabels: Record<string, string> = {
  PRIVATE: "👤 Ιδιαίτερο",
  GROUP: "👥 Ομαδικό",
};

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return formatDate(d);
}

export function BookingsManager({ bookings }: { bookings: Booking[] }) {
  const [view, setView] = useState<ViewMode>("week");
  const [anchor, setAnchor] = useState(formatDate(new Date()));
  const [selected, setSelected] = useState<Booking | null>(null);
  const [note, setNote] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const visibleDates = useMemo(() => {
    if (view === "day") return [anchor];
    if (view === "week") {
      const d = new Date(anchor + "T12:00:00Z");
      const day = d.getUTCDay();
      const mondayOffset = day === 0 ? -6 : 1 - day;
      const start = addDays(anchor, mondayOffset);
      return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    }
    const [y, m] = anchor.split("-").map(Number);
    const last = new Date(Date.UTC(y, m, 0));
    const dates: string[] = [];
    for (let d = 1; d <= last.getUTCDate(); d++) {
      dates.push(formatDate(new Date(Date.UTC(y, m - 1, d))));
    }
    return dates;
  }, [anchor, view]);

  const bookingsByDate = useMemo(() => {
    const map = new Map<string, Booking[]>();
    for (const b of bookings) {
      const key = b.date.toISOString().slice(0, 10);
      const list = map.get(key) ?? [];
      list.push(b);
      map.set(key, list);
    }
    return map;
  }, [bookings]);

  const openBooking = (booking: Booking) => {
    setSelected(booking);
    setNote(booking.adminNote ?? "");
    setRescheduleDate(booking.date.toISOString().slice(0, 10));
    setRescheduleTime(booking.startTime);
  };

  const runAction = useCallback(
    async (action: () => Promise<{ ok: boolean; error?: string; message?: string }>) => {
      setBusy(true);
      setMessage(null);
      const result = await action();
      setBusy(false);
      if (result.ok) {
        setMessage(result.message ?? "OK");
        setSelected(null);
      } else {
        setMessage(result.error ?? "Σφάλμα");
      }
    },
    [],
  );

  return (
    <div>
      <PageHeader
        title="Bookings"
        description="Ημερολόγιο πρώτων συναντήσεων — day, week, month."
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(["day", "week", "month"] as ViewMode[]).map((v) => (
          <button
            key={v}
            type="button"
            className={cn("admin-btn", view === v ? "admin-btn-primary" : "admin-btn-ghost")}
            onClick={() => setView(v)}
          >
            {v === "day" ? "Day" : v === "week" ? "Week" : "Month"}
          </button>
        ))}
        <input
          type="date"
          value={anchor}
          onChange={(e) => setAnchor(e.target.value)}
          className="admin-input ml-auto"
        />
      </div>

      {message ? (
        <p className="mb-4 rounded-xl bg-[var(--admin-accent-soft)] px-4 py-2 text-sm">
          {message}
        </p>
      ) : null}

      <div
        className={cn(
          "admin-card overflow-x-auto p-3",
          view === "month" ? "grid grid-cols-7 gap-1" : "grid gap-2",
          view === "week" && "md:grid-cols-7",
        )}
      >
        {visibleDates.map((dateStr) => {
          const dayBookings = bookingsByDate.get(dateStr) ?? [];
          const d = new Date(dateStr + "T12:00:00Z");
          const dayNum = d.getUTCDate();
          const dayName = DAY_NAMES[d.getUTCDay()];

          return (
            <div
              key={dateStr}
              className={cn(
                "min-h-[100px] rounded-xl border border-[var(--admin-line)] p-2",
                view === "month" && "min-h-[80px] text-xs",
              )}
            >
              <p className="mb-2 text-xs font-bold text-[var(--admin-muted)]">
                {view !== "month" ? `${dayName} ${dayNum}` : dayNum}
              </p>
              <div className="space-y-1">
                {dayBookings.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => openBooking(b)}
                    className={cn(
                      "w-full rounded-lg px-2 py-1 text-left text-xs font-medium",
                      b.status === "CONFIRMED" && "bg-green-100 text-green-900",
                      b.status === "PENDING_HOLD" && "bg-yellow-100 text-yellow-900",
                      b.status === "CANCELLED" && "bg-gray-100 text-gray-600 line-through",
                      b.status === "EXPIRED" && "bg-gray-50 text-gray-400",
                    )}
                  >
                    {b.startTime} {b.name || "—"}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="Booking details"
        >
          <div className="admin-card max-h-[90vh] w-full max-w-lg overflow-y-auto p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <h3 className="admin-display text-xl">Λεπτομέρειες κράτησης</h3>
              <button
                type="button"
                className="admin-btn admin-btn-ghost"
                onClick={() => setSelected(null)}
              >
                ✕
              </button>
            </div>

            <dl className="space-y-2 text-sm">
              <div><dt className="text-[var(--admin-muted)]">Ονοματεπώνυμο</dt><dd className="font-medium">{selected.name || "—"}</dd></div>
              <div><dt className="text-[var(--admin-muted)]">Email</dt><dd>{selected.email || "—"}</dd></div>
              <div><dt className="text-[var(--admin-muted)]">Τηλέφωνο</dt><dd>{selected.phone || "—"}</dd></div>
              <div><dt className="text-[var(--admin-muted)]">Γλώσσα</dt><dd>{languageLabels[selected.language]}</dd></div>
              <div><dt className="text-[var(--admin-muted)]">Τύπος</dt><dd>{typeLabels[selected.lessonType]}</dd></div>
              <div><dt className="text-[var(--admin-muted)]">Ηλικιακή κατηγορία</dt><dd>{selected.ageGroup || "—"}</dd></div>
              <div><dt className="text-[var(--admin-muted)]">Επίπεδο</dt><dd>{selected.estimatedLevel || "—"}</dd></div>
              <div><dt className="text-[var(--admin-muted)]">Στόχος</dt><dd>{selected.goal || "—"}</dd></div>
              <div><dt className="text-[var(--admin-muted)]">Ημερομηνία</dt><dd>{selected.date.toISOString().slice(0, 10)} · {selected.startTime}</dd></div>
              <div><dt className="text-[var(--admin-muted)]">Μήνυμα</dt><dd>{selected.message || "—"}</dd></div>
              <div><dt className="text-[var(--admin-muted)]">Status</dt><dd>{statusLabels[selected.status]}</dd></div>
            </dl>

            <div className="mt-4 space-y-3">
              <label className="block text-sm">
                <span className="text-[var(--admin-muted)]">📝 Σημείωση</span>
                <textarea
                  className="admin-input mt-1 min-h-[80px] w-full"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </label>
              <button
                type="button"
                disabled={busy}
                className="admin-btn admin-btn-ghost w-full"
                onClick={() =>
                  runAction(() => addBookingNoteAction(selected.id, note))
                }
              >
                Αποθήκευση σημείωσης
              </button>

              {selected.status !== "CONFIRMED" && selected.status !== "CANCELLED" ? (
                <button
                  type="button"
                  disabled={busy}
                  className="admin-btn admin-btn-primary w-full"
                  onClick={() => runAction(() => confirmBookingAction(selected.id))}
                >
                  ✓ Confirm
                </button>
              ) : null}

              {selected.status !== "CANCELLED" ? (
                <button
                  type="button"
                  disabled={busy}
                  className="admin-btn admin-btn-ghost w-full text-red-700"
                  onClick={() => runAction(() => cancelBookingAction(selected.id))}
                >
                  ✕ Cancel
                </button>
              ) : null}

              <div className="rounded-xl border border-[var(--admin-line)] p-3">
                <p className="mb-2 text-sm font-medium">↻ Reschedule</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    type="date"
                    className="admin-input"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                  />
                  <input
                    type="time"
                    className="admin-input"
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  disabled={busy}
                  className="admin-btn admin-btn-accent mt-2 w-full"
                  onClick={() =>
                    runAction(() =>
                      rescheduleBookingAction(selected.id, rescheduleDate, rescheduleTime),
                    )
                  }
                >
                  Αναπρογραμματισμός
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
