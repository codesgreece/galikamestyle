"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/auth/session";
import { CACHE_TAGS } from "@/lib/constants";
import { CONTENT_FIELDS } from "@/lib/content-keys";
import { contentUpdateSchema, type ActionResult } from "@/validations";
import { logActivity } from "@/services/activity";

export async function saveContentAction(
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireApiSession();
  const values: Record<string, string> = {};
  for (const field of CONTENT_FIELDS) {
    const raw = formData.get(field.key);
    if (typeof raw === "string") values[field.key] = raw;
  }

  const parsed = contentUpdateSchema.safeParse({ values });
  if (!parsed.success) {
    return { ok: false, error: "Μη έγκυρα δεδομένα περιεχομένου." };
  }

  const allowed = new Set(CONTENT_FIELDS.map((f) => f.key));
  const entries = Object.entries(parsed.data.values).filter(([key]) =>
    allowed.has(key as (typeof CONTENT_FIELDS)[number]["key"]),
  );

  await prisma.$transaction(
    entries.map(([key, value]) => {
      const field = CONTENT_FIELDS.find((f) => f.key === key)!;
      return prisma.siteContent.upsert({
        where: { key },
        update: { value },
        create: {
          key,
          value,
          group: field.group,
          label: field.label,
        },
      });
    }),
  );

  await logActivity({
    userId: session.user.id,
    action: "CONTENT_UPDATED",
    summary: "Ενημέρωσες το περιεχόμενο του site",
    meta: { keys: entries.map(([k]) => k) },
  });

  revalidateTag(CACHE_TAGS.content, "max");
  revalidatePath("/");
  revalidatePath("/admingermanika/content");
  revalidatePath("/admingermanika/dashboard");

  return { ok: true, message: "Το περιεχόμενο αποθηκεύτηκε." };
}
