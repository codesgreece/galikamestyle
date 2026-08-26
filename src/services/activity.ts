import type { ActivityAction, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function logActivity(input: {
  userId?: string | null;
  action: ActivityAction;
  summary: string;
  meta?: Prisma.InputJsonValue;
}) {
  await prisma.activityLog.create({
    data: {
      userId: input.userId ?? null,
      action: input.action,
      summary: input.summary,
      meta: input.meta,
    },
  });
}

export async function getRecentActivity(limit = 12) {
  return prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: { select: { name: true, email: true } },
    },
  });
}
