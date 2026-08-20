import React from 'react';
import Link from 'next/link';
import { formatINR } from '@/data/catalog';
import SmartImage from '@/components/ui/smart-image';
import ShopItem from '@/components/shop/shop-item';
import SectionHeader from '@/components/ui/section-header';
import CtaBand from '@/components/ui/cta-band';
import LuxHero from '@/components/ui/lux-hero';
const Arrow = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>);
export default function RoomLanding({ room, products, otherRooms }) {
    const featured = products.slice(0, 8);
    const catCount = new Set(products.map((p) => p.categorySlug)).size;
    const priceFrom = products.length ? Math.min(...products.map((p) => p.price)) : 0;
    const others = otherRooms || [];
    const introText = room.description || `Discover our ${room.name} collection — thoughtfully curated pieces for your home.`;
    const storyTitle = room.story?.title || room.name;
    const storyBody = room.story?.body || room.tagline || room.description || `Handpicked craftsmanship, curated for the ${room.name}.`;
    return (<>
      <LuxHero banner={room.banner || room.image} eyebrow="Shop by Room" title={room.name} intro={introText} crumbs={[{ label: 'Home', href: '/' }, { label: 'Shop by Room', href: '/shop' }, { label: room.name }]} stats={[
            { value: `${products.length}`, label: products.length === 1 ? 'Piece' : 'Pieces' },
            { value: `${catCount}`, label: catCount === 1 ? 'Category' : 'Categories' },
            { value: formatINR(priceFrom), label: 'Starting from' },
        ]} actions={[
            { label: 'Shop the Room', href: '#room-products' },
            { label: 'Book a Consultation', href: '/contact', variant: 'ghost' },
        ]}/>

      {/* ── Products for this room ── */}
      <section className="mr-catproducts" id="room-products">
        <div className="container container-1500">
          <SectionHeader subtitle="Handpicked for You" title={`Bestsellers for the ${room.name}`}/>
          {featured.length > 0 ? (<div className="mr-grid mr-grid-4">{featured.map((p) => <ShopItem key={p.id} product={p}/>)}</div>) : (<p className="mr-catproducts-empty">New pieces for this room are arriving soon — explore the full collection meanwhile.</p>)}
          <div className="text-center mt-45">
            <Link href="/shop" className="mr-btn-solid">View all furniture <Arrow /></Link>
          </div>
        </div>
      </section>

      {/* ── The story ── */}
      <section className="mr-catstory">
        <div className="container container-1400">
          <div className="mr-catstory-inner">
            <div className="mr-catstory-media">
              <SmartImage src={room.banner || room.image} alt={`${room.name} by Shizenta`} glyph={room.icon} label="Shizenta" ratio="4 / 3" rounded={12}/>
              <span className="mr-catstory-badge">Room by Shizenta</span>
            </div>
            <div className="mr-catstory-content">
              <span className="mr-catstory-eyebrow">The Shizenta Difference</span>
              <h2 className="mr-catstory-title">{storyTitle}</h2>
              <p className="mr-catstory-body">{storyBody}</p>
              <ul className="mr-catstory-list">
                <li><span>✦</span> A coordinated look, room by room</li>
                <li><span>✦</span> Hand-finished by generational artisans</li>
                <li><span>✦</span> Free design help to tie it all together</li>
              </ul>
              <Link href="/contact" className="mr-btn-gold">Plan your {room.name} <Arrow /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Explore other rooms ── */}
      <section className="mr-catother">
        <div className="container container-1400">
          <SectionHeader subtitle="Keep Exploring" title="Shop Other Rooms"/>
          <div className="mr-catother-grid">
            {others.map((r) => (<Link key={r.id} href={`/room/${r.slug}`} className="mr-cat-card">
                <div className="mr-cat-card-media">
                  <SmartImage src={r.image} alt={r.name} glyph={r.icon} label={r.tagline} ratio="1 / 1"/>
                  <div className="mr-cat-card-overlay"><span className="mr-cat-card-shop">Explore <Arrow /></span></div>
                </div>
                <div className="mr-cat-card-title">{r.name}</div>
              </Link>))}
          </div>
        </div>
      </section>

      <CtaBand eyebrow="Bespoke Interiors" title={`Furnishing your ${room.name.toLowerCase()}?`} text="Share your room dimensions and style, and our design consultants will curate a personalised, room-ready selection — free of charge." primaryLabel="Book a Free Consultation" primaryHref="/contact" secondaryLabel="Shop All Furniture" secondaryHref="/shop"/>
    </>);
}
