"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function detectDevice(): "mobile" | "desktop" | "tablet" | "unknown" {
  if (typeof window === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/iPad|Tablet/i.test(ua)) return "tablet";
  if (/Mobi|Android/i.test(ua)) return "mobile";
  return "desktop";
}

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admingermanika")) return;

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void fetch("/api/analytics/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: pathname,
          referrer: document.referrer || null,
          deviceType: detectDevice(),
        }),
        signal: controller.signal,
        keepalive: true,
      }).catch(() => undefined);
    }, 50);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [pathname]);

  return null;
}
