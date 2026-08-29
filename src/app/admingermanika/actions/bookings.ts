"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/auth/session";
import {
  adminAddNote,
  adminCancelBooking,
  adminConfirmBooking,
  adminRescheduleBooking,
} from "@/services/booking";
import { blockedDateSchema, availabilityScheduleSchema, type ActionResult } from "@/validations";
import { logActivity } from "@/services/activity";
import { parseDateOnly } from "@/lib/timezone";

function revalidateBookingPaths() {
  revalidatePath("/admingermanika/bookings");
  revalidatePath("/admingermanika/dashboard");
  revalidatePath("/admingermanika/analytics");
  revalidatePath("/");
}

export async function confirmBookingAction(id: string): Promise<ActionResult> {
  const session = await requireApiSession();
  try {
    await adminConfirmBooking(id);
    await logActivity({
      userId: session.user.id,
      action: "BOOKING_CONFIRMED",
      summary: "Επιβεβαίωση κράτησης",
      meta: { bookingId: id },
    });
    revalidateBookingPaths();
    return { ok: true, message: "Η κράτηση επιβεβαιώθηκε." };
  } catch {
    return { ok: false, error: "Αποτυχία επιβεβαίωσης." };
  }
}

export async function cancelBookingAction(id: string): Promise<ActionResult> {
  const session = await requireApiSession();
  try {
    await adminCancelBooking(id);
    await logActivity({
      userId: session.user.id,
      action: "BOOKING_CANCELLED",
      summary: "Ακύρωση κράτησης",
      meta: { bookingId: id },
    });
    revalidateBookingPaths();
    return { ok: true, message: "Η κράτηση ακυρώθηκε." };
  } catch {
    return { ok: false, error: "Αποτυχία ακύρωσης." };
  }
}

export async function rescheduleBookingAction(
  id: string,
  date: string,
  startTime: string,
): Promise<ActionResult> {
  const session = await requireApiSession();
  try {
    await adminRescheduleBooking(id, date, startTime);
    await logActivity({
      userId: session.user.id,
      action: "BOOKING_RESCHEDULED",
      summary: "Αναπρογραμματισμός κράτησης",
      meta: { bookingId: id, date, startTime },
    });
    revalidateBookingPaths();
    return { ok: true, message: "Η κράτηση αναπρογραμματίστηκε." };
  } catch {
    return { ok: false, error: "Η ώρα δεν είναι διαθέσιμη." };
  }
}

export async function addBookingNoteAction(
  id: string,
  note: string,
): Promise<ActionResult> {
  const session = await requireApiSession();
  try {
    await adminAddNote(id, note);
    await logActivity({
      userId: session.user.id,
      action: "BOOKING_NOTE_ADDED",
      summary: "Προσθήκη σημείωσης σε κράτηση",
      meta: { bookingId: id },
    });
    revalidateBookingPaths();
    return { ok: true, message: "Η σημείωση αποθηκεύτηκε." };
  } catch {
    return { ok: false, error: "Αποτυχία αποθήκευσης." };
  }
}

export async function saveAvailabilityScheduleAction(
  id: string | null,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const session = await requireApiSession();

  const rulesJson = formData.get("rules");
  let rules: Array<{ dayOfWeek: number; startTime: string; endTime: string }> = [];
  try {
    rules = JSON.parse(String(rulesJson ?? "[]"));
  } catch {
    return { ok: false, error: "Μη έγκυροι κανόνες διαθεσιμότητας." };
  }

  const parsed = availabilityScheduleSchema.safeParse({
    name: formData.get("name"),
    isActive: formData.get("isActive") === "on" || formData.get("isActive") === "true",
    rules,
  });

  if (!parsed.success) {
    return { ok: false, error: "Μη έγκυρα δεδομένα." };
  }

  const data = parsed.data;

  if (id) {
    await prisma.$transaction([
      prisma.availabilityRule.deleteMany({ where: { scheduleId: id } }),
      prisma.availabilitySchedule.update({
        where: { id },
        data: {
          name: data.name,
          isActive: data.isActive,
          rules: { create: data.rules },
        },
      }),
    ]);
    await logActivity({
      userId: session.user.id,
      action: "AVAILABILITY_UPDATED",
      summary: `Ενημέρωση διαθεσιμότητας: ${data.name}`,
      meta: { scheduleId: id },
    });
    revalidateBookingPaths();
    return { ok: true, data: { id } };
  }

  const created = await prisma.availabilitySchedule.create({
    data: {
      name: data.name,
      isActive: data.isActive,
      rules: { create: data.rules },
    },
  });

  await logActivity({
    userId: session.user.id,
    action: "AVAILABILITY_CREATED",
    summary: `Νέα διαθεσιμότητα: ${data.name}`,
    meta: { scheduleId: created.id },
  });

  revalidateBookingPaths();
  return { ok: true, data: { id: created.id } };
}

export async function deleteAvailabilityScheduleAction(id: string): Promise<ActionResult> {
  const session = await requireApiSession();
  await prisma.availabilitySchedule.delete({ where: { id } });
  await logActivity({
    userId: session.user.id,
    action: "AVAILABILITY_DELETED",
    summary: "Διαγραφή προγράμματος διαθεσιμότητας",
    meta: { scheduleId: id },
  });
  revalidateBookingPaths();
  return { ok: true };
}

export async function addBlockedDateAction(formData: FormData): Promise<ActionResult> {
  const session = await requireApiSession();
  const parsed = blockedDateSchema.safeParse({
    date: formData.get("date"),
    reason: formData.get("reason") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, error: "Μη έγκυρη ημερομηνία." };
  }

  await prisma.blockedDate.upsert({
    where: { date: parseDateOnly(parsed.data.date) },
    update: { reason: parsed.data.reason ?? null },
    create: {
      date: parseDateOnly(parsed.data.date),
      reason: parsed.data.reason ?? null,
    },
  });

  await logActivity({
    userId: session.user.id,
    action: "BLOCKED_DATE_CREATED",
    summary: `Αποκλεισμένη ημερομηνία: ${parsed.data.date}`,
    meta: { date: parsed.data.date },
  });

  revalidateBookingPaths();
  return { ok: true };
}

export async function removeBlockedDateAction(id: string): Promise<ActionResult> {
  const session = await requireApiSession();
  await prisma.blockedDate.delete({ where: { id } });
  await logActivity({
    userId: session.user.id,
    action: "BLOCKED_DATE_DELETED",
    summary: "Αφαίρεση αποκλεισμένης ημερομηνίας",
    meta: { blockedDateId: id },
  });
  revalidateBookingPaths();
  return { ok: true };
}
