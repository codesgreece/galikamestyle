import { NextResponse } from "next/server";
import { getAvailableDates } from "@/services/booking-availability";

export async function GET() {
  try {
    const dates = await getAvailableDates(0, 90);
    return NextResponse.json({ dates });
  } catch {
    return NextResponse.json({ dates: [] });
  }
}
