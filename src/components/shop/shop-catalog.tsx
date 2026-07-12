'use client';
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { categories, filterProducts, formatINR, getCategory, priceBounds, SortKey } from '@/data/catalog';
import ShopItem from '@/components/shop/shop-item';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'New Arrivals' },
];
const PRICE_STEPS = [
  { label: 'Under ₹50,000', min: 0, max: 50000 },
  { label: '₹50,000 – ₹1,00,000', min: 50000, max: 100000 },
  { label: '₹1,00,000 – ₹2,00,000', min: 100000, max: 200000 },
  { label: 'Above ₹2,00,000', min: 200000, max: 9999999 },
];
const COLLECTIONS = ['Maharaja', 'Vintage', 'Contemporary Royale', 'Heritage'];

export default function ShopCatalog() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const category = params?.get('category') || '';
  const sub = params?.get('sub') || '';
  const collection = params?.get('collection') || '';
  const sort = (params?.get('sort') as SortKey) || 'featured';
  const priceIdx = params?.get('price') ?? null;
  const search = params?.get('q') || '';
  const basePath = pathname ?? '/shop';

  const [showFilters, setShowFilters] = useState(false);
  const priceStep = priceIdx !== null ? PRICE_STEPS[Number(priceIdx)] : undefined;

  const list = useMemo(() => filterProducts({
    category: category || undefined, sub: sub || undefined, collection: collection || undefined,
    search: search || undefined, minPrice: priceStep?.min, maxPrice: priceStep?.max, sort,
  }), [category, sub, collection, search, priceStep, sort]);

  const activeCat = category ? getCategory(category) : undefined;

  function pushParams(next: Record<string, string | null>) {
    const sp = new URLSearchParams(params?.toString());
    Object.entries(next).forEach(([k, v]) => { if (v === null || v === '') sp.delete(k); else sp.set(k, v); });
    router.push(`${basePath}?${sp.toString()}`, { scroll: false });
  }
  const hasFilters = category || sub || collection || priceIdx !== null || search;

  return (
    <div className="mr-shop">
      <div className="container container-1500">
        <div className="mr-shop-toolbar">
          <div className="mr-shop-count"><strong>{list.length}</strong> {list.length === 1 ? 'piece' : 'pieces'}{activeCat && <> in <span>{activeCat.name}</span></>}</div>
          <div className="mr-shop-toolbar-right">
            <button className="mr-shop-filter-toggle" onClick={() => setShowFilters(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" /></svg>Filters
            </button>
            <div className="mr-shop-sort">
              <label>Sort</label>
              <select value={sort} onChange={(e) => pushParams({ sort: e.target.value })}>
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {activeCat && (
          <div className="mr-shop-subnav">
            <Link href={`/shop?category=${activeCat.slug}`} className={!sub ? 'is-active' : ''}>All {activeCat.name}</Link>
            {activeCat.subcategories.map((s) => (
              <Link key={s.id} href={`/shop?category=${activeCat.slug}&sub=${s.slug}`} className={sub === s.slug ? 'is-active' : ''}>{s.name}</Link>
            ))}
          </div>
        )}

        <div className="mr-shop-layout">
          <aside className={`mr-shop-sidebar ${showFilters ? 'is-open' : ''}`}>
            <div className="mr-shop-sidebar-head d-lg-none"><span>Filters</span><button onClick={() => setShowFilters(false)} aria-label="Close">✕</button></div>
            {hasFilters && <button className="mr-shop-clear" onClick={() => router.push(basePath, { scroll: false })}>Clear all filters</button>}

            <div className="mr-filter-block">
              <h5 className="mr-filter-title">Categories</h5>
              <ul className="mr-filter-list">
                <li><button className={!category ? 'is-active' : ''} onClick={() => pushParams({ category: null, sub: null })}>All Furniture</button></li>
                {categories.map((c) => (
                  <li key={c.id}>
                    <button className={category === c.slug ? 'is-active' : ''} onClick={() => pushParams({ category: c.slug, sub: null })}>{c.name}</button>
                    {category === c.slug && (
                      <ul className="mr-filter-sublist">
                        {c.subcategories.map((s) => (
                          <li key={s.id}><button className={sub === s.slug ? 'is-active' : ''} onClick={() => pushParams({ sub: sub === s.slug ? null : s.slug })}>{s.name}</button></li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mr-filter-block">
              <h5 className="mr-filter-title">Price</h5>
              <ul className="mr-filter-list">
                {PRICE_STEPS.map((p, i) => (
                  <li key={i}><button className={String(i) === priceIdx ? 'is-active' : ''} onClick={() => pushParams({ price: String(i) === priceIdx ? null : String(i) })}>{p.label}</button></li>
                ))}
              </ul>
            </div>

            <div className="mr-filter-block">
              <h5 className="mr-filter-title">Collection</h5>
              <div className="mr-filter-chips">
                {COLLECTIONS.map((c) => (
                  <button key={c} className={`mr-chip ${collection === c ? 'is-active' : ''}`} onClick={() => pushParams({ collection: collection === c ? null : c })}>{c}</button>
                ))}
              </div>
            </div>

            <div className="mr-filter-note"><span>Prices from</span><strong>{formatINR(priceBounds.min)}</strong></div>
          </aside>
          {showFilters && <div className="mr-shop-sidebar-backdrop d-lg-none" onClick={() => setShowFilters(false)} />}

          <div className="mr-shop-main">
            {list.length === 0 ? (
              <div className="mr-shop-empty">
                <div className="mr-shop-empty-glyph">❖</div>
                <h3>No pieces match your selection</h3>
                <p>Try adjusting your filters or explore the full collection.</p>
                <Link href="/shop" className="mr-btn-solid">View all furniture</Link>
              </div>
            ) : (
              <div className="mr-grid mr-grid-3">{list.map((p) => <ShopItem key={p.id} product={p} />)}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
