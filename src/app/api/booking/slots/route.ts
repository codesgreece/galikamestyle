import { NextRequest, NextResponse } from "next/server";
import { getSlotsForDate } from "@/services/booking-availability";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  try {
    const slots = await getSlotsForDate(date);
    return NextResponse.json({ slots });
  } catch {
    return NextResponse.json({ slots: [] });
  }
}
