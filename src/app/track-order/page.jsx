import React, { Suspense } from "react";
import TrackOrderMain from "@/page-content/order/track-order-main";

export const metadata = { title: "Track Order — Shizenta" };
export default function TrackOrderPage() {
    return (<Suspense fallback={null}>
      <TrackOrderMain />
    </Suspense>);
}
