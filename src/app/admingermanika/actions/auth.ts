"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/crypto";
import { createSession, destroySession, getSession } from "@/lib/auth/session";
import {
  assertLoginAllowed,
  recordLoginAttempt,
  RateLimitError,
} from "@/lib/auth/rate-limit";
import { loginSchema, type ActionResult } from "@/validations";
import { logActivity } from "@/services/activity";

function clientKey(email: string, ip: string) {
  return `${email.toLowerCase()}|${ip}`;
}

export async function loginAction(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, error: "Έλεγξε email και κωδικό." };
  }

  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    hdrs.get("x-real-ip") ||
    "unknown";
  const key = clientKey(parsed.data.email, ip);

  try {
    await assertLoginAllowed(key);
  } catch (err) {
    if (err instanceof RateLimitError) {
      return { ok: false, error: err.message };
    }
    throw err;
  }

  const user = await prisma.adminUser.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  const valid =
    !!user && verifyPassword(parsed.data.password, user.passwordHash);

  if (!valid || !user) {
    await recordLoginAttempt(key);
    return { ok: false, error: "Λάθος στοιχεία σύνδεσης." };
  }

  await createSession(user.id);
  await prisma.adminUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });
  await logActivity({
    userId: user.id,
    action: "LOGIN",
    summary: "Σύνδεση στο admin panel",
  });

  redirect("/admingermanika/dashboard");
}

export async function logoutAction(): Promise<void> {
  const session = await getSession();
  if (session) {
    await logActivity({
      userId: session.user.id,
      action: "LOGOUT",
      summary: "Αποσύνδεση από το admin panel",
    });
  }
  await destroySession();
  redirect("/admingermanika/login");
}
