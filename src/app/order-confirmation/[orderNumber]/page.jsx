import React from "react";
import OrderConfirmationMain from "@/page-content/order/order-confirmation-main";
export const metadata = { title: "Order Confirmed — Shizenta" };
export default async function OrderConfirmationPage({ params }) {
    const { orderNumber } = await params;
    return <OrderConfirmationMain orderNumber={orderNumber}/>;
}
