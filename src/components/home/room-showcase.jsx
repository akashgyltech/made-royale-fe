import Link from "next/link";
import { rooms } from "@/data/catalog";
import SectionHeader from "@/components/ui/section-header";
const Arrow = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
export default function RoomShowcase({ counts }) {
    return (<section className="mr-collections" id="rooms">
      <div className="container container-1400">
        <SectionHeader subtitle="Shop by Room" title="Furnish Every Space"/>
        <div className="mr-collections-grid">
          {rooms.map((r) => {
            const count = counts[r.slug] ?? 0;
            return (<Link key={r.slug} href={`/room/${r.slug}`} className={`mr-collection-card${r.image ? " has-image" : ""}`}>
                {r.image && (<span className="mr-collection-media" aria-hidden="true">
                    <img src={r.image} alt="" loading="lazy"/>
                  </span>)}
                <div className="mr-collection-body">
                  <h3 className="mr-collection-name">{r.name}</h3>
                  <p className="mr-collection-tag">{r.tagline}</p>
                  <span className="mr-collection-link">Explore{count > 0 ? ` ${count} pieces` : ""} <Arrow /></span>
                </div>
              </Link>);
        })}
        </div>
      </div>
    </section>);
}
