"use client";

import { useEffect } from "react";

export function BannerImpressionPing({
  bannerId,
  pagePath,
}: {
  bannerId: string;
  pagePath: string;
}) {
  useEffect(() => {
    const body = JSON.stringify({ bannerId, pagePath });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/banner-impression",
        new Blob([body], { type: "application/json" }),
      );
    } else {
      fetch("/api/banner-impression", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
    // Fire once per mount - a banner shown twice on one page is two impressions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bannerId]);

  return null;
}
