"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Wrapper from "@/layouts/wrapper";
import FooterSix from "@/layouts/footers/footer-six";
import HeaderSix from "@/layouts/headers/header-six";
import SmartImage from "@/components/ui/smart-image";
import { formatINR, getProductById } from "@/data/catalog";
import { getOrderByNumber, Order } from "@/lib/orders";

const OrderConfirmationMain = ({ orderNumber }: { orderNumber: string }) => {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  useEffect(() => { setOrder(getOrderByNumber(orderNumber) ?? null); }, [orderNumber]);

  return (
    <Wrapper>
      <HeaderSix />
      <main className="mr-page-pt">
        <section className="mr-oc">
          <div className="container container-1300">
            {order === undefined ? (
              <div className="mr-oc-loading">Loading your order…</div>
            ) : !order ? (
              <div className="mr-shop-empty"><div className="mr-shop-empty-glyph">❖</div><h3>Order not found</h3><p>We couldn’t find order {orderNumber}.</p><Link href="/account?tab=orders" className="mr-btn-solid">View my orders</Link></div>
            ) : (
              <>
                <div className="mr-oc-hero">
                  <div className="mr-oc-check"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg></div>
                  <span className="mr-oc-sub">Thank you for your patronage</span>
                  <h1 className="mr-oc-title">Your Order is Confirmed</h1>
                  <p className="mr-oc-desc">A confirmation has been sent to your email. Our concierge will reach out to schedule your white-glove delivery.</p>
                  <div className="mr-oc-meta">
                    <div><span>Order Number</span><strong>{order.orderNumber}</strong></div>
                    <div><span>Estimated Delivery</span><strong>{order.estimatedDelivery}</strong></div>
                    <div><span>Payment</span><strong>{order.paymentLabel}</strong></div>
                  </div>
                  <div className="mr-oc-actions"><Link href={`/track-order?order=${order.orderNumber}`} className="mr-btn-gold">Track Order</Link><Link href={`/invoice/${order.orderNumber}`} className="mr-btn-solid">Download Invoice</Link><Link href="/shop" className="mr-btn-outline">Continue Shopping</Link></div>
                </div>

                <div className="mr-oc-grid">
                  <div className="mr-oc-panel">
                    <h3>Order Details</h3>
                    <div className="mr-oc-items">
                      {order.items.map((it, i) => (
                        <div className="mr-oc-item" key={i}>
                          <Link href={`/shop-details/${it.slug}`} className="mr-oc-item-thumb"><SmartImage src={getProductById(it.productId)?.image} alt={it.name} ratio="1 / 1" /></Link>
                          <div className="mr-oc-item-info"><Link href={`/shop-details/${it.slug}`}>{it.name}</Link><small>{it.color ? `${it.color} • ` : ""}Qty {it.qty}</small></div>
                          <div className="mr-oc-item-price">{formatINR(it.price * it.qty)}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mr-cart-summary-rows mr-oc-totals">
                      <div className="mr-cart-summary-row"><span>Subtotal</span><span>{formatINR(order.subtotal)}</span></div>
                      {order.discount > 0 && <div className="mr-cart-summary-row mr-save"><span>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</span><span>− {formatINR(order.discount)}</span></div>}
                      <div className="mr-cart-summary-row"><span>Delivery</span><span className={order.shipping === 0 ? "mr-free" : ""}>{order.shipping === 0 ? "Free" : formatINR(order.shipping)}</span></div>
                    </div>
                    <div className="mr-cart-summary-total"><span>Total Paid</span><span>{formatINR(order.total)}</span></div>
                  </div>

                  <div className="mr-oc-panel">
                    <h3>Delivery Address</h3>
                    <p className="mr-oc-address"><strong>{order.address.name}</strong> • {order.address.phone}<br />{order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ""}<br />{order.address.city}, {order.address.state} — {order.address.pincode}</p>
                    {order.gstInvoice && <p className="mr-oc-gst">GST Invoice: {order.gstInvoice.businessName} ({order.gstInvoice.gstin})</p>}
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
