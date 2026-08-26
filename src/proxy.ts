import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/constants";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admingermanika")) {
    return NextResponse.next();
  }

  const isLogin = pathname === "/admingermanika/login";
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  if (!hasSession && !isLogin && pathname !== "/admingermanika") {
    const loginUrl = new URL("/admingermanika/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!hasSession && pathname === "/admingermanika") {
    return NextResponse.redirect(new URL("/admingermanika/login", request.url));
  }

  if (hasSession && isLogin) {
    return NextResponse.redirect(
      new URL("/admingermanika/dashboard", request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admingermanika", "/admingermanika/:path*"],
};
