"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Modal from "react-bootstrap/Modal";
import { Minus, Plus, WishlistTwo } from "../svg";
import { Product, formatINR } from "@/data/catalog";
import { useCart } from "@/provider/CartProvider";
import { useWishlist } from "@/provider/WishlistProvider";
import SmartImage from "@/components/ui/smart-image";
import Stars from "@/components/ui/stars";

type IProps = { show: boolean; onClose: () => void; product: Product | null; };

export default function ProductModal({ show, onClose, product }: IProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { has, toggle } = useWishlist();
  const [active, setActive] = React.useState(0);
  const [color, setColor] = React.useState<string | undefined>(undefined);
  const [qty, setQty] = React.useState(1);

  React.useEffect(() => {
    if (product) { setActive(0); setColor(product.colors[0]?.name); setQty(1); }
  }, [product]);

  if (!product) return null;
  const gallery = product.gallery && product.gallery.length ? product.gallery : [product.image || ''];
  const wished = has(product.id);
  const discount = product.comparePrice > product.price ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;

  const buyNow = () => { addToCart(product.id, qty, color); onClose(); router.push("/checkout"); };

  return (
    <Modal show={show} onHide={onClose} centered className="tp-product-modal mr-qv">
      <button onClick={onClose} type="button" className="tp-product-modal-close-btn"><i className="fa-regular fa-xmark"></i></button>
      <Modal.Body>
        <div className="tp-product-modal-content d-lg-flex align-items-start">
          <div className="mr-qv-gallery d-sm-flex">
            <div className="mr-qv-thumbs">
              {gallery.map((g, i) => (
                <button key={i} className={`mr-qv-thumb ${active === i ? "active" : ""}`} type="button" onClick={() => setActive(i)} aria-label={`View ${i + 1}`}>
                  <SmartImage src={g} alt={`${product.name} ${i + 1}`} ratio="1 / 1" />
                </button>
              ))}
            </div>
            <div className="mr-qv-main">
              <SmartImage src={gallery[active]} alt={product.name} label={product.collection} glyph={product.categoryName} ratio="1 / 1" rounded={6} />
            </div>
          </div>

          <div className="tp-product-details-wrapper mr-qv-info">
            <div className="tp-product-details-category"><span>{product.categoryName}</span></div>
            <h3 className="tp-product-details-title">{product.name}</h3>
            <div className="d-flex align-items-center mb-10" style={{ gap: 12 }}>
              <Stars rating={product.rating} size={15} />
              <span className="mr-qv-reviews">({product.reviewCount} Reviews)</span>
            </div>
            <p className="mr-qv-desc">{product.shortDescription}</p>
            <div className="mr-qv-price mb-20">
              <span className="mr-qv-now">{formatINR(product.price)}</span>
              {discount > 0 && <span className="mr-qv-mrp">{formatINR(product.comparePrice)}</span>}
              {discount > 0 && <span className="mr-qv-off">{discount}% off</span>}
            </div>
            {product.colors.length > 0 && (
              <div className="mb-20">
                <h4 className="mr-qv-optlabel">Finish: <span>{color}</span></h4>
                <div className="mr-swatches">
                  {product.colors.map((c) => (
                    <button key={c.name} className={`mr-swatch ${color === c.name ? "is-active" : ""}`} style={{ background: c.hex }} onClick={() => setColor(c.name)} aria-label={c.name} title={c.name} />
                  ))}
                </div>
              </div>
            )}
            <div className="mr-qv-actions">
              <div className="mr-qty">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease"><Minus /></button>
                <input value={qty} readOnly />
                <button onClick={() => setQty((q) => q + 1)} aria-label="Increase"><Plus /></button>
              </div>
              <button className="mr-btn-solid mr-qv-cart" onClick={() => addToCart(product.id, qty, color)}>Add To Cart</button>
            </div>
            <button className="mr-btn-gold w-100 mb-15" onClick={buyNow}>Buy Now</button>
            <div className="mr-qv-links">
              <button type="button" onClick={() => toggle(product.id)}><WishlistTwo /> {wished ? "In Wishlist" : "Add to Wishlist"}</button>
              <Link href={`/shop-details/${product.slug}`} onClick={onClose}>View Full Details →</Link>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
