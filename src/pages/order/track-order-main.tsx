"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Wrapper from "@/layouts/wrapper";
import FooterSix from "@/layouts/footers/footer-six";
import HeaderSix from "@/layouts/headers/header-six";
import LuxBreadcrumb from "@/components/ui/lux-breadcrumb";
import SmartImage from "@/components/ui/smart-image";
import OrderTimeline from "@/components/order/order-timeline";
import { formatINR, getProductById } from "@/data/catalog";
import { getOrderByNumber, Order } from "@/lib/orders";

const TrackOrderMain = () => {
  const params = useSearchParams();
  const initial = params?.get("order") || "";
  const [input, setInput] = useState(initial);
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initial) { setOrder(getOrderByNumber(initial) ?? null); setSearched(true); } else setOrder(undefined);
  }, [initial]);

  const lookup = () => { setOrder(getOrderByNumber(input.trim()) ?? null); setSearched(true); };

  return (
    <Wrapper>
      <HeaderSix />
      <main>
        <LuxBreadcrumb subtitle="Order Tracking" title="Track Your Order" crumbs={[{ label: "Home", href: "/" }, { label: "Track Order" }]} />
        <section className="mr-track">
          <div className="container container-1300">
            <div className="mr-track-search">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") lookup(); }} placeholder="Enter your order number (e.g. MR26123456)" />
              <button className="mr-btn-gold" onClick={lookup}>Track</button>
            </div>

            {searched && order === null && (
              <div className="mr-shop-empty"><div className="mr-shop-empty-glyph">🔍</div><h3>No order found</h3><p>Please check the order number and try again.</p><Link href="/account?tab=orders" className="mr-btn-outline">View my orders</Link></div>
            )}

            {order && (
              <div className="mr-track-result">
                <div className="mr-track-head">
                  <div><span className="mr-track-label">Order</span><h3>{order.orderNumber}</h3><p>Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p></div>
                  <div className="mr-track-eta"><span>Estimated Delivery</span><strong>{order.estimatedDelivery}</strong></div>
                </div>
                <OrderTimeline order={order} />
                <div className="mr-track-items">
                  {order.items.map((it, i) => (
                    <div className="mr-track-item" key={i}>
                      <Link href={`/shop-details/${it.slug}`} className="mr-track-item-thumb"><SmartImage src={getProductById(it.productId)?.image} alt={it.name} ratio="1 / 1" /></Link>
                      <div className="mr-track-item-info"><Link href={`/shop-details/${it.slug}`}>{it.name}</Link><small>{it.color ? `${it.color} • ` : ""}Qty {it.qty}</small></div>
                      <div className="mr-track-item-price">{formatINR(it.price * it.qty)}</div>
                    </div>
                  ))}
                </div>
                <div className="mr-track-foot">
                  <div className="mr-track-addr"><span>Delivering to</span><p>{order.address.name}, {order.address.line1}, {order.address.city}, {order.address.state} — {order.address.pincode}</p></div>
                  <div className="mr-track-total"><span>Order Total</span><strong>{formatINR(order.total)}</strong></div>
                </div>
              </div>
            )}

            {!searched && <div className="mr-track-hint"><p>Enter your order number above, or find it in <Link href="/account?tab=orders">My Orders</Link>.</p></div>}
          </div>
        </section>
      </main>
      <FooterSix />
    </Wrapper>
  );
};

export default TrackOrderMain;
