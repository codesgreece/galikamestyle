"use client";

import { useEffect } from "react";

export function Toast({
  message,
  tone = "success",
  onDone,
}: {
  message: string | null;
  tone?: "success" | "error";
  onDone?: () => void;
}) {
  useEffect(() => {
    if (!message) return;
    const t = window.setTimeout(() => {
      onDone?.();
    }, 2800);
    return () => window.clearTimeout(t);
  }, [message, onDone]);

  if (!message) return null;

  return (
    <div
      key={message}
      role="status"
      className={`fixed bottom-5 right-5 z-[60] max-w-sm rounded-xl px-4 py-3 text-sm font-semibold shadow-lg ${
        tone === "success"
          ? "bg-[var(--admin-navy)] text-white"
          : "bg-[var(--admin-danger)] text-white"
      }`}
    >
      {message}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="admin-display text-3xl md:text-4xl">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-[var(--admin-muted)]">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="admin-card p-5">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--admin-muted)]">
        {label}
      </p>
      <p className="admin-display mt-3 text-3xl">{value}</p>
      {hint ? <p className="mt-2 text-sm text-[var(--admin-muted)]">{hint}</p> : null}
    </div>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="admin-card px-6 py-12 text-center">
      <p className="admin-display text-2xl">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-[var(--admin-muted)]">
        {description}
      </p>
    </div>
  );
}
