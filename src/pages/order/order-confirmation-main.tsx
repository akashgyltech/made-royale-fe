"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Wrapper from "@/layouts/wrapper";
import FooterSix from "@/layouts/footers/footer-six";
import HeaderSix from "@/layouts/headers/header-six";
import SmartImage from "@/components/ui/smart-image";
import { formatINR } from "@/data/catalog";
import { useAuth } from "@/provider/AuthProvider";
import { useCart } from "@/provider/CartProvider";
import { useToast } from "@/provider/ToastProvider";
import { orderApi, paymentApi } from "@/lib/store-api";
import { openRazorpayCheckout, type RazorpayHandlerResponse } from "@/lib/razorpay";
import { STATUS_LABELS } from "@/lib/order-status";
import type { BackendOrder } from "@/types/backend";

const PAYMENT_METHOD_LABEL: Record<BackendOrder["payment"]["method"], string> = {
  cod: "Cash on Delivery",
  razorpay: "Razorpay (Online Payment)",
  stripe: "Card Payment",
};
const PAYMENT_STATUS_LABEL: Record<BackendOrder["payment"]["status"], string> = {
  pending: "Payment Pending",
  paid: "Paid",
  failed: "Payment Failed",
  refunded: "Refunded",
  partial_refund: "Partially Refunded",
};

const OrderConfirmationMain = ({ orderNumber }: { orderNumber: string }) => {
  const { isLoggedIn, isInitializing, openAuthModal, user } = useAuth();
  const { clearCart } = useCart();
  const { toast } = useToast();
  const [order, setOrder] = useState<BackendOrder | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  const load = useCallback(async () => {
    setOrder(undefined);
    setError(null);
    try {
      const o = await orderApi.getOrderByNumber(orderNumber);
      setOrder(o);
    } catch (err) {
      setOrder(null);
      setError(err instanceof Error ? err.message : "Could not load this order");
    }
  }, [orderNumber]);

  useEffect(() => {
    if (isInitializing || !isLoggedIn) return;
    void load();
  }, [isInitializing, isLoggedIn, load]);

  const retryPayment = async () => {
    if (!order) return;
    setRetrying(true);
    try {
      const rp = await paymentApi.createRazorpayOrder(order.id);
      const rzp = await openRazorpayCheckout({
        key: rp.keyId,
        amount: rp.amount,
        currency: rp.currency,
        order_id: rp.razorpayOrderId,
        name: "Made Royale",
        description: `Order ${rp.orderNumber}`,
        prefill: { name: order.shippingAddress.name, contact: order.shippingAddress.phone, email: user?.email || "" },
        theme: { color: "#b8965a" },
        handler: async (response: RazorpayHandlerResponse) => {
          try {
            await paymentApi.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId: order.id,
            });
            clearCart();
            toast("Payment successful!", "success");
            void load();
          } catch {
            toast("Payment received but verification failed. Our team will confirm shortly.", "error");
          } finally {
            setRetrying(false);
          }
        },
        modal: { ondismiss: () => setRetrying(false) },
      });
      rzp.on("payment.failed", () => { setRetrying(false); toast("Payment failed. You can retry anytime.", "error"); });
    } catch (err) {
      setRetrying(false);
      toast(err instanceof Error ? err.message : "Could not start payment", "error");
    }
  };

  const canRetryPayment = !!order && order.payment.method === "razorpay" && (order.payment.status === "pending" || order.payment.status === "failed") && order.status !== "cancelled";

  return (
    <Wrapper>
      <HeaderSix />
      <main className="mr-page-pt">
        <section className="mr-oc">
          <div className="container container-1300">
            {isInitializing ? (
              <div className="mr-oc-loading">Loading…</div>
            ) : !isLoggedIn ? (
              <div className="mr-shop-empty">
                <div className="mr-shop-empty-glyph">🔐</div>
                <h3>Sign in to view this order</h3>
                <p>Order details are only visible to the customer who placed the order.</p>
                <button className="mr-btn-solid" onClick={() => openAuthModal("login")}>Sign In</button>
              </div>
            ) : order === undefined ? (
              <div className="mr-oc-loading">Loading your order…</div>
            ) : !order ? (
              <div className="mr-shop-empty"><div className="mr-shop-empty-glyph">❖</div><h3>Order not found</h3><p>{error || `We couldn’t find order ${orderNumber}.`}</p><Link href="/account?tab=orders" className="mr-btn-solid">View my orders</Link></div>
            ) : (
              <>
                <div className="mr-oc-hero">
                  <div className="mr-oc-check"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg></div>
                  <span className="mr-oc-sub">Thank you for your patronage</span>
                  <h1 className="mr-oc-title">{order.payment.status === "paid" || order.payment.method === "cod" ? "Your Order is Confirmed" : "Your Order is Placed"}</h1>
                  <p className="mr-oc-desc">A confirmation has been sent to your email. Our concierge will reach out to schedule your white-glove delivery.</p>
                  <div className="mr-oc-meta">
                    <div><span>Order Number</span><strong>{order.orderNumber}</strong></div>
                    <div><span>Status</span><strong>{STATUS_LABELS[order.status]}</strong></div>
                    <div><span>Payment</span><strong>{PAYMENT_METHOD_LABEL[order.payment.method]} · {PAYMENT_STATUS_LABEL[order.payment.status]}</strong></div>
                  </div>
                  <div className="mr-oc-actions">
                    {canRetryPayment && <button className="mr-btn-gold" onClick={() => void retryPayment()} disabled={retrying}>{retrying ? "Processing…" : "Complete Payment"}</button>}
                    <Link href={`/track-order?order=${order.orderNumber}`} className="mr-btn-solid">Track Order</Link>
                    <Link href={`/invoice/${order.orderNumber}`} className="mr-btn-outline">View Invoice</Link>
                    <Link href="/shop" className="mr-btn-outline">Continue Shopping</Link>
                  </div>
                </div>

                <div className="mr-oc-grid">
                  <div className="mr-oc-panel">
                    <h3>Order Details</h3>
                    <div className="mr-oc-items">
                      {order.items.map((it) => (
                        <div className="mr-oc-item" key={it.id}>
                          <div className="mr-oc-item-thumb"><SmartImage src={it.image} alt={it.name} ratio="1 / 1" /></div>
                          <div className="mr-oc-item-info"><span style={{ fontSize: 14, color: "var(--mr-charcoal)" }}>{it.name}</span><small>{it.customizations?.length ? `${it.customizations.map((c) => c.optionLabel).join(", ")} • ` : ""}Qty {it.quantity}</small></div>
                          <div className="mr-oc-item-price">{formatINR(it.total)}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mr-cart-summary-rows mr-oc-totals">
                      <div className="mr-cart-summary-row"><span>Subtotal</span><span>{formatINR(order.pricing.subtotal)}</span></div>
                      {order.pricing.couponDiscount > 0 && <div className="mr-cart-summary-row mr-save"><span>Coupon{order.pricing.couponCode ? ` (${order.pricing.couponCode})` : ""}</span><span>− {formatINR(order.pricing.couponDiscount)}</span></div>}
                      <div className="mr-cart-summary-row"><span>Shipping</span><span className={order.pricing.shippingCharge === 0 ? "mr-free" : ""}>{order.pricing.shippingCharge === 0 ? "Free" : formatINR(order.pricing.shippingCharge)}</span></div>
                      {order.gstDetails.isInterState ? (
                        <div className="mr-cart-summary-row"><span>IGST</span><span>{formatINR(order.pricing.igst)}</span></div>
                      ) : (
                        <>
                          <div className="mr-cart-summary-row"><span>CGST</span><span>{formatINR(order.pricing.cgst)}</span></div>
                          <div className="mr-cart-summary-row"><span>SGST</span><span>{formatINR(order.pricing.sgst)}</span></div>
                        </>
                      )}
                    </div>
                    <div className="mr-cart-summary-total"><span>Total Paid</span><span>{formatINR(order.pricing.grandTotal)}</span></div>
                  </div>

                  <div className="mr-oc-panel">
                    <h3>Delivery Address</h3>
                    <p className="mr-oc-address"><strong>{order.shippingAddress.name}</strong> • {order.shippingAddress.phone}<br />{order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}<br />{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</p>
                    {order.gstDetails.buyerGstin && <p className="mr-oc-gst">GST Invoice: {order.gstDetails.buyerBusinessName} ({order.gstDetails.buyerGstin})</p>}
                    <div className="mr-oc-assure"><div><span>🛡️</span> Assured warranty on every piece</div><div><span>🚚</span> Free white-glove delivery & installation</div><div><span>↩️</span> 7-day easy returns</div></div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <FooterSix />
    </Wrapper>
  );
};

export default OrderConfirmationMain;
