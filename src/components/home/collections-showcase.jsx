import Link from "next/link";
import SectionHeader from "@/components/ui/section-header";
const Arrow = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
export default function CollectionsShowcase({ collections, counts = {} }) {
    if (!collections || collections.length === 0)
        return null;
    return (<section className="mr-collections" id="collections">
      <div className="container container-1400">
        <SectionHeader subtitle="Signature Lines" title="Explore Our Collections"/>
        <div className="mr-collections-grid">
          {collections.map((c) => {
            const count = counts[c.slug] ?? 0;
            return (<Link key={c.slug} href={`/collection/${c.slug}`} className={`mr-collection-card${c.image ? " has-image" : ""}`}>
                {c.image && (<span className="mr-collection-media" aria-hidden="true">
                    <img src={c.image} alt="" loading="lazy"/>
                  </span>)}
                <div className="mr-collection-body">
                  <h3 className="mr-collection-name">{c.name}</h3>
                  <p className="mr-collection-tag">{c.tagline}</p>
                  <span className="mr-collection-link">Explore{count > 0 ? ` ${count} pieces` : ""} <Arrow /></span>
                </div>
              </Link>);
        })}
        </div>
      </div>
    </section>);
}
