import { prisma } from "@/lib/db";
import { LOGIN_RATE_LIMIT } from "@/lib/constants";

export async function assertLoginAllowed(key: string): Promise<void> {
  const since = new Date(Date.now() - LOGIN_RATE_LIMIT.windowMs);
  const count = await prisma.loginAttempt.count({
    where: { key, createdAt: { gte: since } },
  });
  if (count >= LOGIN_RATE_LIMIT.maxAttempts) {
    throw new RateLimitError(
      "Πολλές αποτυχημένες προσπάθειες. Δοκίμασε ξανά σε λίγο.",
    );
  }
}

export async function recordLoginAttempt(key: string): Promise<void> {
  await prisma.loginAttempt.create({ data: { key } });
  const cutoff = new Date(Date.now() - LOGIN_RATE_LIMIT.windowMs * 2);
  await prisma.loginAttempt.deleteMany({ where: { createdAt: { lt: cutoff } } });
}

export class RateLimitError extends Error {
  status = 429;
  constructor(message: string) {
    super(message);
    this.name = "RateLimitError";
  }
}
