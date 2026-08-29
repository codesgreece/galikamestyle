import { NextRequest, NextResponse } from "next/server";
import { releaseHold } from "@/services/booking";

export async function POST(request: NextRequest) {
  let body: { holdToken?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.holdToken) {
    return NextResponse.json({ error: "Missing holdToken" }, { status: 400 });
  }

  await releaseHold(body.holdToken);
  return NextResponse.json({ ok: true });
}
