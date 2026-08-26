"use client";

import { useState, useTransition } from "react";
import {
  deleteMediaAction,
  updateMediaAltAction,
  uploadMediaAction,
} from "@/app/admingermanika/actions/media";
import { Toast, EmptyState } from "@/components/admin/ui";

type MediaItem = {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  storagePath: string;
  altText: string | null;
  createdAt: string;
};

export function MediaLibrary({ initialItems }: { initialItems: MediaItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [altDraft, setAltDraft] = useState("");

  const onUpload = (fileList: FileList | null) => {
    if (!fileList?.[0]) return;
    setError(null);
    const fd = new FormData();
    fd.set("file", fileList[0]);
    startTransition(async () => {
      const result = await uploadMediaAction(fd);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setToast(result.message ?? "Ανέβηκε");
      window.location.reload();
    });
  };

  const onSaveAlt = () => {
    if (!selected) return;
    const fd = new FormData();
    fd.set("altText", altDraft);
    startTransition(async () => {
      const result = await updateMediaAltAction(selected.id, fd);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setItems((list) =>
        list.map((item) =>
          item.id === selected.id ? { ...item, altText: altDraft } : item,
        ),
      );
      setSelected((s) => (s ? { ...s, altText: altDraft } : s));
      setToast(result.message ?? "Αποθηκεύτηκε");
    });
  };

  const onDelete = () => {
    if (!selected) return;
    if (!window.confirm("Διαγραφή αυτής της εικόνας;")) return;
    startTransition(async () => {
      const result = await deleteMediaAction(selected.id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setItems((list) => list.filter((item) => item.id !== selected.id));
      setSelected(null);
      setToast(result.message ?? "Διαγράφηκε");
    });
  };

  return (
    <div className="space-y-5">
      <div className="admin-card p-5">
        <label className="admin-btn admin-btn-accent inline-flex cursor-pointer">
          {pending ? "Μεταφόρτωση…" : "Ανέβασμα εικόνας"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            disabled={pending}
            onChange={(e) => onUpload(e.target.files)}
          />
        </label>
        <p className="mt-2 text-sm text-[var(--admin-muted)]">
          JPEG, PNG, WebP ή GIF · έως 5MB · αποθήκευση σε persistent storage
        </p>
        {error ? (
          <p className="mt-3 rounded-xl bg-[#fdecea] px-3 py-2 text-sm text-[var(--admin-danger)]">
            {error}
          </p>
        ) : null}
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Δεν υπάρχουν εικόνες"
          description="Ανέβασε την πρώτη εικόνα για να τη χρησιμοποιήσεις στα άρθρα."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`overflow-hidden rounded-2xl border text-left ${
                  selected?.id === item.id
                    ? "border-[var(--admin-accent)]"
                    : "border-[var(--admin-line)]"
                }`}
                onClick={() => {
                  setSelected(item);
                  setAltDraft(item.altText ?? "");
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.storagePath}
                  alt={item.altText ?? item.originalName}
                  className="aspect-square w-full object-cover"
                />
              </button>
            ))}
          </div>

          <div className="admin-card h-fit p-5">
            {selected ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selected.storagePath}
                  alt={selected.altText ?? selected.originalName}
                  className="mb-4 aspect-video w-full rounded-xl object-cover"
                />
                <p className="font-semibold">{selected.originalName}</p>
                <p className="mt-1 text-xs text-[var(--admin-muted)]">
                  {selected.mimeType} · {(selected.size / 1024).toFixed(1)} KB
                </p>
                <p className="mt-2 break-all text-xs text-[var(--admin-muted)]">
                  {selected.storagePath}
                </p>
                <label className="mt-4 block">
                  <span className="admin-label">Alt text</span>
                  <input
                    className="admin-input"
                    value={altDraft}
                    onChange={(e) => setAltDraft(e.target.value)}
                  />
                </label>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="admin-btn admin-btn-primary"
                    disabled={pending}
                    onClick={onSaveAlt}
                  >
                    Αποθήκευση alt
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-danger"
                    disabled={pending}
                    onClick={onDelete}
                  >
                    Διαγραφή
                  </button>
                </div>
              </>
            ) : (
              <p className="text-sm text-[var(--admin-muted)]">
                Επίλεξε μια εικόνα για λεπτομέρειες.
              </p>
            )}
          </div>
        </div>
      )}

      <Toast message={toast} onDone={() => setToast(null)} />
    </div>
  );
}
