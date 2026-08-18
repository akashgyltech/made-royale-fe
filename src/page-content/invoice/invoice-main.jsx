"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Wrapper from "@/layouts/wrapper";
import HeaderSix from "@/layouts/headers/header-six";
import FooterSix from "@/layouts/footers/footer-six";
import { useAuth } from "@/provider/AuthProvider";
import { orderApi } from "@/lib/store-api";
import { formatINR } from "@/data/catalog";
const PAYMENT_METHOD_LABEL = {
    cod: "Cash on Delivery",
    razorpay: "Razorpay (Online Payment)",
    stripe: "Card Payment",
};
function sameAddress(a, b) {
    return a.line1 === b.line1 && a.city === b.city && a.state === b.state && a.pincode === b.pincode;
}
const InvoiceMain = ({ orderNumber }) => {
    const { isLoggedIn, isInitializing, openAuthModal } = useAuth();
    const [order, setOrder] = useState(undefined);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (isInitializing || !isLoggedIn)
            return;
        setOrder(undefined);
        setError(null);
        orderApi.getOrderByNumber(orderNumber)
            .then(setOrder)
            .catch((err) => { setOrder(null); setError(err instanceof Error ? err.message : "Could not load this invoice"); });
    }, [isInitializing, isLoggedIn, orderNumber]);
    return (<Wrapper>
      <HeaderSix />
      <main>
        <section className="mr-invoice">
          <div className="container container-1000">
            {isInitializing ? (<div className="mr-oc-loading">Loading…</div>) : !isLoggedIn ? (<div className="mr-shop-empty">
                <div className="mr-shop-empty-glyph">🔐</div>
                <h3>Sign in to view this invoice</h3>
                <p>Invoices are only visible to the customer who placed the order.</p>
                <button className="mr-btn-solid" onClick={() => openAuthModal("login")}>Sign In</button>
              </div>) : order === undefined ? (<div className="mr-oc-loading">Loading invoice…</div>) : order === null ? (<div className="mr-shop-empty">
                <div className="mr-shop-empty-glyph">❖</div>
                <h3>Invoice not found</h3>
                <p>{error || <>We couldn&rsquo;t find an order matching <strong>{orderNumber}</strong>.</>}</p>
                <Link href="/account?tab=orders" className="mr-btn-solid">Go to My Orders</Link>
              </div>) : (<>
                <div className="mr-invoice-topbar">
                  <Link href="/account?tab=orders" className="mr-btn-text">← Back to Orders</Link>
                  <button className="mr-btn-solid mr-btn-sm" onClick={() => window.print()}>Print / Download PDF</button>
                </div>
                <InvoiceSheet order={order}/>
              </>)}
          </div>
        </section>
      </main>
      <FooterSix />
    </Wrapper>);
};
function InvoiceSheet({ order }) {
    const date = new Date(order.gstDetails.invoiceDate || order.createdAt || Date.now()).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    const shipToDiffers = !sameAddress(order.billingAddress, order.shippingAddress);
    return (<div className="mr-invoice-sheet">
      <div className="mr-invoice-head">
        <div className="mr-invoice-brand">
          <span className="mr-logo mr-invoice-logo">Made<span> Royale</span></span>
          <p>Nature-Inspired Luxury Furniture</p>
        </div>
        <div className="mr-invoice-meta">
          <span className="mr-invoice-tag">Tax Invoice</span>
          <p><strong>{order.gstDetails.invoiceNumber || order.orderNumber}</strong></p>
          <p>{date}</p>
          <p style={{ fontSize: 11 }}>Order: {order.orderNumber}</p>
        </div>
      </div>

      <div className="mr-invoice-parties">
        <div>
          <span className="mr-invoice-label">From</span>
          <strong>Shizenta Furnishings Pvt. Ltd.</strong>
          <p>4th Floor, Design Arcade, Andheri East<br />Mumbai, Maharashtra 400069<br />care@shizenta.com</p>
        </div>
        <div>
          <span className="mr-invoice-label">Bill To</span>
          <strong>{order.billingAddress.name}</strong>
          <p>
            {order.billingAddress.line1}{order.billingAddress.line2 ? <>, {order.billingAddress.line2}</> : null}<br />
            {order.billingAddress.city}, {order.billingAddress.state} — {order.billingAddress.pincode}<br />
            {order.billingAddress.phone}
          </p>
          {order.gstDetails.buyerGstin && <p className="mr-invoice-gstin">GSTIN: {order.gstDetails.buyerGstin}<br />{order.gstDetails.buyerBusinessName}</p>}
          {shipToDiffers && (<p style={{ marginTop: 10 }}>
              <span className="mr-invoice-label">Ship To</span><br />
              {order.shippingAddress.name}, {order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}, {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
            </p>)}
        </div>
      </div>

      <table className="mr-invoice-table">
        <thead>
          <tr><th>#</th><th>Item</th><th className="ta-c">Qty</th><th className="ta-r">Unit Price</th><th className="ta-r">Amount</th></tr>
        </thead>
        <tbody>
          {order.items.map((it, i) => (<tr key={it.id}>
              <td>{i + 1}</td>
              <td>
                <strong>{it.name}</strong>
                <small>
                  {it.sku ? `SKU: ${it.sku}` : ""}
                  {it.gst?.hsnCode ? ` · HSN: ${it.gst.hsnCode}` : ""}
                  {typeof it.gst?.rate === "number" ? ` · GST ${it.gst.rate}%` : ""}
                  {it.customizations?.length ? ` · ${it.customizations.map((c) => c.optionLabel).join(", ")}` : ""}
                </small>
              </td>
              <td className="ta-c">{it.quantity}</td>
              <td className="ta-r">{formatINR(it.price)}</td>
              <td className="ta-r">{formatINR(it.total)}</td>
            </tr>))}
        </tbody>
      </table>

      <div className="mr-invoice-summary">
        <div className="mr-invoice-summary-box">
          <div className="mr-invoice-srow"><span>Subtotal</span><span>{formatINR(order.pricing.subtotal)}</span></div>
          {order.pricing.couponDiscount > 0 && <div className="mr-invoice-srow"><span>Coupon{order.pricing.couponCode ? ` (${order.pricing.couponCode})` : ""}</span><span>− {formatINR(order.pricing.couponDiscount)}</span></div>}
          <div className="mr-invoice-srow"><span>Shipping</span><span>{order.pricing.shippingCharge === 0 ? "Free" : formatINR(order.pricing.shippingCharge)}</span></div>
          {order.gstDetails.isInterState ? (<div className="mr-invoice-srow"><span>IGST</span><span>{formatINR(order.pricing.igst)}</span></div>) : (<>
              <div className="mr-invoice-srow"><span>CGST</span><span>{formatINR(order.pricing.cgst)}</span></div>
              <div className="mr-invoice-srow"><span>SGST</span><span>{formatINR(order.pricing.sgst)}</span></div>
            </>)}
          <div className="mr-invoice-total"><span>Total Paid</span><span>{formatINR(order.pricing.grandTotal)}</span></div>
        </div>
      </div>

      <div className="mr-invoice-foot">
        <div>
          <span className="mr-invoice-label">Payment</span>
          <p>{PAYMENT_METHOD_LABEL[order.payment.method]}</p>
        </div>
        <div>
          <span className="mr-invoice-label">Estimated Delivery</span>
          <p>{order.shipment.estimatedDelivery ? new Date(order.shipment.estimatedDelivery).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "To be confirmed"}</p>
        </div>
      </div>

      <p className="mr-invoice-note">Prices are inclusive of all applicable taxes. This is a computer-generated invoice and does not require a signature. Thank you for choosing Shizenta.</p>
    </div>);
}
export default InvoiceMain;
