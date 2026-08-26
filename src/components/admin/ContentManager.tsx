"use client";

import { useEffect, useState, useTransition } from "react";
import { CONTENT_FIELDS, CONTENT_GROUP_LABELS, type ContentGroup } from "@/lib/content-keys";
import { saveContentAction } from "@/app/admingermanika/actions/content";
import { Toast } from "@/components/admin/ui";

export function ContentManager({
  initialValues,
}: {
  initialValues: Record<string, string>;
}) {
  const [values, setValues] = useState(initialValues);
  const [baseline, setBaseline] = useState(initialValues);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const dirty = JSON.stringify(values) !== JSON.stringify(baseline);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const groups = ["hero", "contact", "general"] as ContentGroup[];

  const onSave = () => {
    setError(null);
    const fd = new FormData();
    for (const [key, value] of Object.entries(values)) {
      fd.set(key, value);
    }
    startTransition(async () => {
      const result = await saveContentAction(fd);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setBaseline(values);
      setToast(result.message ?? "Αποθηκεύτηκε");
    });
  };

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group} className="admin-card p-5 md:p-6">
          <h2 className="admin-display text-2xl">{CONTENT_GROUP_LABELS[group]}</h2>
          <div className="mt-4 grid gap-4">
            {CONTENT_FIELDS.filter((f) => f.group === group).map((field) => (
              <label key={field.key} className="block">
                <span className="admin-label">{field.label}</span>
                {field.multiline ? (
                  <textarea
                    className="admin-input min-h-24"
                    value={values[field.key] ?? ""}
                    onChange={(e) =>
                      setValues((s) => ({ ...s, [field.key]: e.target.value }))
                    }
                  />
                ) : (
                  <input
                    className="admin-input"
                    value={values[field.key] ?? ""}
                    onChange={(e) =>
                      setValues((s) => ({ ...s, [field.key]: e.target.value }))
                    }
                  />
                )}
              </label>
            ))}
          </div>
        </section>
      ))}

      {error ? (
        <p className="rounded-xl bg-[#fdecea] px-3 py-2 text-sm text-[var(--admin-danger)]">
          {error}
        </p>
      ) : null}

      <div className="sticky bottom-4 flex items-center justify-between gap-3 rounded-2xl border border-[var(--admin-line)] bg-[var(--admin-surface)] px-4 py-3 shadow-lg">
        <p className="text-sm text-[var(--admin-muted)]">
          {dirty ? "Υπάρχουν μη αποθηκευμένες αλλαγές." : "Όλα αποθηκευμένα."}
        </p>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          disabled={!dirty || pending}
          onClick={onSave}
        >
          {pending ? "Αποθήκευση…" : "Αποθήκευση"}
        </button>
      </div>

      <Toast message={toast} onDone={() => setToast(null)} />
    </div>
  );
}
