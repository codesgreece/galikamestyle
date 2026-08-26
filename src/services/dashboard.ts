import { prisma } from "@/lib/db";
import { getAnalyticsSummary } from "@/services/analytics";
import { getRecentActivity } from "@/services/activity";

export async function getDashboardData() {
  const [analytics, published, drafts, activeOffers, activity] = await Promise.all([
    getAnalyticsSummary(30),
    prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
    prisma.blogPost.count({ where: { status: "DRAFT" } }),
    prisma.offer.count({ where: { isActive: true } }),
    getRecentActivity(10),
  ]);

  return {
    visitsToday: analytics.todayCount,
    visits7: analytics.last7Count,
    visits30: analytics.last30Count,
    published,
    drafts,
    activeOffers,
    activity,
  };
}
