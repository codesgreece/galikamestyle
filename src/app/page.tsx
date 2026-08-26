import { getPublicOffers } from "@/services/offers";
import { getPublicContent } from "@/services/content";
import { getPublishedPosts } from "@/services/blog";
import { HomeClient } from "./HomeClient";

export default async function HomePage() {
  const [offers, content, posts] = await Promise.all([
    getPublicOffers(),
    getPublicContent(),
    getPublishedPosts(),
  ]);

  return (
    <HomeClient
      offers={offers}
      content={content}
      posts={posts.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        coverAlt: post.coverAlt,
        publishedAt: post.publishedAt?.toISOString() ?? null,
      }))}
    />
  );
}
