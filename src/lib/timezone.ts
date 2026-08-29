/** Europe/Athens timezone helpers for booking slots. */

export const BOOKING_TIMEZONE = "Europe/Athens";
export const HOLD_DURATION_MS = 5 * 60 * 1000;
export const SESSION_DURATION_MINUTES = 60;

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: BOOKING_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const partsFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: BOOKING_TIMEZONE,
  weekday: "short",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: false,
});

export function getAthensDateString(date: Date = new Date()): string {
  return dateFormatter.format(date);
}

export function parseDateOnly(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function getAthensDayOfWeek(dateStr: string): number {
  const date = parseDateOnly(dateStr);
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: BOOKING_TIMEZONE,
    weekday: "short",
  }).format(date);
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[weekday] ?? 0;
}

export function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function formatMinutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function generateTimeSlots(startTime: string, endTime: string, intervalMinutes = 60): string[] {
  const start = parseTimeToMinutes(startTime);
  const end = parseTimeToMinutes(endTime);
  const slots: string[] = [];
  for (let t = start; t + intervalMinutes <= end; t += intervalMinutes) {
    slots.push(formatMinutesToTime(t));
  }
  return slots;
}

export function addMinutesToTime(time: string, minutes: number): string {
  return formatMinutesToTime(parseTimeToMinutes(time) + minutes);
}

/** Build UTC instant for a date+time in Athens. */
export function athensDateTimeToUtc(dateStr: string, timeStr: string): Date {
  const probe = new Date(`${dateStr}T12:00:00Z`);
  const parts = partsFormatter.formatToParts(probe);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "0";
  const displayedHour = Number(get("hour"));
  const offsetHours = displayedHour - 12;

  const [y, mo, d] = dateStr.split("-").map(Number);
  const [h, mi] = timeStr.split(":").map(Number);
  return new Date(Date.UTC(y, mo - 1, d, h - offsetHours, mi, 0, 0));
}

export function isPastSlot(dateStr: string, timeStr: string, now = new Date()): boolean {
  return athensDateTimeToUtc(dateStr, timeStr).getTime() <= now.getTime();
}

export function formatGreekDate(dateStr: string): string {
  const date = parseDateOnly(dateStr);
  return new Intl.DateTimeFormat("el-GR", {
    timeZone: BOOKING_TIMEZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatGreekShortDate(dateStr: string): string {
  const date = parseDateOnly(dateStr);
  return new Intl.DateTimeFormat("el-GR", {
    timeZone: BOOKING_TIMEZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}
