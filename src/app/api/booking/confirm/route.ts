import { NextRequest, NextResponse } from "next/server";
import { bookingConfirmSchema } from "@/validations";
import { confirmBooking, recordBookingEvent } from "@/services/booking";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bookingConfirmSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      fieldErrors[key] = fieldErrors[key] ?? [];
      fieldErrors[key].push(issue.message);
    }
    return NextResponse.json({ error: "Validation failed", fieldErrors }, { status: 400 });
  }

  const sessionId = request.cookies.get("gms_visitor")?.value;
  await recordBookingEvent("confirm_attempt", sessionId);

  const result = await confirmBooking(parsed.data);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }

  await recordBookingEvent("booking_confirmed", sessionId);

  return NextResponse.json({
    booking: {
      id: result.booking.id,
      date: result.booking.date.toISOString().slice(0, 10),
      startTime: result.booking.startTime,
      endTime: result.booking.endTime,
      language: result.booking.language,
      lessonType: result.booking.lessonType,
      name: result.booking.name,
    },
  });
}
