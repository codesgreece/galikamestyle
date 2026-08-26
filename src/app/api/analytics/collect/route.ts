import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { analyticsCollectSchema } from "@/validations";
import { createAnonymousVisitorId, recordPageView } from "@/services/analytics";
import { VISITOR_COOKIE } from "@/lib/constants";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = analyticsCollectSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const jar = await cookies();
    let visitor = jar.get(VISITOR_COOKIE)?.value;
    const response = NextResponse.json({ ok: true });

    if (!visitor) {
      visitor = createAnonymousVisitorId();
      response.cookies.set(VISITOR_COOKIE, visitor, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    }

    await recordPageView({
      path: parsed.data.path,
      visitorRaw: visitor,
      referrer: parsed.data.referrer,
      deviceType: parsed.data.deviceType,
    });

    return response;
  } catch {
    return NextResponse.json({ ok: false }, { status: 204 });
  }
}
