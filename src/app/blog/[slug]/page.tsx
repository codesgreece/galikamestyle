import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedPostBySlug, getPublishedPosts } from "@/services/blog";
import { renderBlogContent } from "@/lib/sanitize";
import { siteConfig } from "@/lib/config";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "Άρθρο δεν βρέθηκε" };

  const description = post.excerpt || post.title;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url}/blog/${post.slug}`;

  return {
    title: `${post.title} | Blog · Γερμανικά με Στυλ`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url,
      locale: "el_GR",
      siteName: siteConfig.name,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const html = await renderBlogContent(post.content);

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="border-b-[3px] border-ink bg-navy text-cream">
        <div className="container-shell flex items-center justify-between py-5">
          <Link href="/" className="font-display text-xl">
            Γερμανικά με Στυλ
          </Link>
          <Link href="/blog" className="text-sm text-cream/70 hover:text-yellow">
            ← Blog
          </Link>
        </div>
      </header>

      <article className="container-shell py-12 lg:py-16">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-coral">
          {(post.publishedAt ?? post.createdAt).toLocaleDateString("el-GR")}
        </p>
        <h1 className="font-display mt-3 max-w-3xl text-4xl md:text-5xl">
          {post.title}
        </h1>
        {post.excerpt ? (
          <p className="mt-4 max-w-2xl text-lg text-ink/70">{post.excerpt}</p>
        ) : null}
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={post.coverAlt ?? post.title}
            className="mt-8 aspect-[16/9] w-full rounded-3xl border-[3px] border-ink object-cover shadow-[8px_8px_0_#1a1433]"
          />
        ) : null}
        <div
          className="prose-blog mt-10 max-w-3xl space-y-4 text-base leading-8 text-ink/85 [&_a]:text-coral [&_a]:underline [&_h2]:font-display [&_h2]:text-3xl [&_h3]:font-display [&_h3]:text-2xl [&_img]:rounded-2xl [&_img]:border-2 [&_img]:border-ink [&_li]:ml-5 [&_ol]:list-decimal [&_ul]:list-disc"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <p className="mt-10 text-sm text-muted">
          Από {post.author.name} · {siteConfig.name}
        </p>
      </article>
    </div>
  );
}
