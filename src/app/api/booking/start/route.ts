import { NextRequest, NextResponse } from "next/server";
import { recordBookingEvent } from "@/services/booking";

export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get("gms_visitor")?.value;
  await recordBookingEvent("booking_start", sessionId);
  return NextResponse.json({ ok: true });
}
