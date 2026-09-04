import { jsPDF } from "jspdf";
import "jspdf-autotable";

const FALLBACK_SELLER = {
  tradeName: "Shizenta",
  legalName: "Alphaomega International Company",
  gstin: "",
  email: "care@shizenta.com",
  address: { line1: "4th Floor, Design Arcade, Andheri East", city: "Mumbai", state: "Maharashtra", pincode: "400069" },
};

const resolveSeller = (order) => {
  const seller = order.invoiceSnapshot?.seller || FALLBACK_SELLER;
  const addr = seller.address || FALLBACK_SELLER.address;
  return {
    brand: seller.tradeName || FALLBACK_SELLER.tradeName,
    legalName: seller.legalName || FALLBACK_SELLER.legalName,
    gstin: seller.gstin || "",
    email: seller.email || FALLBACK_SELLER.email,
    addressLines: [addr.line1, addr.line2, `${addr.city || ""}, ${addr.state || ""} ${addr.pincode || ""}`.trim()].filter(Boolean),
  };
};

const resolveFooterNote = (order) =>
  order.invoiceSnapshot?.footerNote ||
  "Prices are inclusive of all applicable taxes. This is a computer-generated invoice and does not require a signature. Thank you for choosing Shizenta.";

const PAYMENT_METHOD_LABEL = {
  cod: "Cash on Delivery",
  razorpay: "Razorpay (Online Payment)",
  stripe: "Card Payment",
};

const inr = (amount) => `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "";

const addressLines = (addr) =>
  addr
    ? [
        addr.name,
        [addr.line1, addr.line2].filter(Boolean).join(", "),
        `${addr.city || ""}, ${addr.state || ""} - ${addr.pincode || ""}`,
        addr.phone,
      ].filter(Boolean)
    : [];

export function downloadInvoicePdf(order) {
  const seller = resolveSeller(order);
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(seller.brand, margin, 50);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Tax Invoice", pageWidth - margin, 45, { align: "right" });
  doc.text(order.gstDetails?.invoiceNumber || order.orderNumber, pageWidth - margin, 58, { align: "right" });
  doc.text(formatDate(order.gstDetails?.invoiceDate || order.createdAt), pageWidth - margin, 71, { align: "right" });
  doc.text(`Order: ${order.orderNumber}`, pageWidth - margin, 84, { align: "right" });

  let y = 110;
  doc.setFont("helvetica", "bold");
  doc.text("From", margin, y);
  doc.text("Bill To", margin + 260, y);
  doc.setFont("helvetica", "normal");
  const fromLines = [seller.legalName, ...seller.addressLines, seller.email, seller.gstin ? `GSTIN: ${seller.gstin}` : null].filter(Boolean);
  const billLines = addressLines(order.billingAddress);
  fromLines.forEach((line, i) => doc.text(line, margin, y + 16 + i * 13, { maxWidth: 240 }));
  billLines.forEach((line, i) => doc.text(String(line), margin + 260, y + 16 + i * 13, { maxWidth: 240 }));

  if (order.gstDetails?.buyerGstin) {
    const gstY = y + 16 + billLines.length * 13 + 6;
    doc.text(`GSTIN: ${order.gstDetails.buyerGstin}`, margin + 260, gstY);
    if (order.gstDetails.buyerBusinessName) doc.text(order.gstDetails.buyerBusinessName, margin + 260, gstY + 13);
  }

  y += Math.max(fromLines.length, billLines.length + 2) * 13 + 40;

  const rows = (order.items || []).map((item, i) => [
    i + 1,
    [item.name, item.sku ? `SKU: ${item.sku}` : null].filter(Boolean).join("\n"),
    item.quantity,
    inr(item.price),
    inr(item.total),
  ]);

  doc.autoTable({
    startY: y,
    margin: { left: margin, right: margin },
    head: [["#", "Item", "Qty", "Unit Price", "Amount"]],
    body: rows,
    styles: { fontSize: 9, cellPadding: 6 },
    headStyles: { fillColor: [184, 150, 90] },
    columnStyles: {
      0: { cellWidth: 25 },
      2: { cellWidth: 40, halign: "center" },
      3: { cellWidth: 80, halign: "right" },
      4: { cellWidth: 80, halign: "right" },
    },
  });

  let sy = doc.lastAutoTable.finalY + 20;
  const pricing = order.pricing || {};
  const summaryRows = [["Subtotal", inr(pricing.subtotal)]];
  if (pricing.couponDiscount > 0) {
    summaryRows.push([`Coupon${pricing.couponCode ? ` (${pricing.couponCode})` : ""}`, `- ${inr(pricing.couponDiscount)}`]);
  }
  summaryRows.push(["Shipping", pricing.shippingCharge === 0 ? "Free" : inr(pricing.shippingCharge)]);
  if (order.gstDetails?.isInterState) {
    summaryRows.push(["IGST", inr(pricing.igst)]);
  } else {
    summaryRows.push(["CGST", inr(pricing.cgst)]);
    summaryRows.push(["SGST", inr(pricing.sgst)]);
  }

  doc.setFontSize(10);
  const summaryX = pageWidth - margin - 220;
  summaryRows.forEach(([label, value]) => {
    doc.text(label, summaryX, sy);
    doc.text(value, pageWidth - margin, sy, { align: "right" });
    sy += 16;
  });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Total Paid", summaryX, sy + 4);
  doc.text(inr(pricing.grandTotal), pageWidth - margin, sy + 4, { align: "right" });

  sy += 40;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Payment: ${PAYMENT_METHOD_LABEL[order.payment?.method] || order.payment?.method || "-"}`, margin, sy);

  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text(resolveFooterNote(order), margin, doc.internal.pageSize.getHeight() - 30, {
    maxWidth: pageWidth - margin * 2,
  });

  doc.save(`Invoice-${order.orderNumber}.pdf`);
}
