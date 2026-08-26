"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/auth/session";
import { CACHE_TAGS } from "@/lib/constants";
import { offerSchema, type ActionResult } from "@/validations";
import { logActivity } from "@/services/activity";

function parseOptionalDate(value?: string | null) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function revalidateOffers() {
  revalidateTag(CACHE_TAGS.offers, "max");
  revalidatePath("/");
  revalidatePath("/admingermanika/offers");
  revalidatePath("/admingermanika/dashboard");
}

export async function saveOfferAction(
  id: string | null,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const session = await requireApiSession();
  const parsed = offerSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    originalPrice: formData.get("originalPrice"),
    currentPrice: formData.get("currentPrice"),
    billingPeriod: formData.get("billingPeriod"),
    isActive: formData.get("isActive") === "on" || formData.get("isActive") === "true",
    badgeText: formData.get("badgeText") || null,
    startDate: formData.get("startDate") || null,
    endDate: formData.get("endDate") || null,
    sortOrder: formData.get("sortOrder") || 0,
    accent: formData.get("accent") || "navy",
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Έλεγξε τα πεδία της προσφοράς.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = {
    title: parsed.data.title,
    description: parsed.data.description,
    originalPrice: parsed.data.originalPrice,
    currentPrice: parsed.data.currentPrice,
    billingPeriod: parsed.data.billingPeriod,
    isActive: parsed.data.isActive,
    badgeText: parsed.data.badgeText || null,
    startDate: parseOptionalDate(parsed.data.startDate),
    endDate: parseOptionalDate(parsed.data.endDate),
    sortOrder: parsed.data.sortOrder,
    accent: parsed.data.accent,
  };

  if (id) {
    const offer = await prisma.offer.update({ where: { id }, data });
    await logActivity({
      userId: session.user.id,
      action: "OFFER_UPDATED",
      summary: `Ενημέρωσες την προσφορά «${offer.title}»`,
      meta: { offerId: offer.id },
    });
    revalidateOffers();
    return { ok: true, data: { id: offer.id }, message: "Η προσφορά αποθηκεύτηκε." };
  }

  const offer = await prisma.offer.create({ data });
  await logActivity({
    userId: session.user.id,
    action: "OFFER_CREATED",
    summary: `Δημιούργησες την προσφορά «${offer.title}»`,
    meta: { offerId: offer.id },
  });
  revalidateOffers();
  return { ok: true, data: { id: offer.id }, message: "Η προσφορά δημιουργήθηκε." };
}

export async function deleteOfferAction(id: string): Promise<ActionResult> {
  const session = await requireApiSession();
  const offer = await prisma.offer.findUnique({ where: { id } });
  if (!offer) return { ok: false, error: "Η προσφορά δεν βρέθηκε." };
  await prisma.offer.delete({ where: { id } });
  await logActivity({
    userId: session.user.id,
    action: "OFFER_DELETED",
    summary: `Διέγραψες την προσφορά «${offer.title}»`,
    meta: { offerId: id },
  });
  revalidateOffers();
  return { ok: true, message: "Η προσφορά διαγράφηκε." };
}
