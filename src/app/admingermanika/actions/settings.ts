"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  destroyOtherSessions,
  requireApiSession,
} from "@/lib/auth/session";
import { hashPassword, verifyPassword } from "@/lib/crypto";
import {
  passwordChangeSchema,
  settingsProfileSchema,
  type ActionResult,
} from "@/validations";
import { logActivity } from "@/services/activity";

export async function updateProfileAction(
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireApiSession();
  const parsed = settingsProfileSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { ok: false, error: "Έλεγξε όνομα και email." };
  }

  const email = parsed.data.email.toLowerCase();
  const clash = await prisma.adminUser.findFirst({
    where: { email, id: { not: session.user.id } },
  });
  if (clash) {
    return { ok: false, error: "Το email χρησιμοποιείται ήδη." };
  }

  await prisma.adminUser.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name, email },
  });

  await logActivity({
    userId: session.user.id,
    action: "SETTINGS_UPDATED",
    summary: "Ενημέρωσες το προφίλ admin",
  });

  revalidatePath("/admingermanika/settings");
  revalidatePath("/admingermanika/dashboard");
  return { ok: true, message: "Το προφίλ ενημερώθηκε." };
}

export async function changePasswordAction(
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireApiSession();
  const parsed = passwordChangeSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message || "Μη έγκυρος κωδικός.",
    };
  }

  const user = await prisma.adminUser.findUnique({
    where: { id: session.user.id },
  });
  if (!user || !verifyPassword(parsed.data.currentPassword, user.passwordHash)) {
    return { ok: false, error: "Ο τρέχων κωδικός είναι λάθος." };
  }

  await prisma.adminUser.update({
    where: { id: user.id },
    data: { passwordHash: hashPassword(parsed.data.newPassword) },
  });

  await destroyOtherSessions(user.id, session.sessionId);

  await logActivity({
    userId: session.user.id,
    action: "PASSWORD_CHANGED",
    summary: "Άλλαξες τον κωδικό πρόσβασης",
  });

  revalidatePath("/admingermanika/settings");
  return {
    ok: true,
    message: "Ο κωδικός άλλαξε. Οι άλλες συνεδρίες αποσυνδέθηκαν.",
  };
}
