"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Wrapper from "@/layouts/wrapper";
import FooterSix from "@/layouts/footers/footer-six";
import HeaderSix from "@/layouts/headers/header-six";
import LuxBreadcrumb from "@/components/ui/lux-breadcrumb";
import SmartImage from "@/components/ui/smart-image";
import OrderTimeline from "@/components/order/order-timeline";
import { formatINR } from "@/data/catalog";
import { useAuth } from "@/provider/AuthProvider";
import { orderApi } from "@/lib/store-api";
const TrackOrderMain = () => {
    const params = useSearchParams();
    const { isLoggedIn, isInitializing, openAuthModal } = useAuth();
    const initial = params?.get("order") || "";
    const [input, setInput] = useState(initial);
    const [order, setOrder] = useState(undefined);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false);
    const lookup = useCallback(async (orderNumber) => {
        if (!orderNumber.trim())
            return;
        setSearched(true);
        setOrder(undefined);
        setError(null);
        try {
            const o = await orderApi.getOrderByNumber(orderNumber.trim());
            setOrder(o);
        }
        catch (err) {
            setOrder(null);
            setError(err instanceof Error ? err.message : "Could not find this order");
        }
    }, []);
    useEffect(() => {
        if (isInitializing || !isLoggedIn || !initial)
            return;
        void lookup(initial);
    }, [isInitializing, isLoggedIn, initial, lookup]);
    return (<Wrapper>
      <HeaderSix />
      <main>
        <LuxBreadcrumb subtitle="Order Tracking" title="Track Your Order" crumbs={[{ label: "Home", href: "/" }, { label: "Track Order" }]} image="/images/shizenta-account-bg.webp"/>
        <section className="mr-track">
          <div className="container container-1300">
            {isInitializing ? (<div className="mr-oc-loading">Loading…</div>) : !isLoggedIn ? (<div className="mr-shop-empty">
                <div className="mr-shop-empty-glyph">🔐</div>
                <h3>Sign in to track your order</h3>
                <p>Order tracking is only available to the customer who placed the order — there&rsquo;s no anonymous lookup.</p>
                <button className="mr-btn-solid" onClick={() => openAuthModal("login")}>Sign In</button>
              </div>) : (<>
                <div className="mr-track-search">
                  <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter")
            void lookup(input); }} placeholder="Enter your order number (e.g. MR-20260809-1234)"/>
                  <button className="mr-btn-gold" onClick={() => void lookup(input)}>Track</button>
                </div>

                {order === undefined && searched && <div className="mr-oc-loading">Looking up your order…</div>}

                {searched && order === null && (<div className="mr-shop-empty"><div className="mr-shop-empty-glyph">🔍</div><h3>No order found</h3><p>{error || "Please check the order number and try again."}</p><Link href="/account?tab=orders" className="mr-btn-outline">View my orders</Link></div>)}

                {order && (<div className="mr-track-result">
                    <div className="mr-track-head">
                      <div><span className="mr-track-label">Order</span><h3>{order.orderNumber}</h3><p>{order.createdAt ? `Placed on ${new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}` : ""}</p></div>
                      <div className="mr-track-eta"><span>Estimated Delivery</span><strong>{order.shipment?.estimatedDelivery ? new Date(order.shipment.estimatedDelivery).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "To be confirmed"}</strong></div>
                    </div>
                    <OrderTimeline status={order.status}/>
                    {order.shipment?.trackingNumber && (<div className="mr-checkout-info">
                        <span>🚚</span>
                        <span>
                          {order.shipment.carrier ? `${order.shipment.carrier} — ` : ""}Tracking #{order.shipment.trackingNumber}
                          {order.shipment.trackingUrl && <> · <a href={order.shipment.trackingUrl} target="_blank" rel="noreferrer">Track on carrier site</a></>}
                        </span>
                      </div>)}
                    <div className="mr-track-items">
                      {order.items.map((it) => (<div className="mr-track-item" key={it.id}>
                          <div className="mr-track-item-thumb"><SmartImage src={it.image} alt={it.name} ratio="1 / 1"/></div>
                          <div className="mr-track-item-info"><span style={{ fontSize: 14, color: "var(--mr-charcoal)" }}>{it.name}</span><small>Qty {it.quantity}</small></div>
                          <div className="mr-track-item-price">{formatINR(it.total)}</div>
                        </div>))}
                    </div>
                    <div className="mr-track-foot">
                      <div className="mr-track-addr"><span>Delivering to</span><p>{order.shippingAddress.name}, {order.shippingAddress.line1}, {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</p></div>
                      <div className="mr-track-total"><span>Order Total</span><strong>{formatINR(order.pricing.grandTotal)}</strong></div>
                    </div>
                  </div>)}

                {!searched && <div className="mr-track-hint"><p>Enter your order number above, or find it in <Link href="/account?tab=orders">My Orders</Link>.</p></div>}
              </>)}
          </div>
        </section>
      </main>
      <FooterSix />
    </Wrapper>);
};
export default TrackOrderMain;
