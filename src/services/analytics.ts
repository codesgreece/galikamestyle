import { createHash } from "node:crypto";
import { prisma } from "@/lib/db";
import { hashVisitorId } from "@/lib/crypto";

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function daysAgo(n: number) {
  const x = startOfDay();
  x.setDate(x.getDate() - n);
  return x;
}

export function categorizeReferrer(referrer?: string | null): string {
  if (!referrer) return "direct";
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "").toLowerCase();
    if (!host) return "direct";
    if (host.includes("facebook") || host.includes("fb.")) return "facebook";
    if (host.includes("instagram")) return "instagram";
    if (host.includes("google") || host.includes("bing") || host.includes("yahoo"))
      return "search";
    if (host.includes("t.co") || host.includes("twitter") || host.includes("x.com"))
      return "social";
    return "referral";
  } catch {
    return "direct";
  }
}

export async function recordPageView(input: {
  path: string;
  visitorRaw: string;
  referrer?: string | null;
  deviceType: string;
}) {
  const path = input.path.startsWith("/") ? input.path.slice(0, 300) : `/${input.path.slice(0, 299)}`;
  if (path.startsWith("/admingermanika") || path.startsWith("/api/")) return;

  await prisma.pageView.create({
    data: {
      path,
      visitorHash: hashVisitorId(input.visitorRaw),
      referrerCategory: categorizeReferrer(input.referrer),
      deviceType: input.deviceType || "unknown",
    },
  });
}

export async function getAnalyticsSummary(rangeDays = 30) {
  const now = new Date();
  const today = startOfDay(now);
  const from = daysAgo(Math.max(rangeDays - 1, 0));
  const last7 = daysAgo(6);
  const last30 = daysAgo(29);

  const [todayCount, last7Count, last30Count, total, rangeViews] = await Promise.all([
    prisma.pageView.count({ where: { createdAt: { gte: today } } }),
    prisma.pageView.count({ where: { createdAt: { gte: last7 } } }),
    prisma.pageView.count({ where: { createdAt: { gte: last30 } } }),
    prisma.pageView.count(),
    prisma.pageView.findMany({
      where: { createdAt: { gte: from } },
      select: {
        path: true,
        deviceType: true,
        referrerCategory: true,
        createdAt: true,
      },
    }),
  ]);

  const byPath = new Map<string, number>();
  const byDevice = new Map<string, number>();
  const bySource = new Map<string, number>();
  const byDay = new Map<string, number>();

  for (const view of rangeViews) {
    byPath.set(view.path, (byPath.get(view.path) ?? 0) + 1);
    byDevice.set(view.deviceType, (byDevice.get(view.deviceType) ?? 0) + 1);
    bySource.set(
      view.referrerCategory,
      (bySource.get(view.referrerCategory) ?? 0) + 1,
    );
    const day = view.createdAt.toISOString().slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + 1);
  }

  const topPages = [...byPath.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, count]) => ({ path, count }));

  const topBlog = topPages.filter((p) => p.path.startsWith("/blog/"));

  const devices = [...byDevice.entries()].map(([type, count]) => ({ type, count }));
  const sources = [...bySource.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([source, count]) => ({ source, count }));

  const series: Array<{ date: string; count: number }> = [];
  for (let i = rangeDays - 1; i >= 0; i -= 1) {
    const d = daysAgo(i).toISOString().slice(0, 10);
    series.push({ date: d, count: byDay.get(d) ?? 0 });
  }

  return {
    todayCount,
    last7Count,
    last30Count,
    total,
    rangeCount: rangeViews.length,
    topPages,
    topBlog,
    devices,
    sources,
    series,
  };
}

export function createAnonymousVisitorId(): string {
  return createHash("sha256")
    .update(`${Date.now()}-${Math.random()}`)
    .digest("hex")
    .slice(0, 24);
}
