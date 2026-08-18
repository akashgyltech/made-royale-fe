import InvoiceMain from "@/page-content/invoice/invoice-main";

export const metadata = { title: "Invoice — Shizenta" };
export default async function InvoicePage({ params }) {
    const { orderNumber } = await params;
    return <InvoiceMain orderNumber={orderNumber}/>;
}
