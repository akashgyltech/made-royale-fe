"use client";
import Link from "next/link";
import React from "react";
import { useCart } from "@/provider/CartProvider";
import { formatINR } from "@/data/catalog";
import SmartImage from "@/components/ui/smart-image";

// Reads open state from the CartProvider so "add to cart" opens it automatically.
type IProps = { openCartMini?: boolean; setOpenCartMini?: React.Dispatch<React.SetStateAction<boolean>> };

export default function CartOffcanvas(_props: IProps) {
  const { resolved, subtotal, count, isDrawerOpen, closeDrawer, updateQty, removeLine } = useCart();
  const FREE = 50000;
  const progress = Math.min(100, Math.round((subtotal / FREE) * 100));

  return (
    <>
      <div className={`mr-drawer ${isDrawerOpen ? "is-open" : ""}`} role="dialog" aria-label="Shopping cart">
        <div className="mr-drawer-head">
          <h4>Shopping Cart {count > 0 && <span>({count})</span>}</h4>
          <button className="mr-drawer-close" onClick={closeDrawer} aria-label="Close">✕</button>
        </div>

        {count > 0 && (
          <div className="mr-drawer-ship">
            <p>{subtotal >= FREE ? "🎉 You’ve unlocked complimentary white-glove delivery" : `Add ${formatINR(FREE - subtotal)} more for free delivery`}</p>
            <div className="mr-drawer-progress"><span style={{ width: `${progress}%` }} /></div>
          </div>
        )}

        <div className="mr-drawer-body">
          {count === 0 ? (
            <div className="mr-drawer-empty">
              <div className="mr-shop-empty-glyph">🛍️</div>
              <p>Your cart is waiting to be adorned.</p>
              <Link href="/shop" className="mr-btn-solid" onClick={closeDrawer}>Explore Collection</Link>
            </div>
          ) : (
            resolved.map((line) => (
              <div className="mr-drawer-item" key={line.key}>
                <Link href={`/shop-details/${line.product.slug}`} className="mr-drawer-item-thumb" onClick={closeDrawer}>
                  <SmartImage src={line.product.image} alt={line.product.name} ratio="1 / 1" />
                </Link>
                <div className="mr-drawer-item-info">
                  <Link href={`/shop-details/${line.product.slug}`} onClick={closeDrawer} className="mr-drawer-item-name">{line.product.name}</Link>
                  {line.color && <span className="mr-drawer-item-color">{line.color}</span>}
                  <div className="mr-drawer-item-bottom">
                    <div className="mr-qty mr-qty-xs">
                      <button onClick={() => updateQty(line.key, line.qty - 1)} aria-label="Decrease">−</button>
                      <input value={line.qty} readOnly />
                      <button onClick={() => updateQty(line.key, line.qty + 1)} aria-label="Increase">+</button>
                    </div>
                    <span className="mr-drawer-item-price">{formatINR(line.lineTotal)}</span>
                  </div>
                </div>
                <button className="mr-drawer-item-remove" onClick={() => removeLine(line.key)} aria-label="Remove">✕</button>
              </div>
            ))
          )}
        </div>

        {count > 0 && (
          <div className="mr-drawer-foot">
            <div className="mr-drawer-subtotal"><span>Subtotal</span><strong>{formatINR(subtotal)}</strong></div>
            <div className="mr-drawer-actions">
              <Link href="/cart" className="mr-btn-outline" onClick={closeDrawer}>View Cart</Link>
              <Link href="/checkout" className="mr-btn-gold" onClick={closeDrawer}>Checkout</Link>
            </div>
          </div>
        )}
      </div>
      <div className={`mr-drawer-backdrop ${isDrawerOpen ? "is-open" : ""}`} onClick={closeDrawer} />
    </>
  );
}
