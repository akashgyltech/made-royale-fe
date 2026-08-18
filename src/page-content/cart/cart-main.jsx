"use client";
import React from "react";
import Link from "next/link";
import Wrapper from "@/layouts/wrapper";
import FooterSix from "@/layouts/footers/footer-six";
import HeaderSix from "@/layouts/headers/header-six";
import LuxBreadcrumb from "@/components/ui/lux-breadcrumb";
import SmartImage from "@/components/ui/smart-image";
import { formatINR } from "@/data/catalog";
import { useCart } from "@/provider/CartProvider";
const CartMain = () => {
    const { lines, resolved, subtotal, savings, updateQty, removeLine, count, isLoading } = useCart();
    // Lines whose product fetch resolved to null (deleted/inactive product) are silently
    // excluded from `resolved` (and therefore from the priced total) but still linger in
    // `lines` — surface that instead of letting the total quietly diverge from the cart.
    const staleLines = lines.filter((l) => !resolved.some((r) => r.productId === l.productId && r.color === l.color));
    return (<Wrapper>
      <HeaderSix />
      <main>
        <LuxBreadcrumb subtitle="Your Selection" title="Shopping Cart" crumbs={[{ label: "Home", href: "/" }, { label: "Cart" }]}/>
        <section className="mr-cart">
          <div className="container container-1300">
            {count === 0 ? (<div className="mr-shop-empty">
                <div className="mr-shop-empty-glyph">🛍️</div>
                <h3>Your cart is empty</h3>
                <p>Discover pieces worthy of your home.</p>
                <Link href="/shop" className="mr-btn-solid">Explore the Collection</Link>
              </div>) : resolved.length === 0 && isLoading ? (<div className="mr-oc-loading">Loading your cart…</div>) : (<div className="mr-cart-layout">
                <div className="mr-cart-items">
                  {staleLines.length > 0 && (<div className="mr-checkout-info">
                      <span>⚠️</span>
                      {staleLines.length === 1 ? "1 item" : `${staleLines.length} items`} in your cart {staleLines.length === 1 ? "is" : "are"} no longer available and {staleLines.length === 1 ? "has" : "have"} been left out of your total.
                      {" "}
                      {staleLines.map((l) => (<button key={`${l.productId}|${l.color ?? ""}`} className="mr-cart-item-remove" style={{ marginLeft: 8 }} onClick={() => removeLine(`${l.productId}|${l.color ?? ""}`)}>Remove</button>))}
                    </div>)}
                  {resolved.map((line) => (<div className="mr-cart-item" key={line.key}>
                      <Link href={`/shop-details/${line.product.slug}`} className="mr-cart-item-thumb"><SmartImage src={line.product.image} alt={line.product.name} ratio="1 / 1"/></Link>
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
                          <input value={line.qty} readOnly/>
                          <button onClick={() => updateQty(line.key, line.qty + 1)} aria-label="Increase">+</button>
                        </div>
                      </div>
                      <div className="mr-cart-item-price">
                        <span className="mr-cart-item-now">{formatINR(line.lineTotal)}</span>
                        {line.product.comparePrice > line.product.price && <span className="mr-cart-item-mrp">{formatINR(line.product.comparePrice * line.qty)}</span>}
                      </div>
                    </div>))}
                  <div className="mr-cart-continue"><Link href="/shop">← Continue Shopping</Link></div>
                </div>

                <aside className="mr-cart-summary">
                  <h3 className="mr-cart-summary-title">Order Summary</h3>
                  <div className="mr-cart-summary-rows">
                    <div className="mr-cart-summary-row"><span>Subtotal ({count} {count === 1 ? "item" : "items"})</span><span>{formatINR(subtotal)}</span></div>
                    {savings > 0 && <div className="mr-cart-summary-row mr-save"><span>Instant savings</span><span>− {formatINR(savings)}</span></div>}
                  </div>
                  <div className="mr-cart-summary-total"><span>Estimated Total</span><span>{formatINR(subtotal)}</span></div>
                  <p className="mr-cart-summary-tax">Coupons, shipping & GST are calculated at checkout</p>
                  <Link href="/checkout" className="mr-btn-gold mr-cart-checkout-btn">Proceed to Checkout</Link>
                  <div className="mr-cart-trust"><span>🔒 Secure checkout</span><span>🛡️ Assured warranty</span><span>🚚 White-glove delivery</span></div>
                </aside>
              </div>)}
          </div>
        </section>
      </main>
      <FooterSix />
    </Wrapper>);
};
export default CartMain;
