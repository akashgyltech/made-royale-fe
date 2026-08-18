import Link from "next/link";
import SmartImage from "@/components/ui/smart-image";
import SectionHeader from "@/components/ui/section-header";
const Arrow = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>);
// ── Promotional banner slot ───────────────────────────────────────────────────
// Drop a wide image path here to replace the elegant placeholder, e.g.
// const BANNER_IMG = "/assets/img/inner-shop/category/category-banner.webp";
const BANNER_IMG = "";
export default function ShopCategory({ categories }) {
    return (<div className="mr-cats">
      <div className="container container-1400">
        <SectionHeader subtitle="Curated Categories" title="Explore Luxury Furniture by Category"/>

        {/* Promotional banner — update the image + copy anytime */}
        <div className="mr-cats-banner">
          <div className="mr-cats-banner-content">
            <span className="mr-cats-banner-eyebrow">Featured This Season</span>
            <h3 className="mr-cats-banner-title">The Maharaja Collection</h3>
            <p className="mr-cats-banner-text">Opulent teak, Makrana marble and hand-cut brass — our most regal line, crafted to become tomorrow&rsquo;s heirlooms.</p>
            <div className="mr-cats-banner-actions">
              <Link href="/collection/maharaja" className="mr-btn-gold">Shop the Collection <Arrow /></Link>
              <Link href="/contact" className="mr-btn-outline mr-cats-banner-ghost">Book a Consultation</Link>
            </div>
          </div>
          <div className="mr-cats-banner-media">
            <SmartImage src={BANNER_IMG} alt="The Maharaja Collection by Shizenta" glyph="👑" label="Shizenta" ratio="16 / 10" rounded={12}/>
          </div>
        </div>

        {categories.length > 0 ? (<div className="mr-cats-grid">
            {categories.map((item) => (<Link key={item.id} href={`/category/${item.slug}`} className="mr-cat-card">
                <div className="mr-cat-card-media">
                  <SmartImage src={item.image} alt={item.name} glyph={item.icon} label={item.tagline} ratio="1 / 1"/>
                  <div className="mr-cat-card-overlay">
                    <span className="mr-cat-card-shop">Explore
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </span>
                  </div>
                </div>
                <div className="mr-cat-card-title">{item.name}</div>
              </Link>))}
          </div>) : (<p className="mr-catproducts-empty">Categories are being curated — check back soon.</p>)}

        <div className="mr-cats-cta">
          <Link href="/shop" className="mr-btn-outline">View All Furniture
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <Link href="/track-order" className="mr-btn-text">Track your order →</Link>
        </div>
      </div>
    </div>);
}
