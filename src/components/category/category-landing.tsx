'use client';
import React from 'react';
import Link from 'next/link';
import { categories, filterProducts, formatINR, getCategory, priceBounds } from '@/data/catalog';
import SmartImage from '@/components/ui/smart-image';
import ShopItem from '@/components/shop/shop-item';
import SectionHeader from '@/components/ui/section-header';
import CtaBand from '@/components/ui/cta-band';

const Arrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
);

// ── Editorial copy per category ───────────────────────────────────────────────
// Freely edit the copy below, or drop a real image path into each category's
// `image` / `banner` slot in src/data/catalog.ts to replace the placeholders.
type Copy = { intro: string; story: { title: string; body: string }; features: { icon: string; title: string; text: string }[] };
const DEFAULT_FEATURES = [
  { icon: '🛠️', title: 'Handcrafted to order', text: 'Built by master karigars, never mass-produced.' },
  { icon: '🛡️', title: 'Up to 5-year warranty', text: 'Every joint and finish is guaranteed for years.' },
  { icon: '🚚', title: 'Free delivery & install', text: 'White-glove delivery and expert assembly at home.' },
  { icon: '↩️', title: '7-day easy returns', text: 'Changed your mind? Return within 7 days, hassle-free.' },
];
const COPY: Record<string, Copy> = {
  sofas: {
    intro: 'From deep-buttoned chesterfields to modular corner suites, our seating is engineered for a lifetime of comfort and built to anchor the room.',
    story: { title: 'The heart of every living room', body: 'A sofa is where evenings unwind and guests are welcomed. Ours pair solid hardwood frames with feather-blend cushioning and hand-finished upholstery, so they hold their shape — and their beauty — for decades.' },
    features: DEFAULT_FEATURES,
  },
  beds: {
    intro: 'Rest like royalty on solid-wood beds — from grand poster frames to space-smart storage designs finished to last generations.',
    story: { title: 'Where your day begins and ends', body: 'A bed should feel as considered as it is comfortable. Each frame is joined in solid Sheesham or teak, with optional hydraulic storage to keep your bedroom serene and clutter-free.' },
    features: DEFAULT_FEATURES,
  },
  dining: {
    intro: 'Feasts fit for a durbar. Marble-topped and solid-wood dining sets designed to gather family around, night after night.',
    story: { title: 'Made for gathering', body: 'The best conversations happen over a shared table. Our dining sets balance drama and durability — genuine Makrana marble, hand-cut joinery and seating built for long, lingering meals.' },
    features: DEFAULT_FEATURES,
  },
  wardrobes: {
    intro: 'Keep your regalia in order with wardrobes that marry generous storage with quiet, architectural elegance.',
    story: { title: 'Considered storage, beautifully made', body: 'Soft-close doors, thoughtful internal layouts and hand-finished exteriors — our wardrobes are as satisfying to open as they are to look at.' },
    features: DEFAULT_FEATURES,
  },
  chairs: {
    intro: 'A seat for every occasion — sculptural accent chairs, enveloping armchairs and versatile benches to complete a room.',
    story: { title: 'The finishing character piece', body: 'The right chair adds personality to a corner. Ours are upholstered in premium velvet and linen over solid frames, so comfort never comes at the cost of craftsmanship.' },
    features: DEFAULT_FEATURES,
  },
  tables: {
    intro: 'Centrepieces with character — coffee, console, side and study tables that hold a room together.',
    story: { title: 'Surfaces worth gathering around', body: 'From marble-and-brass coffee tables to warm solid-wood consoles, each table is finished by hand and built to take everyday life in its stride.' },
    features: DEFAULT_FEATURES,
  },
  storage: {
    intro: 'Considered, concealed, curated. TV units, sideboards and bookshelves that bring order with understated luxury.',
    story: { title: 'Storage, elevated', body: 'Cable-managed media units, display-worthy sideboards and sturdy bookshelves — storage that looks every bit as good as the pieces it holds.' },
    features: DEFAULT_FEATURES,
  },
  decor: {
    intro: 'The finishing flourish — mirrors, lighting and rugs that turn a beautifully furnished house into a home.',
    story: { title: 'The details that complete a room', body: 'Hand-framed mirrors, warm statement lighting and hand-knotted rugs — the accents that tie your palette together and add a final layer of warmth.' },
    features: DEFAULT_FEATURES,
  },
};

export default function CategoryLanding({ slug }: { slug: string }) {
  const category = getCategory(slug);
  if (!category) return null;

  const items = filterProducts({ category: slug, sort: 'featured' });
  const featured = items.slice(0, 8);
  const priceFrom = items.length ? Math.min(...items.map((p) => p.price)) : priceBounds.min;
  const copy = COPY[slug] ?? {
    intro: category.tagline,
    story: { title: category.name, body: category.tagline },
    features: DEFAULT_FEATURES,
  };
  const others = categories.filter((c) => c.slug !== slug).slice(0, 6);

  return (
    <>
      {/* ── Hero banner (drop a wide image into `banner` in catalog.ts) ── */}
      <section className="mr-cathero">
        <div className="mr-cathero-media" aria-hidden="true">
          {category.banner ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={category.banner} alt="" loading="eager" />
          ) : category.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={category.image} alt="" loading="eager" />
          ) : (
            <span className="mr-cathero-fallback" />
          )}
          <span className="mr-cathero-scrim" />
        </div>
        <div className="container container-1400">
          <div className="mr-cathero-inner">
            <nav className="mr-cathero-trail" aria-label="Breadcrumb">
              <Link href="/">Home</Link><em>/</em><Link href="/shop">Shop</Link><em>/</em><span>{category.name}</span>
            </nav>
            <h1 className="mr-cathero-title">{category.name}</h1>
            <p className="mr-cathero-intro">{copy.intro}</p>
            <div className="mr-cathero-meta">
              <div><strong>{items.length}</strong><span>{items.length === 1 ? 'Piece' : 'Pieces'}</span></div>
              <div><strong>{category.subcategories.length}</strong><span>Styles</span></div>
              <div><strong>{formatINR(priceFrom)}</strong><span>Starting from</span></div>
            </div>
            <div className="mr-cathero-actions">
              <Link href={`/shop?category=${category.slug}`} className="mr-btn-gold">Shop the Collection <Arrow /></Link>
              <Link href="/contact" className="mr-btn-outline mr-cathero-ghost">Book a Consultation</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Browse by type (subcategories) ── */}
      {category.subcategories.length > 0 && (
        <section className="mr-subcat">
          <div className="container container-1400">
            <SectionHeader subtitle="Refine Your Search" title={`Browse ${category.name} by Type`} />
            <div className="mr-subcat-grid">
              {category.subcategories.map((s) => {
                const count = filterProducts({ category: slug, sub: s.slug }).length;
                return (
                  <Link key={s.id} href={`/shop?category=${slug}&sub=${s.slug}`} className="mr-subcat-card">
                    <div className="mr-subcat-card-media">
                      <SmartImage src={s.image} alt={s.name} glyph={category.icon} label={category.name} ratio="4 / 3" />
                    </div>
                    <div className="mr-subcat-card-body">
                      <strong>{s.name}</strong>
                      <span>{count > 0 ? `${count} ${count === 1 ? 'piece' : 'pieces'}` : 'Explore'} <Arrow /></span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured products ── */}
      <section className="mr-catproducts">
        <div className="container container-1500">
          <SectionHeader subtitle="Handpicked for You" title={`Bestselling ${category.name}`} />
          {featured.length > 0 ? (
            <div className="mr-grid mr-grid-4">{featured.map((p) => <ShopItem key={p.id} product={p} />)}</div>
          ) : (
            <p className="mr-catproducts-empty">New pieces in this category are arriving soon — explore the full collection meanwhile.</p>
          )}
          <div className="text-center mt-45">
            <Link href={`/shop?category=${category.slug}`} className="mr-btn-solid">
              View all {items.length} {category.name} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Editorial / promo banner (2nd banner slot) ── */}
      <section className="mr-catstory">
        <div className="container container-1400">
          <div className="mr-catstory-inner">
            <div className="mr-catstory-media">
              <SmartImage src={category.banner} alt={`${category.name} by Shizenta`} glyph={category.icon} label="Shizenta" ratio="4 / 3" rounded={12} />
              <span className="mr-catstory-badge">Est. Craftsmanship</span>
            </div>
            <div className="mr-catstory-content">
              <span className="mr-catstory-eyebrow">The Shizenta Difference</span>
              <h2 className="mr-catstory-title">{copy.story.title}</h2>
              <p className="mr-catstory-body">{copy.story.body}</p>
              <ul className="mr-catstory-list">
                <li><span>✦</span> Solid, responsibly-sourced hardwoods</li>
                <li><span>✦</span> Hand-finished by generational artisans</li>
                <li><span>✦</span> Made-to-order, so no two are identical</li>
              </ul>
              <Link href={`/shop?category=${category.slug}`} className="mr-btn-gold">Explore {category.name} <Arrow /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Shizenta (features) ── */}
      <section className="mr-catfeatures">
        <div className="container container-1400">
          <SectionHeader subtitle="Why Shizenta" title={`A Better Way to Buy ${category.name}`} />
          <div className="mr-catfeatures-grid">
            {copy.features.map((f) => (
              <div key={f.title} className="mr-catfeature">
                <span className="mr-catfeature-icon">{f.icon}</span>
                <strong>{f.title}</strong>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Explore other categories ── */}
      <section className="mr-catother">
        <div className="container container-1400">
          <SectionHeader subtitle="Keep Exploring" title="Discover Other Categories" />
          <div className="mr-catother-grid">
            {others.map((c) => (
              <Link key={c.id} href={`/category/${c.slug}`} className="mr-cat-card">
                <div className="mr-cat-card-media">
                  <SmartImage src={c.image} alt={c.name} glyph={c.icon} label={c.tagline} ratio="1 / 1" />
                  <div className="mr-cat-card-overlay"><span className="mr-cat-card-shop">Explore <Arrow /></span></div>
                </div>
                <div className="mr-cat-card-title">{c.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Bespoke Interiors"
        title="Not sure what fits your space?"
        text="Share your room dimensions and style, and our design consultants will curate a personalised selection — free of charge."
        primaryLabel="Book a Free Consultation"
        primaryHref="/contact"
        secondaryLabel="Shop All Furniture"
        secondaryHref="/shop"
      />
    </>
  );
}
