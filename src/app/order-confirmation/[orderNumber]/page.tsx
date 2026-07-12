import React from "react";
import type { Metadata } from "next";
import OrderConfirmationMain from "@/pages/order/order-confirmation-main";

export const metadata: Metadata = { title: "Order Confirmed — Shizenta" };

export default async function OrderConfirmationPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  return <OrderConfirmationMain orderNumber={orderNumber} />;
}
