import { NextRequest, NextResponse } from "next/server";
import { bookingHoldSchema } from "@/validations";
import { createHold, recordBookingEvent } from "@/services/booking";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bookingHoldSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const sessionId = request.cookies.get("gms_visitor")?.value;
  await recordBookingEvent("hold_attempt", sessionId);

  const result = await createHold(parsed.data);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }

  return NextResponse.json({
    holdToken: result.holdToken,
    expiresAt: result.expiresAt.toISOString(),
    bookingId: result.bookingId,
  });
}
