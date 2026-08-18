"use client";
import React from "react";
import Link from "next/link";
import { CartTwo, QuickViewEye, WishlistTwo } from "../svg";
import { formatINR } from "@/data/catalog";
import { useCart } from "@/provider/CartProvider";
import { useWishlist } from "@/provider/WishlistProvider";
import { useQuickView } from "@/provider/QuickViewProvider";
import SmartImage from "@/components/ui/smart-image";
import Stars from "@/components/ui/stars";
export default function ShopItem({ product }) {
    const { addToCart } = useCart();
    const { has, toggle } = useWishlist();
    const { open } = useQuickView();
    const wished = has(product.id);
    const discount = product.comparePrice > product.price ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;
    return (<div className="mr-card">
      <div className="mr-card-media">
        <Link href={`/shop-details/${product.slug}`} className="mr-card-media-link" aria-label={product.name}>
          <SmartImage src={product.image} alt={product.name} label={product.collection} glyph={product.categoryName} ratio="1 / 1"/>
        </Link>
        {product.badge && <span className="mr-card-badge">{product.badge}</span>}
        {discount > 0 && <span className="mr-card-off">{discount}% OFF</span>}
        <div className="mr-card-actions">
          <button type="button" className="mr-card-act" onClick={() => addToCart(product.id, 1, product.colors[0]?.name)} aria-label="Add to cart">
            <CartTwo /><span className="mr-card-tip">Add to Cart</span>
          </button>
          <button type="button" className="mr-card-act" onClick={() => open(product)} aria-label="Quick view">
            <QuickViewEye /><span className="mr-card-tip">Quick View</span>
          </button>
          <button type="button" className={`mr-card-act ${wished ? "is-active" : ""}`} onClick={() => toggle(product.id)} aria-label="Wishlist">
            <WishlistTwo /><span className="mr-card-tip">{wished ? "Saved" : "Wishlist"}</span>
          </button>
        </div>
      </div>
      <div className="mr-card-body">
        <span className="mr-card-cat">{product.categoryName}</span>
        <h4 className="mr-card-title"><Link href={`/shop-details/${product.slug}`}>{product.name}</Link></h4>
        <div className="mr-card-rating">
          <Stars rating={product.rating} size={13}/>
          <span>({product.reviewCount})</span>
        </div>
        <div className="mr-card-price">
          <span className="mr-card-now">{formatINR(product.price)}</span>
          {discount > 0 && <del>{formatINR(product.comparePrice)}</del>}
        </div>
        <Link href={`/shop-details/${product.slug}`} className="mr-card-shop">Shop Now</Link>
      </div>
    </div>);
}
