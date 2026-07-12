"use client";
import React, { useState } from "react";
import Link from "next/link";
import Wrapper from "@/layouts/wrapper";
import FooterSix from "@/layouts/footers/footer-six";
import HeaderSix from "@/layouts/headers/header-six";
import LuxBreadcrumb from "@/components/ui/lux-breadcrumb";
import SmartImage from "@/components/ui/smart-image";
import { formatINR, validateCoupon } from "@/data/catalog";
import { useCart } from "@/provider/CartProvider";

const CartMain = () => {
  const { resolved, subtotal, savings, updateQty, removeLine, count } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponMsg, setCouponMsg] = useState("");

  function applyCoupon() {
    const res = validateCoupon(couponInput, subtotal);
    setCouponMsg(res.message);
    if (res.valid && res.coupon) { setCoupon({ code: res.coupon.code, discount: res.discount }); try { localStorage.setItem("mr_coupon", res.coupon.code); } catch {} }
    else { setCoupon(null); try { localStorage.removeItem("mr_coupon"); } catch {} }
  }

  const discount = coupon?.discount ?? 0;
  const total = Math.max(0, subtotal - discount);

  return (
    <Wrapper>
      <HeaderSix />
      <main>
        <LuxBreadcrumb subtitle="Your Selection" title="Shopping Cart" crumbs={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
        <section className="mr-cart">
          <div className="container container-1300">
            {count === 0 ? (
              <div className="mr-shop-empty">
                <div className="mr-shop-empty-glyph">🛍️</div>
                <h3>Your cart is empty</h3>
                <p>Discover pieces worthy of your home.</p>
                <Link href="/shop" className="mr-btn-solid">Explore the Collection</Link>
              </div>
            ) : (
              <div className="mr-cart-layout">
                <div className="mr-cart-items">
                  {resolved.map((line) => (
                    <div className="mr-cart-item" key={line.key}>
                      <Link href={`/shop-details/${line.product.slug}`} className="mr-cart-item-thumb"><SmartImage src={line.product.image} alt={line.product.name} ratio="1 / 1" /></Link>
                      <div className="mr-cart-item-info">
                        <span className="mr-cart-item-cat">{line.product.categoryName}</span>
                        <h4><Link href={`/shop-details/${line.product.slug}`}>{line.product.name}</Link></h4>
                        {line.color && <span className="mr-cart-item-color">Finish: {line.color}</span>}
                        <span className="mr-cart-item-sku">SKU: {line.product.sku}</span>
                        <button className="mr-cart-item-remove" onClick={() => removeLine(line.key)}>Remove</button>
                      </div>
                      <div className="mr-cart-item-qty">
                        <div className="mr-qty mr-qty-sm">
                          <button onClick={() => updateQty(line.key, line.qty - 1)} aria-label="Decrease">−</button>
                          <input value={line.qty} readOnly />
                          <button onClick={() => updateQty(line.key, line.qty + 1)} aria-label="Increase">+</button>
                        </div>
                      </div>
                      <div className="mr-cart-item-price">
                        <span className="mr-cart-item-now">{formatINR(line.lineTotal)}</span>
                        {line.product.comparePrice > line.product.price && <span className="mr-cart-item-mrp">{formatINR(line.product.comparePrice * line.qty)}</span>}
                      </div>
                    </div>
                  ))}
                  <div className="mr-cart-continue"><Link href="/shop">← Continue Shopping</Link></div>
                </div>

                <aside className="mr-cart-summary">
                  <h3 className="mr-cart-summary-title">Order Summary</h3>
                  <div className="mr-cart-coupon">
                    <input value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="Coupon code (try ROYALE10)" />
                    <button onClick={applyCoupon}>Apply</button>
                  </div>
                  {couponMsg && <p className={`mr-cart-coupon-msg ${coupon ? "ok" : "err"}`}>{couponMsg}</p>}
                  <div className="mr-cart-summary-rows">
                    <div className="mr-cart-summary-row"><span>Subtotal ({count} {count === 1 ? "item" : "items"})</span><span>{formatINR(subtotal)}</span></div>
                    {savings > 0 && <div className="mr-cart-summary-row mr-save"><span>Instant savings</span><span>− {formatINR(savings)}</span></div>}
                    {discount > 0 && <div className="mr-cart-summary-row mr-save"><span>Coupon ({coupon?.code})</span><span>− {formatINR(discount)}</span></div>}
                    <div className="mr-cart-summary-row"><span>Delivery & Installation</span><span className="mr-free">Free</span></div>
                  </div>
                  <div className="mr-cart-summary-total"><span>Total</span><span>{formatINR(total)}</span></div>
                  <p className="mr-cart-summary-tax">Inclusive of all taxes</p>
                  <Link href="/checkout" className="mr-btn-gold mr-cart-checkout-btn">Proceed to Checkout</Link>
                  <div className="mr-cart-trust"><span>🔒 Secure checkout</span><span>🛡️ Assured warranty</span><span>🚚 White-glove delivery</span></div>
                </aside>
              </div>
            )}
          </div>
        </section>
      </main>
      <FooterSix />
    </Wrapper>
  );
};

export default CartMain;
