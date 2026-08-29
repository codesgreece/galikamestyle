import { prisma } from "@/lib/db";
import {
  addMinutesToTime,
  generateTimeSlots,
  getAthensDateString,
  getAthensDayOfWeek,
  isPastSlot,
  parseDateOnly,
  SESSION_DURATION_MINUTES,
} from "@/lib/timezone";

export type SlotStatus = "AVAILABLE" | "BOOKED" | "HOLD";

export type TimeSlot = {
  time: string;
  status: SlotStatus;
};

export async function cleanupExpiredHolds() {
  const now = new Date();
  const expired = await prisma.booking.findMany({
    where: {
      status: "PENDING_HOLD",
      holdExpiresAt: { lt: now },
    },
    select: { id: true },
  });

  if (expired.length === 0) return;

  await prisma.$transaction([
    prisma.slotReservation.deleteMany({
      where: { bookingId: { in: expired.map((b) => b.id) } },
    }),
    prisma.booking.updateMany({
      where: { id: { in: expired.map((b) => b.id) } },
      data: { status: "EXPIRED" },
    }),
  ]);
}

export async function isDateBlocked(dateStr: string): Promise<boolean> {
  const date = parseDateOnly(dateStr);
  const blocked = await prisma.blockedDate.findUnique({ where: { date } });
  return !!blocked;
}

export async function getAvailableDates(fromDays = 0, toDays = 60): Promise<string[]> {
  await cleanupExpiredHolds();

  const today = getAthensDateString();
  const dates: string[] = [];

  for (let i = fromDays; i <= toDays; i++) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() + i);
    const dateStr = getAthensDateString(d);
    if (dateStr < today) continue;
    if (await isDateBlocked(dateStr)) continue;

    const dayOfWeek = getAthensDayOfWeek(dateStr);
    const rules = await prisma.availabilityRule.findMany({
      where: {
        dayOfWeek,
        schedule: { isActive: true },
      },
    });
    if (rules.length === 0) continue;

    const slots = await getSlotsForDate(dateStr);
    if (slots.some((s) => s.status === "AVAILABLE")) {
      dates.push(dateStr);
    }
  }

  return dates;
}

export async function getSlotsForDate(dateStr: string): Promise<TimeSlot[]> {
  await cleanupExpiredHolds();

  const today = getAthensDateString();
  if (dateStr < today) return [];
  if (await isDateBlocked(dateStr)) return [];

  const dayOfWeek = getAthensDayOfWeek(dateStr);
  const rules = await prisma.availabilityRule.findMany({
    where: {
      dayOfWeek,
      schedule: { isActive: true },
    },
  });

  if (rules.length === 0) return [];

  const allSlots = new Set<string>();
  for (const rule of rules) {
    for (const slot of generateTimeSlots(rule.startTime, rule.endTime, SESSION_DURATION_MINUTES)) {
      allSlots.add(slot);
    }
  }

  const sortedSlots = [...allSlots].sort();

  const reservations = await prisma.slotReservation.findMany({
    where: { date: parseDateOnly(dateStr) },
    include: { booking: { select: { status: true, holdExpiresAt: true } } },
  });

  const reservationMap = new Map(
    reservations.map((r) => [r.startTime, r]),
  );

  return sortedSlots
    .filter((time) => !isPastSlot(dateStr, time))
    .map((time) => {
      const reservation = reservationMap.get(time);
      if (!reservation) {
        return { time, status: "AVAILABLE" as SlotStatus };
      }

      const booking = reservation.booking;
      if (booking.status === "CONFIRMED") {
        return { time, status: "BOOKED" as SlotStatus };
      }
      if (
        booking.status === "PENDING_HOLD" &&
        reservation.expiresAt &&
        reservation.expiresAt.getTime() > Date.now()
      ) {
        return { time, status: "HOLD" as SlotStatus };
      }
      return { time, status: "AVAILABLE" as SlotStatus };
    });
}

export function getEndTime(startTime: string): string {
  return addMinutesToTime(startTime, SESSION_DURATION_MINUTES);
}
