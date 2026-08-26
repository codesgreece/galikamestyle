import type { PostStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function getPublishedPosts() {
  try {
    return await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        coverAlt: true,
        publishedAt: true,
        updatedAt: true,
      },
    });
  } catch {
    return [];
  }
}

export async function getPublishedPostBySlug(slug: string) {
  try {
    return await prisma.blogPost.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: {
        author: { select: { name: true } },
      },
    });
  } catch {
    return null;
  }
}

export async function listPostsAdmin(filters?: {
  status?: PostStatus | "ALL";
  q?: string;
}) {
  const status = filters?.status && filters.status !== "ALL" ? filters.status : undefined;
  const q = filters?.q?.trim();
  return prisma.blogPost.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { slug: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ updatedAt: "desc" }],
    include: {
      author: { select: { name: true } },
    },
  });
}

export async function getPostByIdAdmin(id: string) {
  return prisma.blogPost.findUnique({
    where: { id },
    include: { author: { select: { name: true, email: true } } },
  });
}

export async function isSlugTaken(slug: string, excludeId?: string) {
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (!existing) return false;
  return excludeId ? existing.id !== excludeId : true;
}
