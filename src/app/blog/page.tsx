import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts } from "@/services/blog";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Blog | Γερμανικά με Στυλ",
  description:
    "Άρθρα και tips για μαθήματα Γερμανικών και Αγγλικών από τη Βιργινία Πανάκη.",
  openGraph: {
    title: "Blog | Γερμανικά με Στυλ",
    description: "Tips, ιδέες και υλικό για γλώσσες με στυλ.",
    type: "website",
    locale: "el_GR",
    siteName: siteConfig.name,
  },
};

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="border-b-[3px] border-ink bg-navy text-cream">
        <div className="container-shell flex items-center justify-between py-5">
          <Link href="/" className="font-display text-xl">
            Γερμανικά με Στυλ
          </Link>
          <Link href="/" className="text-sm text-cream/70 hover:text-yellow">
            ← Αρχική
          </Link>
        </div>
      </header>

      <main className="container-shell py-12 lg:py-16">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-coral">
          Blog
        </p>
        <h1 className="font-display mt-2 text-4xl md:text-5xl">Άρθρα με στυλ</h1>
        <p className="mt-3 max-w-xl text-ink/65">
          Tips, ιδέες και υλικό για Γερμανικά και Αγγλικά.
        </p>

        {posts.length === 0 ? (
          <p className="mt-10 rounded-3xl border-[3px] border-ink bg-paper p-8 text-ink/70">
            Σύντομα έρχονται νέα άρθρα.
          </p>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {posts.map((post) => (
              <article
                key={post.id}
                className="overflow-hidden rounded-3xl border-[3px] border-ink bg-paper shadow-[6px_6px_0_#1a1433]"
              >
                {post.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.coverImage}
                    alt={post.coverAlt ?? post.title}
                    className="aspect-[16/9] w-full object-cover"
                  />
                ) : null}
                <div className="p-5">
                  <time className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                    {(post.publishedAt ?? post.updatedAt).toLocaleDateString("el-GR")}
                  </time>
                  <h2 className="font-display mt-2 text-2xl">
                    <Link href={`/blog/${post.slug}`} className="hover:text-coral">
                      {post.title}
                    </Link>
                  </h2>
                  {post.excerpt ? (
                    <p className="mt-2 text-sm text-ink/70">{post.excerpt}</p>
                  ) : null}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-4 inline-flex text-sm font-extrabold uppercase tracking-wide text-coral"
                  >
                    Διάβασε →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
