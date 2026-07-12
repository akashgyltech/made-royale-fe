import React from "react";
import Link from "next/link";
import { categories } from "@/data/catalog";
import SmartImage from "@/components/ui/smart-image";
import SectionHeader from "@/components/ui/section-header";

export default function ShopCategory() {
  return (
    <div className="mr-cats">
      <div className="container container-1400">
        <SectionHeader subtitle="Curated Categories" title="Explore Luxury Furniture by Category" />
        <div className="mr-cats-grid">
          {categories.map((item) => (
            <Link key={item.id} href={`/shop?category=${item.slug}`} className="mr-cat-card">
              <div className="mr-cat-card-media">
                <SmartImage src={item.image} alt={item.name} glyph={item.icon} label={item.tagline} ratio="1 / 1" />
                <div className="mr-cat-card-overlay">
                  <span className="mr-cat-card-shop">Shop Now
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </div>
              <div className="mr-cat-card-title">{item.name}</div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-30">
          <Link href="/shop" className="mr-btn-outline">View All Categories
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
