'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product, formatINR, getReviews, getRelated, getUpsell, emiPerMonth, careFor, boxContentsFor, bankOffers } from '@/data/catalog';
import { useCart } from '@/provider/CartProvider';
import { useWishlist } from '@/provider/WishlistProvider';
import { useToast } from '@/provider/ToastProvider';
import SmartImage from '@/components/ui/smart-image';
import Icon from '@/components/ui/icon';
import Stars from '@/components/ui/stars';
import ShopItem from '@/components/shop/shop-item';
import SectionHeader from '@/components/ui/section-header';

type Tab = 'description' | 'specs' | 'dimensions' | 'reviews';

export default function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { has, toggle } = useWishlist();
  const { toast } = useToast();

  const gallery = product.gallery && product.gallery.length ? product.gallery : [product.image || '', '', '', ''];
  const [active, setActive] = useState(0);
  const [color, setColor] = useState(product.colors[0]?.name);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>('description');

  const reviews = getReviews(product.id);
  const related = getRelated(product);
  const upsell = getUpsell(product);
  const wished = has(product.id);
  const discount = product.comparePrice > product.price ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;
  const savings = product.comparePrice - product.price;
  const emi = emiPerMonth(product.price);
  const care = careFor(product.material);
  const box = boxContentsFor(product.name);

  // Realistic rating distribution for the summary bars
  const n = product.reviewCount;
  const dist = [
    Math.round(n * 0.72), Math.round(n * 0.19), Math.round(n * 0.06), Math.round(n * 0.02), Math.max(0, n - Math.round(n * 0.72) - Math.round(n * 0.19) - Math.round(n * 0.06) - Math.round(n * 0.02)),
  ];

  const share = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      if (navigator.share) await navigator.share({ title: product.name, url });
      else { await navigator.clipboard.writeText(url); toast('Link copied to clipboard', 'info'); }
    } catch { /* cancelled */ }
  };
  const buyNow = () => { addToCart(product.id, qty, color); router.push('/checkout'); };

  return (
    <div className="mr-pdp">
      <div className="container container-1400">
        <div className="mr-pdp-trail">
          <Link href="/">Home</Link> <em>/</em> <Link href={`/shop?category=${product.categorySlug}`}>{product.categoryName}</Link> <em>/</em> <span>{product.name}</span>
        </div>

        <div className="mr-pdp-top">
          {/* Gallery */}
          <div className="mr-pdp-gallery">
            <div className="mr-pdp-gallery-main">
              <SmartImage src={gallery[active]} alt={product.name} label={product.collection} glyph={product.categoryName} ratio="1 / 1" rounded={8} />
              {product.badge && <span className="mr-pdp-badge">{product.badge}</span>}
              {discount > 0 && <span className="mr-pdp-galoff">{discount}% OFF</span>}
              <button className="mr-pdp-sharefloat" onClick={share} aria-label="Share">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" /></svg>
              </button>
            </div>
            <div className="mr-pdp-thumbs">
              {gallery.map((g, i) => (
                <button key={i} className={`mr-pdp-thumb ${i === active ? 'is-active' : ''}`} onClick={() => setActive(i)} aria-label={`View ${i + 1}`}>
                  <SmartImage src={g} alt={`${product.name} ${i + 1}`} ratio="1 / 1" />
                </button>
              ))}
            </div>
            <div className="mr-pdp-madein">
              <span><Icon name="gem" size={15} /> Handcrafted in India</span>
              <span><Icon name="wood" size={15} /> {product.material}</span>
              <span><Icon name="tag" size={15} /> SKU {product.sku}</span>
            </div>
          </div>

          {/* Summary */}
          <div className="mr-pdp-summary">
            <span className="mr-pdp-collection">{product.collection} Collection</span>
            <h1 className="mr-pdp-title">{product.name}</h1>
            <div className="mr-pdp-rating">
              <Stars rating={product.rating} size={16} /><span>{product.rating.toFixed(1)}</span><em>•</em>
              <button onClick={() => setTab('reviews')} className="mr-pdp-reviews-link">{product.reviewCount} reviews</button>
              <em>•</em><span className={product.stock <= 6 ? 'mr-pdp-lowstock' : 'mr-pdp-instock'}>{product.stock <= 6 ? `Only ${product.stock} left` : 'In stock'}</span>
            </div>

            <div className="mr-pdp-price">
              <span className="mr-pdp-now">{formatINR(product.price)}</span>
              {discount > 0 && <><span className="mr-pdp-mrp">{formatINR(product.comparePrice)}</span><span className="mr-pdp-off">{discount}% off</span></>}
            </div>
            <div className="mr-pdp-priceline2">
              {savings > 0 && <span className="mr-pdp-savings">You save {formatINR(savings)}</span>}
              <span className="mr-pdp-emi">or No-Cost EMI from <strong>{formatINR(emi)}/mo</strong></span>
            </div>
            <p className="mr-pdp-tax">Inclusive of all taxes · Free delivery & installation</p>

            {/* Offers */}
            <div className="mr-pdp-offers">
              <div className="mr-pdp-offers-head"><Icon name="tag" size={16} /> Offers &amp; Savings</div>
              <ul>{bankOffers.map((o, i) => <li key={i}><Icon name={o.icon} size={16} />{o.text}</li>)}</ul>
            </div>

            <p className="mr-pdp-short">{product.shortDescription}</p>

            <ul className="mr-pdp-highlights">
              {product.highlights.map((h) => <li key={h}><span className="mr-pdp-tick">✓</span>{h}</li>)}
            </ul>

            {product.colors.length > 0 && (
              <div className="mr-pdp-option">
                <span className="mr-pdp-option-label">Upholstery / Finish: <strong>{color}</strong></span>
                <div className="mr-swatches">
                  {product.colors.map((c) => (
                    <button key={c.name} className={`mr-swatch ${color === c.name ? 'is-active' : ''}`} style={{ background: c.hex }} onClick={() => setColor(c.name)} aria-label={c.name} title={c.name} />
                  ))}
                </div>
              </div>
            )}

            <div className="mr-pdp-actions">
              <div className="mr-qty">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">−</button>
                <input value={qty} readOnly aria-label="Quantity" />
                <button onClick={() => setQty((q) => q + 1)} aria-label="Increase">+</button>
              </div>
              <button className="mr-btn-solid mr-pdp-cart" onClick={() => addToCart(product.id, qty, color)}>Add to Cart</button>
              <button className={`mr-pdp-wishbtn ${wished ? 'is-active' : ''}`} onClick={() => toggle(product.id)} aria-label="Wishlist">
                <svg width="20" height="20" viewBox="0 0 24 24" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
              </button>
            </div>
            <button className="mr-btn-gold w-100 mr-pdp-buynow" onClick={buyNow}>Buy Now — Secure Checkout</button>

            <PincodeCheck toast={toast} />

            {/* Feature cards */}
            <div className="mr-pdp-features">
              <div className="mr-pdp-feature"><span className="mr-pdp-feature-ic"><Icon name="wood" size={20} /></span><div><strong>Material</strong><small>{product.material}</small></div></div>
              <div className="mr-pdp-feature"><span className="mr-pdp-feature-ic"><Icon name="shield" size={20} /></span><div><strong>Warranty</strong><small>{product.warranty}</small></div></div>
              <div className="mr-pdp-feature"><span className="mr-pdp-feature-ic"><Icon name="truck" size={20} /></span><div><strong>Delivery</strong><small>{product.assembly}</small></div></div>
              <div className="mr-pdp-feature"><span className="mr-pdp-feature-ic"><Icon name="returns" size={20} /></span><div><strong>Returns</strong><small>7-day easy returns</small></div></div>
            </div>

            <div className="mr-pdp-trust">
              <span><Icon name="lock" size={15} /> Secure Payments</span>
              <span><Icon name="verified" size={15} /> 100% Genuine</span>
              <span><Icon name="medal" size={15} /> Assured Quality</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mr-pdp-tabs">
          <div className="mr-pdp-tabnav">
            <button className={tab === 'description' ? 'is-active' : ''} onClick={() => setTab('description')}>Description</button>
            <button className={tab === 'specs' ? 'is-active' : ''} onClick={() => setTab('specs')}>Specifications</button>
            <button className={tab === 'dimensions' ? 'is-active' : ''} onClick={() => setTab('dimensions')}>Dimensions &amp; Care</button>
            <button className={tab === 'reviews' ? 'is-active' : ''} onClick={() => setTab('reviews')}>Reviews ({product.reviewCount})</button>
          </div>
          <div className="mr-pdp-tabbody">
            {tab === 'description' && (
              <div className="mr-pdp-desc">
                <p>{product.description}</p>
                <h4 className="mr-pdp-subhead">Why you’ll love it</h4>
                <ul>{product.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
                <div className="mr-pdp-craft">
                  <div className="mr-pdp-craft-icon"><Icon name="crown" size={26} /></div>
                  <div><strong>Handcrafted, made to order</strong><p>Each piece is built by master karigars using time-honoured techniques. Because it is made for you, subtle variations in grain and finish are the signature of genuine craftsmanship — never a flaw.</p></div>
                </div>
              </div>
            )}
            {tab === 'specs' && (
              <table className="mr-pdp-spectable"><tbody>
                {product.specs.map((s) => <tr key={s.label}><th>{s.label}</th><td>{s.value}</td></tr>)}
                <tr><th>Collection</th><td>{product.collection}</td></tr>
                <tr><th>Material</th><td>{product.material}</td></tr>
                <tr><th>Warranty</th><td>{product.warranty}</td></tr>
                <tr><th>Assembly</th><td>{product.assembly}</td></tr>
                <tr><th>SKU</th><td>{product.sku}</td></tr>
              </tbody></table>
            )}
            {tab === 'dimensions' && (
              <div className="mr-pdp-dims">
                <div className="mr-pdp-dims-col">
                  <h4 className="mr-pdp-subhead">Dimensions</h4>
                  <div className="mr-pdp-dimbox"><span><Icon name="ruler" size={22} /></span><div><strong>{product.dimensions}</strong><small>Please measure your space & doorways before ordering.</small></div></div>
                  <h4 className="mr-pdp-subhead">What’s in the Box</h4>
                  <ul className="mr-pdp-boxlist">{box.map((b, i) => <li key={i}>{b}</li>)}</ul>
                </div>
                <div className="mr-pdp-dims-col">
                  <h4 className="mr-pdp-subhead">Care & Maintenance</h4>
                  <ul className="mr-pdp-carelist">{care.map((c, i) => <li key={i}><span className="mr-pdp-tick">✓</span>{c}</li>)}</ul>
                </div>
              </div>
            )}
            {tab === 'reviews' && (
              <div className="mr-pdp-reviews">
                <div className="mr-pdp-review-top">
                  <div className="mr-pdp-review-score">
                    <strong>{product.rating.toFixed(1)}</strong>
                    <Stars rating={product.rating} size={18} />
                    <span>{product.reviewCount} verified reviews</span>
                  </div>
                  <div className="mr-pdp-review-bars">
                    {[5, 4, 3, 2, 1].map((star, i) => (
                      <div className="mr-pdp-review-bar" key={star}>
                        <span>{star}★</span>
                        <div className="mr-pdp-review-track"><span style={{ width: `${n ? (dist[i] / n) * 100 : 0}%` }} /></div>
                        <em>{dist[i]}</em>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mr-pdp-review-list">
                  {reviews.map((r) => (
                    <div key={r.id} className="mr-pdp-review">
                      <div className="mr-pdp-review-head">
                        <div className="mr-pdp-review-avatar">{r.author.charAt(0)}</div>
                        <div>
                          <div className="mr-pdp-review-author">{r.author}{r.verified && <span className="mr-pdp-review-verified">Verified Buyer</span>}</div>
                          <div className="mr-pdp-review-loc">{r.location} • {r.date}</div>
                        </div>
                        <div className="mr-pdp-review-stars"><Stars rating={r.rating} size={13} /></div>
                      </div>
                      <h5>{r.title}</h5><p>{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {upsell.length > 0 && (
          <div className="mr-pdp-related">
            <SectionHeader subtitle="Styled by our designers" title="Complete the Look" />
            <div className="mr-grid mr-grid-4">{upsell.map((p) => <ShopItem key={p.id} product={p} />)}</div>
          </div>
        )}
        {related.length > 0 && (
          <div className="mr-pdp-related">
            <SectionHeader subtitle="Curated for you" title="You May Also Love" />
            <div className="mr-grid mr-grid-4">{related.map((p) => <ShopItem key={p.id} product={p} />)}</div>
          </div>
        )}
      </div>

      {/* Sticky mobile buy bar */}
      <div className="mr-pdp-mobilebar">
        <div className="mr-pdp-mobilebar-price">
          <strong>{formatINR(product.price)}</strong>
          {discount > 0 && <span>{formatINR(product.comparePrice)}</span>}
        </div>
        <button className="mr-btn-solid" onClick={() => addToCart(product.id, qty, color)}>Add to Cart</button>
        <button className="mr-btn-gold" onClick={buyNow}>Buy Now</button>
      </div>
    </div>
  );
}

function PincodeCheck({ toast }: { toast: (m: string, v?: 'success' | 'info' | 'error') => void }) {
  const [pin, setPin] = useState('');
  const [result, setResult] = useState('');
  const check = () => {
    if (!/^\d{6}$/.test(pin)) { toast('Enter a valid 6-digit pincode', 'error'); return; }
    const days = 3 + (Number(pin) % 6);
    setResult(`Free white-glove delivery • Estimated in ${days}–${days + 3} days`);
  };
  return (
    <div className="mr-pdp-pincode">
      <label><Icon name="truck" size={16} /> Check delivery & installation</label>
      <div className="mr-pdp-pincode-row">
        <input value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Enter pincode" inputMode="numeric" />
        <button onClick={check}>Check</button>
      </div>
      {result && <p className="mr-pdp-pincode-result">{result}</p>}
    </div>
  );
}
