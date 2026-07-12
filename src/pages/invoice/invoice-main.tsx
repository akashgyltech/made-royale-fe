"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Wrapper from "@/layouts/wrapper";
import HeaderSix from "@/layouts/headers/header-six";
import FooterSix from "@/layouts/footers/footer-six";
import { getOrderByNumber, Order } from "@/lib/orders";
import { formatINR } from "@/data/catalog";

const InvoiceMain = ({ orderNumber }: { orderNumber: string }) => {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  useEffect(() => { setOrder(getOrderByNumber(orderNumber) ?? null); }, [orderNumber]);

  return (
    <Wrapper>
      <HeaderSix />
      <main>
        <section className="mr-invoice">
          <div className="container container-1000">
            {order === undefined ? (
              <div className="mr-oc-loading">Loading invoice…</div>
            ) : order === null ? (
              <div className="mr-shop-empty">
                <div className="mr-shop-empty-glyph">❖</div>
                <h3>Invoice not found</h3>
                <p>We couldn&rsquo;t find an order matching <strong>{orderNumber}</strong> on this device.</p>
                <Link href="/account?tab=orders" className="mr-btn-solid">Go to My Orders</Link>
              </div>
            ) : (
              <>
                <div className="mr-invoice-topbar">
                  <Link href="/account?tab=orders" className="mr-btn-text">← Back to Orders</Link>
                  <button className="mr-btn-solid mr-btn-sm" onClick={() => window.print()}>Print / Download PDF</button>
                </div>
                <InvoiceSheet order={order} />
              </>
            )}
          </div>
        </section>
      </main>
      <FooterSix />
    </Wrapper>
  );
};

function InvoiceSheet({ order }: { order: Order }) {
  const date = new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  return (
    <div className="mr-invoice-sheet">
      <div className="mr-invoice-head">
        <div className="mr-invoice-brand">
          <span className="mr-logo mr-invoice-logo">Shi<span>zenta</span></span>
          <p>Nature-Inspired Luxury Furniture</p>
        </div>
        <div className="mr-invoice-meta">
          <span className="mr-invoice-tag">Tax Invoice</span>
          <p><strong>{order.orderNumber}</strong></p>
          <p>{date}</p>
        </div>
      </div>

      <div className="mr-invoice-parties">
        <div>
          <span className="mr-invoice-label">From</span>
          <strong>Shizenta Furnishings Pvt. Ltd.</strong>
          <p>4th Floor, Design Arcade, Andheri East<br />Mumbai, Maharashtra 400069<br />GSTIN: 27ABCDE1234F1Z5<br />care@shizenta.com</p>
        </div>
        <div>
          <span className="mr-invoice-label">Bill To</span>
          <strong>{order.address.name}</strong>
          <p>
            {order.address.line1}{order.address.line2 ? <>, {order.address.line2}</> : null}<br />
            {order.address.city}, {order.address.state} — {order.address.pincode}<br />
            {order.address.phone}
          </p>
          {order.gstInvoice?.gstin && <p className="mr-invoice-gstin">GSTIN: {order.gstInvoice.gstin}<br />{order.gstInvoice.businessName}</p>}
        </div>
      </div>

      <table className="mr-invoice-table">
        <thead>
          <tr><th>#</th><th>Item</th><th className="ta-c">Qty</th><th className="ta-r">Unit Price</th><th className="ta-r">Amount</th></tr>
        </thead>
        <tbody>
          {order.items.map((it, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>
                <strong>{it.name}</strong>
                <small>SKU: {it.sku}{it.color ? ` · ${it.color}` : ""}</small>
              </td>
              <td className="ta-c">{it.qty}</td>
              <td className="ta-r">{formatINR(it.price)}</td>
              <td className="ta-r">{formatINR(it.price * it.qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mr-invoice-summary">
        <div className="mr-invoice-summary-box">
          <div className="mr-invoice-srow"><span>Subtotal</span><span>{formatINR(order.subtotal)}</span></div>
          {order.discount > 0 && <div className="mr-invoice-srow"><span>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</span><span>− {formatINR(order.discount)}</span></div>}
          <div className="mr-invoice-srow"><span>Shipping</span><span>{order.shipping === 0 ? "Free" : formatINR(order.shipping)}</span></div>
          <div className="mr-invoice-total"><span>Total Paid</span><span>{formatINR(order.total)}</span></div>
        </div>
      </div>

      <div className="mr-invoice-foot">
        <div>
          <span className="mr-invoice-label">Payment</span>
          <p>{order.paymentLabel}</p>
        </div>
        <div>
          <span className="mr-invoice-label">Estimated Delivery</span>
          <p>{order.estimatedDelivery}</p>
        </div>
      </div>

      <p className="mr-invoice-note">Prices are inclusive of all applicable taxes. This is a computer-generated invoice and does not require a signature. Thank you for choosing Shizenta.</p>
    </div>
  );
}

export default InvoiceMain;
