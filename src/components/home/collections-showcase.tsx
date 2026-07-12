import React from "react";
import Link from "next/link";
import { products } from "@/data/catalog";
import SectionHeader from "@/components/ui/section-header";

const COLLECTIONS = [
  { name: "Maharaja", tag: "Opulent teak, marble & hand-cut brass — our most regal line." },
  { name: "Vintage", tag: "Timeworn character and heritage silhouettes, reborn." },
  { name: "Contemporary Royale", tag: "Clean modern lines with an unmistakably royal soul." },
  { name: "Heritage", tag: "Craft traditions of India, preserved in every joint." },
];
const Arrow = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>;

export default function CollectionsShowcase() {
  return (
    <section className="mr-collections">
      <div className="container container-1400">
        <SectionHeader subtitle="Signature Lines" title="Explore Our Collections" />
        <div className="mr-collections-grid">
          {COLLECTIONS.map((c, i) => {
            const count = products.filter((p) => p.collection === c.name).length;
            return (
              <Link key={c.name} href={`/shop?collection=${encodeURIComponent(c.name)}`} className="mr-collection-card">
                <span className="mr-collection-num">0{i + 1}</span>
                <div className="mr-collection-body">
                  <span className="mr-collection-eyebrow">{count} Pieces</span>
                  <h3 className="mr-collection-name">{c.name}</h3>
                  <p className="mr-collection-tag">{c.tag}</p>
                  <span className="mr-collection-link">Explore <Arrow /></span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
