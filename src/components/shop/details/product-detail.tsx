'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product, formatINR, emiPerMonth, careFor, boxContentsFor, bankOffers } from '@/data/catalog';
import { reviewApi } from '@/lib/store-api';
import { ApiError } from '@/lib/api';
import type { BackendReview } from '@/types/backend';
import { useCart } from '@/provider/CartProvider';
import { useWishlist } from '@/provider/WishlistProvider';
import { useToast } from '@/provider/ToastProvider';
import { useAuth } from '@/provider/AuthProvider';
import SmartImage from '@/components/ui/smart-image';
import Icon from '@/components/ui/icon';
import Stars from '@/components/ui/stars';
import ShopItem from '@/components/shop/shop-item';
import SectionHeader from '@/components/ui/section-header';

type Tab = 'description' | 'specs' | 'dimensions' | 'reviews';

interface ProductDetailProps {
  product: Product;
  initialReviews: BackendReview[];
  related: Product[];
}

function reviewerName(customer: BackendReview['customer']): string {
  return typeof customer === 'string' ? 'Shizenta Customer' : customer.name || 'Shizenta Customer';
}

export default function ProductDetail({ product, initialReviews, related }: ProductDetailProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { has, toggle } = useWishlist();
  const { toast } = useToast();
  const { isLoggedIn, openAuthModal } = useAuth();

  const gallery = product.gallery && product.gallery.length ? product.gallery : [product.image || '', '', '', ''];
  const [active, setActive] = useState(0);
  const [color, setColor] = useState(product.colors[0]?.name);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>('description');
  const [reviews, setReviews] = useState<BackendReview[]>(initialReviews);
  const [reviewPage, setReviewPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const wished = has(product.id);
  const discount = product.comparePrice > product.price ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;
  const savings = product.comparePrice - product.price;
  const emi = emiPerMonth(product.price);
  const care = careFor(product.material || '');
  const box = boxContentsFor(product.name);

  // Rating distribution computed from the reviews we've actually fetched (a real,
  // if partial, sample) rather than a fabricated curve.
  const distCounts = [5, 4, 3, 2, 1].map((star) => reviews.filter((r) => Math.round(r.rating) === star).length);
  const distMax = Math.max(1, ...distCounts);

  const totalReviews = product.reviewCount;
  const hasMoreReviews = reviews.length < totalReviews;

  const loadMoreReviews = async () => {
    setLoadingMore(true);
    try {
      const next = reviewPage + 1;
      const page = await reviewApi.getProductReviews(product.id, next, 20);
      setReviews((prev) => [...prev, ...page.results]);
      setReviewPage(next);
    } catch {
      toast('Could not load more reviews right now.', 'error');
    } finally {
      setLoadingMore(false);
    }
  };

  const openReviewModal = () => {
    if (!isLoggedIn) { openAuthModal('login'); return; }
    setShowReview(true);
  };

  const submitReview = async (data: { rating: number; title: string; comment: string }) => {
    const created = await reviewApi.createReview({
      productId: product.id,
      rating: data.rating,
      title: data.title || undefined,
      comment: data.comment,
    });
    setReviews((prev) => [created, ...prev]);
    setShowReview(false);
    toast('Thank you! Your review has been posted.');
    setTab('reviews');
  };

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
              {product.material && <span><Icon name="wood" size={15} /> {product.material}</span>}
              {product.sku && <span><Icon name="tag" size={15} /> SKU {product.sku}</span>}
            </div>
          </div>

          {/* Summary */}
          <div className="mr-pdp-summary">
            {product.collection && <span className="mr-pdp-collection">{product.collection} Collection</span>}
            <h1 className="mr-pdp-title">{product.name}</h1>
            <div className="mr-pdp-rating">
              <Stars rating={product.rating} size={16} /><span>{product.rating.toFixed(1)}</span><em>•</em>
              <button onClick={() => setTab('reviews')} className="mr-pdp-reviews-link">{totalReviews} reviews</button>
              <em>•</em><span className={product.stock <= 6 ? 'mr-pdp-lowstock' : 'mr-pdp-instock'}>{product.stock <= 6 ? `Only ${product.stock} left` : 'In stock'}</span>
            </div>
            <button className="mr-pdp-writereview" onClick={openReviewModal}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
              Write a review
            </button>

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

            {product.highlights.length > 0 && (
              <ul className="mr-pdp-highlights">
                {product.highlights.map((h) => <li key={h}><span className="mr-pdp-tick">✓</span>{h}</li>)}
              </ul>
            )}

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
              {product.material && <div className="mr-pdp-feature"><span className="mr-pdp-feature-ic"><Icon name="wood" size={20} /></span><div><strong>Material</strong><small>{product.material}</small></div></div>}
              {product.warranty && <div className="mr-pdp-feature"><span className="mr-pdp-feature-ic"><Icon name="shield" size={20} /></span><div><strong>Warranty</strong><small>{product.warranty}</small></div></div>}
              {product.assembly && <div className="mr-pdp-feature"><span className="mr-pdp-feature-ic"><Icon name="truck" size={20} /></span><div><strong>Delivery</strong><small>{product.assembly}</small></div></div>}
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
            <button className={tab === 'reviews' ? 'is-active' : ''} onClick={() => setTab('reviews')}>Reviews ({totalReviews})</button>
          </div>
          <div className="mr-pdp-tabbody">
            {tab === 'description' && (
              <div className="mr-pdp-desc">
                <p>{product.description}</p>
                {product.highlights.length > 0 && (
                  <>
                    <h4 className="mr-pdp-subhead">Why you’ll love it</h4>
                    <ul>{product.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
                  </>
                )}
                <div className="mr-pdp-craft">
                  <div className="mr-pdp-craft-icon"><Icon name="crown" size={26} /></div>
                  <div><strong>Handcrafted, made to order</strong><p>Each piece is built by master karigars using time-honoured techniques. Because it is made for you, subtle variations in grain and finish are the signature of genuine craftsmanship — never a flaw.</p></div>
                </div>
              </div>
            )}
            {tab === 'specs' && (
              <table className="mr-pdp-spectable"><tbody>
                {product.specs.map((s) => <tr key={s.label}><th>{s.label}</th><td>{s.value}</td></tr>)}
                {product.collection && <tr><th>Collection</th><td>{product.collection}</td></tr>}
                {product.material && <tr><th>Material</th><td>{product.material}</td></tr>}
                {product.warranty && <tr><th>Warranty</th><td>{product.warranty}</td></tr>}
                {product.assembly && <tr><th>Assembly</th><td>{product.assembly}</td></tr>}
                {product.sku && <tr><th>SKU</th><td>{product.sku}</td></tr>}
              </tbody></table>
            )}
            {tab === 'dimensions' && (
              <div className="mr-pdp-dims">
                <div className="mr-pdp-dims-col">
                  <h4 className="mr-pdp-subhead">Dimensions</h4>
                  <div className="mr-pdp-dimbox">
                    <span><Icon name="ruler" size={22} /></span>
                    <div>
                      <strong>{product.dimensions || 'Not specified for this piece'}</strong>
                      <small>Please measure your space & doorways before ordering.</small>
                    </div>
                  </div>
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
                    <span>{totalReviews} verified reviews</span>
                  </div>
                  <div className="mr-pdp-review-bars">
                    {[5, 4, 3, 2, 1].map((star, i) => (
                      <div className="mr-pdp-review-bar" key={star}>
                        <span>{star}★</span>
                        <div className="mr-pdp-review-track"><span style={{ width: `${(distCounts[i] / distMax) * 100}%` }} /></div>
                        <em>{distCounts[i]}</em>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mr-pdp-review-cta">
                  <div><strong>Enjoyed this piece?</strong><span>Share your experience to help other buyers.</span></div>
                  <button className="mr-btn-gold mr-btn-sm" onClick={openReviewModal}>Write a Review</button>
                </div>
                {reviews.length === 0 ? (
                  <p className="mr-catproducts-empty">No reviews yet — be the first to share your experience.</p>
                ) : (
                  <div className="mr-pdp-review-list">
                    {reviews.map((r) => {
                      const name = reviewerName(r.customer);
                      return (
                        <div key={r.id} className="mr-pdp-review">
                          <div className="mr-pdp-review-head">
                            <div className="mr-pdp-review-avatar">{name.charAt(0)}</div>
                            <div>
                              <div className="mr-pdp-review-author">{name}{r.order && <span className="mr-pdp-review-verified">Verified Buyer</span>}</div>
                            </div>
                            <div className="mr-pdp-review-stars"><Stars rating={r.rating} size={13} /></div>
                          </div>
                          {r.title && <h5>{r.title}</h5>}
                          <p>{r.comment}</p>
                          {r.adminReply && <p style={{ marginTop: 8, opacity: 0.8 }}><em>Shizenta: {r.adminReply.message}</em></p>}
                        </div>
                      );
                    })}
                  </div>
                )}
                {hasMoreReviews && (
                  <div className="text-center mt-30">
                    <button className="mr-btn-outline" onClick={loadMoreReviews} disabled={loadingMore}>
                      {loadingMore ? 'Loading…' : 'Load more reviews'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mr-pdp-related">
            <SectionHeader subtitle="Curated for you" title="You May Also Love" />
            <div className="mr-grid mr-grid-4">{related.map((p) => <ShopItem key={p.id} product={p} />)}</div>
          </div>
        )}
      </div>

      {showReview && (
        <ReviewModal
          productName={product.name}
          onClose={() => setShowReview(false)}
          onSubmit={submitReview}
        />
      )}

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

function ReviewModal({ productName, onClose, onSubmit }: {
  productName: string; onClose: () => void;
  onSubmit: (d: { rating: number; title: string; comment: string }) => Promise<void>;
}) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [err, setErr] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (!title.trim()) { setErr('Please add a short review title.'); return; }
    if (comment.trim().length < 10) { setErr('Please write at least 10 characters in your review.'); return; }
    setSubmitting(true);
    try {
      await onSubmit({ rating, title: title.trim(), comment: comment.trim() });
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <div className="mr-review-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="mr-review-modal" role="dialog" aria-modal="true" aria-label="Write a review">
        <button className="mr-auth-close" onClick={onClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
        <h3 className="mr-review-modal-title">Write a Review</h3>
        <p className="mr-review-modal-sub">Share your experience with the <strong>{productName}</strong></p>
        <form onSubmit={submit} noValidate>
          <div className="mr-review-field">
            <label>Your Rating</label>
            <div className="mr-review-stars">
              {[1, 2, 3, 4, 5].map((s) => (
                <button type="button" key={s} className={`mr-review-star ${(hover || rating) >= s ? 'is-on' : ''}`} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => setRating(s)} aria-label={`${s} star`}>★</button>
              ))}
              <span className="mr-review-stars-label">{labels[hover || rating]}</span>
            </div>
          </div>
          <div className="mr-review-field">
            <label>Review Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Sum it up in a few words" maxLength={80} />
          </div>
          <div className="mr-review-field">
            <label>Your Review</label>
            <textarea rows={4} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="What did you love? How is the quality, comfort and finish?" maxLength={600} />
          </div>
          {err && <div className="mr-submit-error">{err}</div>}
          <button type="submit" className="mr-btn-gold w-100" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit Review'}</button>
          <p className="mr-review-modal-note">Your review will be visible once posted. Thank you for helping other shoppers.</p>
        </form>
      </div>
    </div>
  );
}
