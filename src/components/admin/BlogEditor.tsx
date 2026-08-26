"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/crypto";
import {
  deletePostAction,
  savePostAction,
} from "@/app/admingermanika/actions/blog";
import { Toast } from "@/components/admin/ui";

type MediaOption = {
  id: string;
  storagePath: string;
  originalName: string;
  altText: string | null;
};

export function BlogEditor({
  mode,
  post,
  media,
}: {
  mode: "new" | "edit";
  post?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string | null;
    coverAlt: string | null;
    status: "DRAFT" | "PUBLISHED";
  };
  media: MediaOption[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [coverAlt, setCoverAlt] = useState(post?.coverAlt ?? "");
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [showMedia, setShowMedia] = useState(false);

  const previewHtml = useMemo(() => content, [content]);

  const syncSlug = (nextTitle: string) => {
    setTitle(nextTitle);
    if (!slugTouched) setSlug(slugify(nextTitle));
  };

  const save = (status: "DRAFT" | "PUBLISHED") => {
    setError(null);
    const fd = new FormData();
    fd.set("title", title);
    fd.set("slug", slug);
    fd.set("excerpt", excerpt);
    fd.set("content", content);
    fd.set("coverImage", coverImage);
    fd.set("coverAlt", coverAlt);
    fd.set("status", status);

    startTransition(async () => {
      const result = await savePostAction(post?.id ?? null, fd);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setToast(result.message ?? "Αποθηκεύτηκε");
      if (mode === "new" && result.data?.id) {
        router.replace(`/admingermanika/blog/${result.data.id}/edit`);
        router.refresh();
      } else {
        router.refresh();
      }
    });
  };

  const onDelete = () => {
    if (!post?.id) return;
    if (!window.confirm("Σίγουρα θέλεις να διαγράψεις αυτό το άρθρο;")) return;
    startTransition(async () => {
      const result = await deletePostAction(post.id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/admingermanika/blog");
      router.refresh();
    });
  };

  const insertMarkdown = (snippet: string) => {
    setContent((c) => `${c}${c.endsWith("\n") || !c ? "" : "\n"}${snippet}`);
  };

  return (
    <div className="space-y-5">
      <div className="admin-card grid gap-4 p-5 md:grid-cols-2 md:p-6">
        <label className="block md:col-span-2">
          <span className="admin-label">Τίτλος</span>
          <input
            className="admin-input"
            value={title}
            onChange={(e) => syncSlug(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="admin-label">Slug</span>
          <input
            className="admin-input"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
          />
        </label>
        <label className="block">
          <span className="admin-label">Cover image URL</span>
          <div className="flex gap-2">
            <input
              className="admin-input"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="/api/media/by-id/..."
            />
            <button
              type="button"
              className="admin-btn admin-btn-ghost shrink-0"
              onClick={() => setShowMedia((v) => !v)}
            >
              Media
            </button>
          </div>
        </label>
        <label className="block md:col-span-2">
          <span className="admin-label">Cover alt text</span>
          <input
            className="admin-input"
            value={coverAlt}
            onChange={(e) => setCoverAlt(e.target.value)}
          />
        </label>
        <label className="block md:col-span-2">
          <span className="admin-label">Σύντομη περιγραφή</span>
          <textarea
            className="admin-input min-h-20"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
        </label>
      </div>

      {showMedia ? (
        <div className="admin-card grid gap-3 p-4 sm:grid-cols-3 md:grid-cols-4">
          {media.length === 0 ? (
            <p className="text-sm text-[var(--admin-muted)] sm:col-span-3">
              Δεν υπάρχουν εικόνες. Ανέβασε από τη σελίδα Media.
            </p>
          ) : (
            media.map((item) => (
              <button
                key={item.id}
                type="button"
                className="overflow-hidden rounded-xl border border-[var(--admin-line)] text-left"
                onClick={() => {
                  setCoverImage(item.storagePath);
                  if (item.altText) setCoverAlt(item.altText);
                  setShowMedia(false);
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.storagePath}
                  alt={item.altText ?? item.originalName}
                  className="h-28 w-full object-cover"
                />
                <span className="block truncate px-2 py-1 text-xs">
                  {item.originalName}
                </span>
              </button>
            ))
          )}
        </div>
      ) : null}

      <div className="admin-card p-5 md:p-6">
        <div className="mb-3 flex flex-wrap gap-2">
          <ToolbarButton label="H2" onClick={() => insertMarkdown("\n## Υπότιτλος\n")} />
          <ToolbarButton label="Bold" onClick={() => insertMarkdown("**έντονο**")} />
          <ToolbarButton label="Italic" onClick={() => insertMarkdown("*πλάγια*")} />
          <ToolbarButton label="List" onClick={() => insertMarkdown("\n- στοιχείο\n")} />
          <ToolbarButton
            label="Link"
            onClick={() => insertMarkdown("[κείμενο](https://)")}
          />
          <ToolbarButton
            label="Image"
            onClick={() => insertMarkdown("\n![alt](/api/media/by-id/ID)\n")}
          />
        </div>
        <label className="block">
          <span className="admin-label">Περιεχόμενο (Markdown ή HTML)</span>
          <textarea
            className="admin-input min-h-[280px] font-mono text-sm"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>
        <div className="mt-5 rounded-xl border border-[var(--admin-line)] bg-white p-4">
          <p className="admin-label">Preview (ακατέργαστο)</p>
          <pre className="whitespace-pre-wrap text-sm text-[var(--admin-ink)]">
            {previewHtml || "—"}
          </pre>
        </div>
      </div>

      {error ? (
        <p className="rounded-xl bg-[#fdecea] px-3 py-2 text-sm text-[var(--admin-danger)]">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="admin-btn admin-btn-ghost"
          disabled={pending}
          onClick={() => save("DRAFT")}
        >
          {pending ? "Αποθήκευση…" : "Αποθήκευση πρόχειρου"}
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          disabled={pending}
          onClick={() => save("PUBLISHED")}
        >
          {post?.status === "PUBLISHED" ? "Ενημέρωση" : "Δημοσίευση"}
        </button>
        {slug ? (
          <Link
            href={`/blog/${slug}`}
            target="_blank"
            className="admin-btn admin-btn-ghost"
          >
            Preview
          </Link>
        ) : null}
        {post?.id ? (
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

      <Toast message={toast} onDone={() => setToast(null)} />
    </div>
  );
}

function ToolbarButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button type="button" className="admin-btn admin-btn-ghost text-xs" onClick={onClick}>
      {label}
    </button>
  );
}
