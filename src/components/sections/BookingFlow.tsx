"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, DropWords } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { useJourney } from "@/components/providers/JourneyProvider";
import { unlockAchievement } from "@/data/achievements";
import { formatGreekShortDate } from "@/lib/timezone";

type Step = "language" | "format" | "date" | "time" | "details" | "confirmed";

type Slot = { time: string; status: string };

const STEPS: Step[] = ["language", "format", "date", "time", "details"];

const goalLabels: Record<string, string> = {
  travel: "Ταξίδι",
  certificate: "Πτυχίο",
  germany: "Γερμανία",
  curious: "Μάθηση",
};

export function BookingFlow() {
  const journey = useJourney();
  const [step, setStep] = useState<Step>("language");
  const [language, setLanguage] = useState<"GERMAN" | "ENGLISH" | null>(null);
  const [lessonType, setLessonType] = useState<"PRIVATE" | "GROUP" | null>(null);
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [holdToken, setHoldToken] = useState<string | null>(null);
  const [holdExpiresAt, setHoldExpiresAt] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<{
    date: string;
    startTime: string;
    language: string;
    lessonType: string;
    name: string;
  } | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    ageGroup: "",
    estimatedLevel: journey.estimatedLevel ?? "",
    goal: journey.selectedGoal ? goalLabels[journey.selectedGoal] ?? "" : "",
    message: "",
  });

  const holdRef = useRef<string | null>(null);
  const stepIndex = step === "confirmed" ? 5 : STEPS.indexOf(step as (typeof STEPS)[number]) + 1;

  useEffect(() => {
    if (step === "date" && dates.length === 0) {
      fetch("/api/booking/dates")
        .then((r) => r.json())
        .then((d) => setDates(d.dates ?? []))
        .catch(() => setDates([]));
    }
  }, [step, dates.length]);

  useEffect(() => {
    if (selectedDate && (step === "time" || step === "details")) {
      fetch(`/api/booking/slots?date=${selectedDate}`)
        .then((r) => r.json())
        .then((d) => setSlots(d.slots ?? []))
        .catch(() => setSlots([]));
    }
  }, [selectedDate, step]);

  useEffect(() => {
    if (!holdExpiresAt) return;
    const tick = () => {
      const diff = holdExpiresAt.getTime() - Date.now();
      if (diff <= 0) {
        setCountdown("00:00");
        setError("Το χρονικό όριο έληξε. Επίλεξε ξανά ώρα.");
        setHoldToken(null);
        holdRef.current = null;
        setStep("time");
        return;
      }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown(`${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [holdExpiresAt]);

  const startBooking = useCallback(async () => {
    await fetch("/api/booking/start", { method: "POST" });
  }, []);

  const createHold = useCallback(async (time: string) => {
    if (!selectedDate || !language || !lessonType) return;
    setLoading(true);
    setError(null);

    if (holdRef.current) {
      await fetch("/api/booking/release", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ holdToken: holdRef.current }),
      });
      holdRef.current = null;
    }

    const res = await fetch("/api/booking/hold", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: selectedDate,
        startTime: time,
        language,
        lessonType,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Η ώρα δεν είναι διαθέσιμη.");
      return;
    }

    setHoldToken(data.holdToken);
    holdRef.current = data.holdToken;
    setHoldExpiresAt(new Date(data.expiresAt));
    setStep("details");
  }, [selectedDate, language, lessonType]);

  const confirmBooking = async () => {
    if (!holdToken) return;
    setLoading(true);
    setError(null);

    const res = await fetch("/api/booking/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        holdToken,
        ...form,
        estimatedLevel: form.estimatedLevel || undefined,
        goal: form.goal || undefined,
        message: form.message || undefined,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Αποτυχία επιβεβαίωσης.");
      return;
    }

    holdRef.current = null;
    unlockAchievement("booking-ready");
    setConfirmed(data.booking);
    setStep("confirmed");
  };

  const goBack = () => {
    setError(null);
    if (step === "format") setStep("language");
    else if (step === "date") setStep("format");
    else if (step === "time") setStep("date");
    else if (step === "details") {
      if (holdRef.current) {
        fetch("/api/booking/release", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ holdToken: holdRef.current }),
        });
        holdRef.current = null;
        setHoldToken(null);
        setHoldExpiresAt(null);
      }
      setStep("time");
    }
  };

  const calendarUrl = confirmed
    ? (() => {
        const start = `${confirmed.date.replace(/-/g, "")}T${confirmed.startTime.replace(":", "")}00`;
        const endHour = String(Number(confirmed.startTime.split(":")[0]) + 1).padStart(2, "0");
        const end = `${confirmed.date.replace(/-/g, "")}T${endHour}${confirmed.startTime.split(":")[1]}00`;
        const title = encodeURIComponent("Πρώτη συνάντηση — Γερμανικά με Στυλ");
        const details = encodeURIComponent(
          "Πρώτη γνωριμία και καθορισμός προγράμματος μαθημάτων με τη Βιργινία Πανάκη.",
        );
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&ctz=Europe/Athens`;
      })()
    : "";

  return (
    <section id="booking" className="relative overflow-hidden bg-paper">
      <div className="container-shell section-pad">
        <Reveal>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-coral">
            First session
          </p>
        </Reveal>
        <h2 className="section-title font-display">
          <DropWords text="Πάμε να γνωριστούμε;" /> <span>👋</span>
        </h2>
        <Reveal delay={0.1}>
          <p className="mt-3 max-w-xl text-ink/70">
            Η πρώτη συνάντηση είναι η αρχή. Εκεί θα γνωριστείτε, θα συζητήσετε τους στόχους σου
            και θα βρείτε μαζί το πρόγραμμα που σου ταιριάζει.
          </p>
        </Reveal>

        <div className="section-stack mx-auto max-w-2xl">
          {step !== "confirmed" ? (
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-muted">
                {stepIndex} / 5
              </p>
              {step !== "language" ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="focus-ring text-sm font-bold text-blue underline-offset-2 hover:underline"
                >
                  ← Πίσω
                </button>
              ) : null}
            </div>
          ) : null}

          {error ? (
            <p className="rounded-2xl border-2 border-coral bg-coral/10 px-4 py-3 text-sm font-bold text-coral">
              {error}
            </p>
          ) : null}

          <div className="rounded-[1.5rem] border-[3px] border-ink bg-cream p-5 shadow-[6px_6px_0_#1a1433] sm:p-6">
            <AnimatePresence mode="wait">
              {step === "language" ? (
                <motion.div key="language" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                  <p className="font-display text-xl">Τι θέλεις να μάθεις;</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {[
                      { v: "GERMAN" as const, label: "🇩🇪 Γερμανικά" },
                      { v: "ENGLISH" as const, label: "🇬🇧 Αγγλικά" },
                    ].map((opt) => (
                      <button
                        key={opt.v}
                        type="button"
                        onClick={() => {
                          startBooking();
                          setLanguage(opt.v);
                          setStep("format");
                        }}
                        className="focus-ring rounded-2xl border-[3px] border-ink bg-yellow px-4 py-4 text-left font-bold shadow-[4px_4px_0_#1a1433] transition hover:-translate-y-0.5"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : null}

              {step === "format" ? (
                <motion.div key="format" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                  <p className="font-display text-xl">Πώς προτιμάς να ξεκινήσεις;</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {[
                      { v: "PRIVATE" as const, label: "👤 Ιδιαίτερο" },
                      { v: "GROUP" as const, label: "👥 Ομαδικό" },
                    ].map((opt) => (
                      <button
                        key={opt.v}
                        type="button"
                        onClick={() => {
                          setLessonType(opt.v);
                          setStep("date");
                        }}
                        className="focus-ring rounded-2xl border-[3px] border-ink bg-paper px-4 py-4 text-left font-bold shadow-[4px_4px_0_#1a1433] transition hover:-translate-y-0.5"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : null}

              {step === "date" ? (
                <motion.div key="date" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                  <p className="font-display text-xl">Διάλεξε ημερομηνία</p>
                  {dates.length === 0 ? (
                    <p className="mt-4 text-sm text-muted">Φόρτωση διαθέσιμων ημερομηνιών...</p>
                  ) : (
                    <div className="mt-4 grid max-h-64 gap-2 overflow-y-auto sm:grid-cols-2">
                      {dates.map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => {
                            setSelectedDate(d);
                            setStep("time");
                          }}
                          className="focus-ring rounded-xl border-2 border-ink bg-cream px-3 py-2 text-left text-sm font-bold hover:bg-yellow"
                        >
                          {formatGreekShortDate(d)}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : null}

              {step === "time" ? (
                <motion.div key="time" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                  <p className="font-display text-xl">Ποια ώρα σε βολεύει;</p>
                  <p className="mt-1 text-sm text-muted">
                    {selectedDate ? formatGreekShortDate(selectedDate) : ""}
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {slots
                      .filter((s) => s.status === "AVAILABLE")
                      .map((s) => (
                        <button
                          key={s.time}
                          type="button"
                          disabled={loading}
                          onClick={() => createHold(s.time)}
                          className="focus-ring rounded-xl border-2 border-ink bg-green/30 px-3 py-2 text-sm font-extrabold hover:bg-green"
                        >
                          {s.time}
                        </button>
                      ))}
                  </div>
                  {slots.filter((s) => s.status === "AVAILABLE").length === 0 ? (
                    <p className="mt-4 text-sm text-muted">Δεν υπάρχουν διαθέσιμες ώρες αυτή την ημέρα.</p>
                  ) : null}
                </motion.div>
              ) : null}

              {step === "details" ? (
                <motion.div key="details" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                  <div className="mb-4 rounded-xl bg-yellow/40 px-4 py-3">
                    <p className="font-bold">Κρατήσαμε τη θέση σου! ⏳</p>
                    <p className="text-sm">Έχεις 5 λεπτά για να ολοκληρώσεις την κράτηση.</p>
                    <p className="mt-1 font-display text-2xl tabular-nums">{countdown}</p>
                  </div>

                  <p className="font-display text-xl">Τα στοιχεία σου</p>
                  <div className="mt-4 space-y-3">
                    {[
                      { key: "name", label: "Ονοματεπώνυμο", type: "text" },
                      { key: "email", label: "Email", type: "email" },
                      { key: "phone", label: "Τηλέφωνο", type: "tel" },
                      { key: "ageGroup", label: "Ηλικία / ηλικιακή κατηγορία", type: "text" },
                      { key: "estimatedLevel", label: "Ενδεικτικό επίπεδο", type: "text" },
                      { key: "goal", label: "Στόχος", type: "text" },
                    ].map((field) => (
                      <label key={field.key} className="block text-sm">
                        <span className="font-bold">{field.label}</span>
                        <input
                          type={field.type}
                          required={field.key === "name" || field.key === "email" || field.key === "phone" || field.key === "ageGroup"}
                          className="focus-ring mt-1 w-full rounded-xl border-2 border-ink bg-paper px-3 py-2"
                          value={form[field.key as keyof typeof form]}
                          onChange={(e) =>
                            setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                          }
                        />
                      </label>
                    ))}
                    <label className="block text-sm">
                      <span className="font-bold">Μήνυμα / Σημειώσεις</span>
                      <textarea
                        className="focus-ring mt-1 min-h-[80px] w-full rounded-xl border-2 border-ink bg-paper px-3 py-2"
                        value={form.message}
                        onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                      />
                    </label>
                  </div>
                  <Button
                    variant="primary"
                    className="mt-4 w-full"
                    onClick={loading ? undefined : confirmBooking}
                  >
                    {loading ? "Αποστολή..." : "Ολοκλήρωση κράτησης →"}
                  </Button>
                </motion.div>
              ) : null}

              {step === "confirmed" && confirmed ? (
                <motion.div key="confirmed" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <p className="font-display text-3xl">Έτοιμο! 🎉</p>
                  <p className="mt-2 text-ink/70">
                    Η πρώτη σου συνάντηση με τη Βιργινία είναι κλεισμένη.
                  </p>
                  <div className="mt-4 space-y-2 rounded-2xl border-[3px] border-ink bg-yellow/30 p-4 text-sm font-bold">
                    <p>{confirmed.language === "GERMAN" ? "🇩🇪 Γερμανικά" : "🇬🇧 Αγγλικά"}</p>
                    <p>{confirmed.lessonType === "PRIVATE" ? "👤 Ιδιαίτερο" : "👥 Ομαδικό"}</p>
                    <p>📅 {formatGreekShortDate(confirmed.date)}</p>
                    <p>🕕 {confirmed.startTime}</p>
                  </div>
                  <p className="mt-4 text-sm text-ink/60">
                    Η συνάντηση αφορά την πρώτη γνωριμία και τον καθορισμό του κατάλληλου
                    προγράμματος μαθημάτων.
                  </p>
                  <a
                    href={calendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring mt-4 inline-flex rounded-2xl border-[3px] border-ink bg-blue px-4 py-2 text-sm font-bold text-paper"
                  >
                    Προσθήκη στο ημερολόγιο
                  </a>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
