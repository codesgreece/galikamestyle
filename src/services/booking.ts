import { randomBytes } from "node:crypto";
import type { Booking, BookingLanguage, BookingStatus, LessonType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  getEndTime,
  getSlotsForDate,
  cleanupExpiredHolds,
} from "@/services/booking-availability";
import {
  HOLD_DURATION_MS,
  isPastSlot,
  parseDateOnly,
} from "@/lib/timezone";

export type CreateHoldInput = {
  date: string;
  startTime: string;
  language: BookingLanguage;
  lessonType: LessonType;
};

export type ConfirmBookingInput = {
  holdToken: string;
  name: string;
  email: string;
  phone: string;
  ageGroup: string;
  estimatedLevel?: string;
  goal?: string;
  message?: string;
};

function createHoldToken(): string {
  return randomBytes(24).toString("hex");
}

export async function createHold(input: CreateHoldInput): Promise<
  | { ok: true; holdToken: string; expiresAt: Date; bookingId: string }
  | { ok: false; error: string }
> {
  await cleanupExpiredHolds();

  if (isPastSlot(input.date, input.startTime)) {
    return { ok: false, error: "Η ώρα έχει περάσει." };
  }

  const slots = await getSlotsForDate(input.date);
  const slot = slots.find((s) => s.time === input.startTime);
  if (!slot || slot.status !== "AVAILABLE") {
    return { ok: false, error: "Η ώρα δεν είναι πλέον διαθέσιμη." };
  }

  const expiresAt = new Date(Date.now() + HOLD_DURATION_MS);
  const holdToken = createHoldToken();
  const date = parseDateOnly(input.date);
  const endTime = getEndTime(input.startTime);

  try {
    const booking = await prisma.$transaction(async (tx) => {
      await tx.slotReservation.create({
        data: {
          date,
          startTime: input.startTime,
          expiresAt,
          booking: {
            create: {
              language: input.language,
              lessonType: input.lessonType,
              date,
              startTime: input.startTime,
              endTime,
              status: "PENDING_HOLD",
              holdExpiresAt: expiresAt,
              holdToken,
            },
          },
        },
      });

      return tx.booking.findUniqueOrThrow({ where: { holdToken } });
    });

    return { ok: true, holdToken, expiresAt, bookingId: booking.id };
  } catch {
    return { ok: false, error: "Η ώρα μόλις κρατήθηκε από άλλον χρήστη. Δοκίμασε άλλη." };
  }
}

export async function releaseHold(holdToken: string): Promise<void> {
  const booking = await prisma.booking.findUnique({ where: { holdToken } });
  if (!booking || booking.status !== "PENDING_HOLD") return;

  await prisma.$transaction([
    prisma.slotReservation.deleteMany({ where: { bookingId: booking.id } }),
    prisma.booking.update({
      where: { id: booking.id },
      data: { status: "EXPIRED" },
    }),
  ]);
}

export async function confirmBooking(
  input: ConfirmBookingInput,
): Promise<{ ok: true; booking: Booking } | { ok: false; error: string }> {
  await cleanupExpiredHolds();

  const booking = await prisma.booking.findUnique({
    where: { holdToken: input.holdToken },
    include: { slotReservation: true },
  });

  if (!booking) {
    return { ok: false, error: "Η κράτηση δεν βρέθηκε." };
  }
  if (booking.status !== "PENDING_HOLD") {
    return { ok: false, error: "Η κράτηση δεν είναι ενεργή." };
  }
  if (!booking.holdExpiresAt || booking.holdExpiresAt.getTime() <= Date.now()) {
    await releaseHold(input.holdToken);
    return { ok: false, error: "Το χρονικό όριο της κράτησης έληξε. Επίλεξε ξανά ώρα." };
  }

  try {
    const confirmed = await prisma.$transaction(async (tx) => {
      await tx.slotReservation.update({
        where: { bookingId: booking.id },
        data: { expiresAt: null },
      });

      return tx.booking.update({
        where: { id: booking.id },
        data: {
          name: input.name.trim(),
          email: input.email.trim().toLowerCase(),
          phone: input.phone.trim(),
          ageGroup: input.ageGroup.trim(),
          estimatedLevel: input.estimatedLevel?.trim() || null,
          goal: input.goal?.trim() || null,
          message: input.message?.trim() || null,
          status: "CONFIRMED",
          holdExpiresAt: null,
        },
      });
    });

    return { ok: true, booking: confirmed };
  } catch {
    return { ok: false, error: "Αποτυχία επιβεβαίωσης. Δοκίμασε ξανά." };
  }
}

export async function getBookingByHoldToken(holdToken: string) {
  await cleanupExpiredHolds();
  return prisma.booking.findUnique({ where: { holdToken } });
}

export async function listBookings(filters?: {
  from?: Date;
  to?: Date;
  status?: BookingStatus | BookingStatus[];
}) {
  await cleanupExpiredHolds();

  const where: Prisma.BookingWhereInput = {};
  if (filters?.from || filters?.to) {
    where.date = {};
    if (filters.from) where.date.gte = filters.from;
    if (filters.to) where.date.lte = filters.to;
  }
  if (filters?.status) {
    where.status = Array.isArray(filters.status)
      ? { in: filters.status }
      : filters.status;
  }

  return prisma.booking.findMany({
    where,
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });
}

export async function getUpcomingConfirmed(limit = 10) {
  const today = parseDateOnly(new Date().toISOString().slice(0, 10));
  return prisma.booking.findMany({
    where: {
      status: "CONFIRMED",
      date: { gte: today },
    },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
    take: limit,
  });
}

export async function getBookingStats() {
  await cleanupExpiredHolds();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [todayCount, pending, confirmed, cancelled, expired, totalStarts] =
    await Promise.all([
      prisma.booking.count({ where: { createdAt: { gte: today } } }),
      prisma.booking.count({ where: { status: "PENDING_HOLD" } }),
      prisma.booking.count({ where: { status: "CONFIRMED" } }),
      prisma.booking.count({ where: { status: "CANCELLED" } }),
      prisma.booking.count({ where: { status: "EXPIRED" } }),
      prisma.bookingEvent.count({
        where: { event: "booking_start", createdAt: { gte: today } },
      }),
    ]);

  const confirmedToday = await prisma.booking.count({
    where: {
      status: "CONFIRMED",
      updatedAt: { gte: today },
    },
  });

  return {
    todayCount,
    pending,
    confirmed,
    cancelled,
    expired,
    totalStarts,
    confirmedToday,
    conversionRate:
      totalStarts > 0 ? Math.round((confirmedToday / totalStarts) * 100) : 0,
  };
}

export async function recordBookingEvent(event: string, sessionId?: string) {
  await prisma.bookingEvent.create({
    data: { event, sessionId: sessionId ?? null },
  });
}

export async function adminConfirmBooking(id: string) {
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) throw new Error("Not found");
  if (booking.status === "CONFIRMED") return booking;

  return prisma.$transaction(async (tx) => {
    const existing = await tx.slotReservation.findUnique({
      where: { date_startTime: { date: booking.date, startTime: booking.startTime } },
    });

    if (!existing) {
      await tx.slotReservation.create({
        data: {
          date: booking.date,
          startTime: booking.startTime,
          bookingId: booking.id,
          expiresAt: null,
        },
      });
    } else if (existing.bookingId !== booking.id) {
      throw new Error("Slot occupied");
    }

    return tx.booking.update({
      where: { id },
      data: { status: "CONFIRMED", holdExpiresAt: null },
    });
  });
}

export async function adminCancelBooking(id: string) {
  return prisma.$transaction(async (tx) => {
    await tx.slotReservation.deleteMany({ where: { bookingId: id } });
    return tx.booking.update({
      where: { id },
      data: { status: "CANCELLED" },
    });
  });
}

export async function adminRescheduleBooking(
  id: string,
  dateStr: string,
  startTime: string,
) {
  await cleanupExpiredHolds();

  const slots = await getSlotsForDate(dateStr);
  const slot = slots.find((s) => s.time === startTime);
  if (!slot || slot.status !== "AVAILABLE") {
    throw new Error("Slot not available");
  }

  const date = parseDateOnly(dateStr);
  const endTime = getEndTime(startTime);

  return prisma.$transaction(async (tx) => {
    await tx.slotReservation.deleteMany({ where: { bookingId: id } });
    await tx.slotReservation.create({
      data: {
        date,
        startTime,
        bookingId: id,
        expiresAt: null,
      },
    });
    return tx.booking.update({
      where: { id },
      data: { date, startTime, endTime, status: "CONFIRMED", holdExpiresAt: null },
    });
  });
}

export async function adminAddNote(id: string, note: string) {
  return prisma.booking.update({
    where: { id },
    data: { adminNote: note },
  });
}
