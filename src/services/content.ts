import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/constants";
import { DEFAULT_CONTENT, mergeContent, type SiteContentMap } from "@/lib/defaults";

export const getPublicContent = unstable_cache(
  async (): Promise<SiteContentMap> => {
    try {
      const rows = await prisma.siteContent.findMany();
      return mergeContent(rows);
    } catch {
      return DEFAULT_CONTENT;
    }
  },
  ["public-site-content"],
  { tags: [CACHE_TAGS.content], revalidate: 60 },
);

export async function listContentAdmin() {
  return prisma.siteContent.findMany({ orderBy: [{ group: "asc" }, { key: "asc" }] });
}
