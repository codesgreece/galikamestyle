"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admingermanika/actions/auth";
import type { ActionResult } from "@/validations";

const initial: ActionResult | undefined = undefined;

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(loginAction, initial);

  return (
    <div className="admin-root flex min-h-screen items-center justify-center px-4 py-10">
      <div className="admin-card w-full max-w-md p-7 md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--admin-muted)]">
          Ιδιωτική περιοχή
        </p>
        <h1 className="admin-display mt-2 text-3xl">Καλωσήρθες</h1>
        <p className="mt-2 text-sm text-[var(--admin-muted)]">
          Σύνδεση στο panel διαχείρισης «Γερμανικά με Στυλ».
        </p>

        <form action={action} className="mt-8 space-y-4">
          <div>
            <label className="admin-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              className="admin-input"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="admin-label" htmlFor="password">
              Κωδικός
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="admin-input"
            />
          </div>

          {state && !state.ok ? (
            <p
              role="alert"
              className="rounded-xl bg-[#fdecea] px-3 py-2 text-sm text-[var(--admin-danger)]"
            >
              {state.error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="admin-btn admin-btn-primary w-full"
          >
            {pending ? "Σύνδεση…" : "Σύνδεση"}
          </button>
        </form>
      </div>
    </div>
  );
}
