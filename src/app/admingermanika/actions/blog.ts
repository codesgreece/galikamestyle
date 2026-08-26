"use server";

import { revalidatePath, updateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/auth/session";
import { CACHE_TAGS } from "@/lib/constants";
import { sanitizeBlogHtml, looksLikeHtml } from "@/lib/sanitize";
import { blogPostSchema, type ActionResult } from "@/validations";
import { isSlugTaken } from "@/services/blog";
import { logActivity } from "@/services/activity";

function prepareContent(content: string) {
  if (!content.trim()) return "";
  if (looksLikeHtml(content)) return sanitizeBlogHtml(content);
  return content;
}

function revalidateBlog(slug?: string) {
  updateTag(CACHE_TAGS.blog);
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admingermanika/blog");
  revalidatePath("/admingermanika/dashboard");
  if (slug) revalidatePath(`/blog/${slug}`);
}

export async function savePostAction(
  id: string | null,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const session = await requireApiSession();
  const parsed = blogPostSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt") || "",
    content: formData.get("content") || "",
    coverImage: formData.get("coverImage") || null,
    coverAlt: formData.get("coverAlt") || null,
    status: formData.get("status") || "DRAFT",
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Έλεγξε τα πεδία του άρθρου.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (await isSlugTaken(parsed.data.slug, id ?? undefined)) {
    return {
      ok: false,
      error: "Το slug χρησιμοποιείται ήδη. Διάλεξε άλλο.",
      fieldErrors: { slug: ["Το slug πρέπει να είναι μοναδικό"] },
    };
  }

  const content = prepareContent(parsed.data.content);
  const publishing = parsed.data.status === "PUBLISHED";

  if (id) {
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) return { ok: false, error: "Το άρθρο δεν βρέθηκε." };

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        excerpt: parsed.data.excerpt,
        content,
        coverImage: parsed.data.coverImage || null,
        coverAlt: parsed.data.coverAlt || null,
        status: parsed.data.status,
        publishedAt:
          publishing
            ? existing.publishedAt ?? new Date()
            : existing.publishedAt,
      },
    });

    const becamePublished =
      publishing && existing.status !== "PUBLISHED";

    await logActivity({
      userId: session.user.id,
      action: becamePublished ? "POST_PUBLISHED" : "POST_UPDATED",
      summary: becamePublished
        ? `Δημοσίευσες το άρθρο «${post.title}»`
        : `Ενημέρωσες το άρθρο «${post.title}»`,
      meta: { postId: post.id, slug: post.slug },
    });

    revalidateBlog(post.slug);
    if (existing.slug !== post.slug) revalidateBlog(existing.slug);

    return {
      ok: true,
      data: { id: post.id },
      message: becamePublished ? "Το άρθρο δημοσιεύτηκε." : "Το άρθρο αποθηκεύτηκε.",
    };
  }

  const post = await prisma.blogPost.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt,
      content,
      coverImage: parsed.data.coverImage || null,
      coverAlt: parsed.data.coverAlt || null,
      status: parsed.data.status,
      publishedAt: publishing ? new Date() : null,
      authorId: session.user.id,
    },
  });

  await logActivity({
    userId: session.user.id,
    action: publishing ? "POST_PUBLISHED" : "POST_CREATED",
    summary: publishing
      ? `Δημοσίευσες νέο άρθρο «${post.title}»`
      : `Δημιούργησες πρόχειρο άρθρο «${post.title}»`,
    meta: { postId: post.id, slug: post.slug },
  });

  revalidateBlog(post.slug);
  return {
    ok: true,
    data: { id: post.id },
    message: publishing ? "Το άρθρο δημοσιεύτηκε." : "Το πρόχειρο αποθηκεύτηκε.",
  };
}

export async function deletePostAction(id: string): Promise<ActionResult> {
  const session = await requireApiSession();
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return { ok: false, error: "Το άρθρο δεν βρέθηκε." };
  await prisma.blogPost.delete({ where: { id } });
  await logActivity({
    userId: session.user.id,
    action: "POST_DELETED",
    summary: `Διέγραψες το άρθρο «${post.title}»`,
    meta: { postId: id, slug: post.slug },
  });
  revalidateBlog(post.slug);
  return { ok: true, message: "Το άρθρο διαγράφηκε." };
}
