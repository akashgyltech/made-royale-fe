import React, { Suspense } from "react";
import type { Metadata } from "next";
import TrackOrderMain from "@/pages/order/track-order-main";

export const metadata: Metadata = { title: "Track Order — Made Royale" };

export default function TrackOrderPage() {
  return (
    <Suspense fallback={null}>
      <TrackOrderMain />
    </Suspense>
  );
}
