"use client";

import { useState, useTransition } from "react";
import {
  changePasswordAction,
  updateProfileAction,
} from "@/app/admingermanika/actions/settings";
import { Toast } from "@/components/admin/ui";
import { siteConfig } from "@/lib/config";

export function SettingsForms({
  user,
}: {
  user: { name: string; email: string };
}) {
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form
        className="admin-card space-y-4 p-5 md:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          const fd = new FormData(e.currentTarget);
          startTransition(async () => {
            const result = await updateProfileAction(fd);
            if (!result.ok) {
              setError(result.error);
              return;
            }
            setToast(result.message ?? "Αποθηκεύτηκε");
          });
        }}
      >
        <h2 className="admin-display text-2xl">Προφίλ</h2>
        <label className="block">
          <span className="admin-label">Όνομα εμφάνισης</span>
          <input
            name="name"
            className="admin-input"
            defaultValue={user.name}
            required
          />
        </label>
        <label className="block">
          <span className="admin-label">Email / username</span>
          <input
            name="email"
            type="email"
            className="admin-input"
            defaultValue={user.email}
            required
          />
        </label>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={pending}>
          {pending ? "Αποθήκευση…" : "Αποθήκευση προφίλ"}
        </button>
      </form>

      <form
        className="admin-card space-y-4 p-5 md:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          const fd = new FormData(e.currentTarget);
          startTransition(async () => {
            const result = await changePasswordAction(fd);
            if (!result.ok) {
              setError(result.error);
              return;
            }
            setToast(result.message ?? "Ο κωδικός άλλαξε");
            e.currentTarget.reset();
          });
        }}
      >
        <h2 className="admin-display text-2xl">Αλλαγή κωδικού</h2>
        <label className="block">
          <span className="admin-label">Τρέχων κωδικός</span>
          <input
            name="currentPassword"
            type="password"
            className="admin-input"
            required
            autoComplete="current-password"
          />
        </label>
        <label className="block">
          <span className="admin-label">Νέος κωδικός</span>
          <input
            name="newPassword"
            type="password"
            className="admin-input"
            required
            minLength={10}
            autoComplete="new-password"
          />
        </label>
        <label className="block">
          <span className="admin-label">Επιβεβαίωση νέου κωδικού</span>
          <input
            name="confirmPassword"
            type="password"
            className="admin-input"
            required
            minLength={10}
            autoComplete="new-password"
          />
        </label>
        <button type="submit" className="admin-btn admin-btn-accent" disabled={pending}>
          {pending ? "Αποθήκευση…" : "Αλλαγή κωδικού"}
        </button>
      </form>

      <section className="admin-card space-y-2 p-5 md:p-6 lg:col-span-2">
        <h2 className="admin-display text-2xl">Πληροφορίες website</h2>
        <p className="text-sm text-[var(--admin-muted)]">
          Τα επικοινωνιακά στοιχεία και τα CTA επεξεργάζονται από τη σελίδα
          «Περιεχόμενο Site». Το brand name παραμένει σταθερό για συνέπεια.
        </p>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-[var(--admin-muted)]">Site</dt>
            <dd className="font-medium">{siteConfig.name}</dd>
          </div>
          <div>
            <dt className="text-[var(--admin-muted)]">Teacher</dt>
            <dd className="font-medium">{siteConfig.teacher}</dd>
          </div>
        </dl>
      </section>

      {error ? (
        <p className="rounded-xl bg-[#fdecea] px-3 py-2 text-sm text-[var(--admin-danger)] lg:col-span-2">
          {error}
        </p>
      ) : null}

      <Toast message={toast} onDone={() => setToast(null)} />
    </div>
  );
}
