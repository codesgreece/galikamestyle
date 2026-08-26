import Link from "next/link";
import { requireSession } from "@/lib/auth/session";
import { listPostsAdmin } from "@/services/blog";
import { EmptyState, PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Blog" };

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  await requireSession();
  const params = await searchParams;
  const status =
    params.status === "PUBLISHED" || params.status === "DRAFT"
      ? params.status
      : "ALL";
  const q = params.q ?? "";

  let posts: Awaited<ReturnType<typeof listPostsAdmin>> | null = null;
  try {
    posts = await listPostsAdmin({ status, q });
  } catch {
    posts = null;
  }

  if (!posts) {
    return (
      <EmptyState
        title="Αδυναμία φόρτωσης blog"
        description="Η βάση δεδομένων δεν είναι διαθέσιμη αυτή τη στιγμή."
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="Blog"
        description="Δημιούργησε και δημοσίευσε άρθρα για το δημόσιο /blog."
        actions={
          <Link href="/admingermanika/blog/new" className="admin-btn admin-btn-accent">
            + Νέο άρθρο
          </Link>
        }
      />

      <form className="mb-5 flex flex-col gap-3 sm:flex-row" method="get">
        <input
          name="q"
          defaultValue={q}
          placeholder="Αναζήτηση τίτλου…"
          className="admin-input sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {[
            { value: "ALL", label: "Όλα" },
            { value: "PUBLISHED", label: "Δημοσιευμένα" },
            { value: "DRAFT", label: "Πρόχειρα" },
          ].map((item) => (
            <Link
              key={item.value}
              href={`/admingermanika/blog?status=${item.value}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={`admin-btn ${
                status === item.value ? "admin-btn-primary" : "admin-btn-ghost"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <button type="submit" className="admin-btn admin-btn-ghost">
            Αναζήτηση
          </button>
        </div>
      </form>

      {posts.length === 0 ? (
        <EmptyState
          title="Δεν υπάρχουν άρθρα"
          description="Δημιούργησε το πρώτο σου άρθρο για να εμφανιστεί εδώ."
        />
      ) : (
        <div className="admin-card admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Τίτλος</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Ημερομηνία</th>
                <th>Ενημέρωση</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    {post.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.coverImage}
                        alt=""
                        className="h-12 w-16 rounded-lg object-cover"
                      />
                    ) : (
                      <span className="text-xs text-[var(--admin-muted)]">—</span>
                    )}
                  </td>
                  <td className="font-medium">{post.title}</td>
                  <td className="text-sm text-[var(--admin-muted)]">{post.slug}</td>
                  <td>
                    <span
                      className={`admin-badge ${
                        post.status === "PUBLISHED"
                          ? "admin-badge-success"
                          : "admin-badge-warn"
                      }`}
                    >
                      {post.status === "PUBLISHED" ? "Δημοσιευμένο" : "Πρόχειρο"}
                    </span>
                  </td>
                  <td className="text-sm">
                    {(post.publishedAt ?? post.createdAt).toLocaleDateString("el-GR")}
                  </td>
                  <td className="text-sm">
                    {post.updatedAt.toLocaleDateString("el-GR")}
                  </td>
                  <td>
                    <Link
                      href={`/admingermanika/blog/${post.id}/edit`}
                      className="admin-btn admin-btn-ghost text-xs"
                    >
                      Επεξεργασία
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
