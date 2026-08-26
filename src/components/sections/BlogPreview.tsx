"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, DropWords } from "@/components/ui/Reveal";

export type HomeBlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  coverAlt: string | null;
  publishedAt: string | null;
};

export function BlogPreview({ posts }: { posts: HomeBlogPost[] }) {
  const visible = posts.slice(0, 3);

  return (
    <section id="blog" className="relative bg-cream">
      <div className="container-shell section-pad">
        <Reveal>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue">
            Blog quest
          </p>
        </Reveal>
        <h2 className="section-title font-display max-w-3xl">
          <DropWords text="Άρθρα με στυλ." />
        </h2>
        <Reveal delay={0.1}>
          <p className="mt-3 max-w-xl text-ink/65 sm:mt-4">
            Tips, ιδέες και υλικό για Γερμανικά και Αγγλικά — κατευθείαν από τη
            Βιργινία.
          </p>
        </Reveal>

        {visible.length === 0 ? (
          <Reveal delay={0.15} className="section-stack">
            <div className="rounded-3xl border-[3px] border-ink bg-paper p-6 shadow-[6px_6px_0_#3d8bff] md:p-8">
              <p className="font-display text-2xl">Σύντομα έρχονται άρθρα.</p>
              <p className="mt-2 text-ink/65">
                Μόλις δημοσιευτεί το πρώτο, θα εμφανιστεί εδώ στην αρχική.
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="section-stack grid gap-4 md:grid-cols-3">
            {visible.map((post, i) => (
              <motion.article
                key={post.id}
                className="group overflow-hidden rounded-3xl border-[3px] border-ink bg-paper shadow-[6px_6px_0_#1a1433] transition hover:-translate-y-1 hover:shadow-[8px_8px_0_#ff5d7a]"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                {post.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.coverImage}
                    alt={post.coverAlt ?? post.title}
                    className="aspect-[16/10] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[16/10] items-center justify-center bg-navy text-cream">
                    <span className="font-display text-3xl">Blog</span>
                  </div>
                )}
                <div className="p-5">
                  {post.publishedAt ? (
                    <time className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-muted">
                      {new Date(post.publishedAt).toLocaleDateString("el-GR")}
                    </time>
                  ) : null}
                  <h3 className="font-display mt-2 text-2xl leading-tight">
                    <Link href={`/blog/${post.slug}`} className="hover:text-coral">
                      {post.title}
                    </Link>
                  </h3>
                  {post.excerpt ? (
                    <p className="mt-2 line-clamp-3 text-sm text-ink/70">
                      {post.excerpt}
                    </p>
                  ) : null}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-extrabold uppercase tracking-wide text-coral"
                  >
                    Διάβασε
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        <Reveal delay={0.2} className="mt-8">
          <Link
            href="/blog"
            className="focus-ring inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-yellow px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-ink shadow-[4px_4px_0_#1a1433]"
          >
            Όλα τα άρθρα
            <ArrowUpRight size={16} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
