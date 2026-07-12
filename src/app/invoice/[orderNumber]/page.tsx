import type { Metadata } from "next";
import InvoiceMain from "@/pages/invoice/invoice-main";

export const metadata: Metadata = { title: "Invoice — Shizenta" };

export default async function InvoicePage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  return <InvoiceMain orderNumber={orderNumber} />;
}
