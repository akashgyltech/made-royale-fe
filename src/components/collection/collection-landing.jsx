import React from 'react';
import Link from 'next/link';
import { collections, formatINR } from '@/data/catalog';
import SmartImage from '@/components/ui/smart-image';
import ShopItem from '@/components/shop/shop-item';
import SectionHeader from '@/components/ui/section-header';
import CtaBand from '@/components/ui/cta-band';
import LuxHero from '@/components/ui/lux-hero';
const Arrow = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>);
export default function CollectionLanding({ collection, products }) {
    const featured = products.slice(0, 8);
    const catCount = new Set(products.map((p) => p.categorySlug)).size;
    const priceFrom = products.length ? Math.min(...products.map((p) => p.price)) : 0;
    const others = collections.filter((c) => c.slug !== collection.slug);
    const shopHref = `/shop?collection=${encodeURIComponent(collection.name)}`;
    return (<>
      <LuxHero banner={collection.banner || collection.image} eyebrow="Signature Collection" title={collection.name} intro={collection.intro} crumbs={[{ label: 'Home', href: '/' }, { label: 'Collections', href: '/#collections' }, { label: collection.name }]} stats={[
            { value: `${products.length}`, label: products.length === 1 ? 'Piece' : 'Pieces' },
            { value: `${catCount}`, label: catCount === 1 ? 'Category' : 'Categories' },
            { value: formatINR(priceFrom), label: 'Starting from' },
        ]} actions={[
            { label: 'Shop the Collection', href: shopHref },
            { label: 'Book a Consultation', href: '/contact', variant: 'ghost' },
        ]}/>

      {/* ── Products in this collection ── */}
      <section className="mr-catproducts">
        <div className="container container-1500">
          <SectionHeader subtitle="Handpicked for You" title={`The ${collection.name} Collection`}/>
          {featured.length > 0 ? (<div className="mr-grid mr-grid-4">{featured.map((p) => <ShopItem key={p.id} product={p}/>)}</div>) : (<p className="mr-catproducts-empty">New pieces in this collection are arriving soon — explore the full range meanwhile.</p>)}
          {products.length > featured.length && (<div className="text-center mt-45">
              <Link href={shopHref} className="mr-btn-solid">
                View all {products.length} {collection.name} pieces <Arrow />
              </Link>
            </div>)}
        </div>
      </section>

      {/* ── The story behind the collection ── */}
      <section className="mr-catstory">
        <div className="container container-1400">
          <div className="mr-catstory-inner">
            <div className="mr-catstory-media">
              <SmartImage src={collection.banner || collection.image} alt={`${collection.name} by Shizenta`} glyph={collection.icon} label="Shizenta" ratio="4 / 3" rounded={12}/>
              <span className="mr-catstory-badge">Signature Line</span>
            </div>
            <div className="mr-catstory-content">
              <span className="mr-catstory-eyebrow">The Shizenta Difference</span>
              <h2 className="mr-catstory-title">{collection.story.title}</h2>
              <p className="mr-catstory-body">{collection.story.body}</p>
              <ul className="mr-catstory-list">
                <li><span>✦</span> Solid, responsibly-sourced hardwoods</li>
                <li><span>✦</span> Hand-finished by generational artisans</li>
                <li><span>✦</span> Made-to-order, so no two are identical</li>
              </ul>
              <Link href={shopHref} className="mr-btn-gold">Explore {collection.name} <Arrow /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Explore other collections ── */}
      <section className="mr-catother">
        <div className="container container-1400">
          <SectionHeader subtitle="Keep Exploring" title="Discover Other Collections"/>
          <div className="mr-catother-grid">
            {others.map((c) => (<Link key={c.id} href={`/collection/${c.slug}`} className="mr-cat-card">
                <div className="mr-cat-card-media">
                  <SmartImage src={c.image} alt={c.name} glyph={c.icon} label={c.tagline} ratio="1 / 1"/>
                  <div className="mr-cat-card-overlay"><span className="mr-cat-card-shop">Explore <Arrow /></span></div>
                </div>
                <div className="mr-cat-card-title">{c.name}</div>
              </Link>))}
          </div>
        </div>
      </section>

      <CtaBand eyebrow="Bespoke Interiors" title={`Bring the ${collection.name} look home`} text="Share your room dimensions and style, and our design consultants will curate a personalised selection from this collection — free of charge." primaryLabel="Book a Free Consultation" primaryHref="/contact" secondaryLabel="Shop All Furniture" secondaryHref="/shop"/>
    </>);
}
