import LuxHero from "@/components/ui/lux-hero";
import SmartImage from "@/components/ui/smart-image";
import SectionHeader from "@/components/ui/section-header";
import CtaBand from "@/components/ui/cta-band";
const VALUES = [
    { icon: "🌿", title: "Natural Materials First", text: "Real timber, real grain, real character — never veneer or engineered wood dressed up to look natural." },
    { icon: "✦", title: "Handcrafted, Not Mass-Produced", text: "Every piece passes through an artisan's hands, not an assembly line. No two pieces are ever quite identical." },
    { icon: "🪵", title: "Responsibly Sourced Timber", text: "Our teak and hardwood come through government-authorized procurement from the forests of Madhya Pradesh." },
    { icon: "◈", title: "Built to Be Lived With", text: "Furniture and décor made to age well — gaining character over years, not wearing out in a season." },
];
export default function AboutLanding() {
    return (<>
      <LuxHero banner="https://ik.imagekit.io/shizenta/shizenta/categories/1788521412005-y6kcr9dficq.png" eyebrow="Our Story" title="Crafted From Nature, Not a Factory Line" intro="Shizenta began with a simple belief: that the most beautiful pieces for a home are the ones nature already designed — we just help reveal them." crumbs={[{ label: 'Home', href: '/' }, { label: 'About Us' }]} actions={[{ label: 'Explore the Collection', href: '/shop' }]}/>

      <section className="mr-catstory">
        <div className="container container-1400">
          <div className="mr-catstory-inner">
            <div className="mr-catstory-media">
              <SmartImage src="https://ik.imagekit.io/shizenta/shizenta/categories/1788519972929-m8fqtue1lnk.png" alt="Wood slabs sourced from Madhya Pradesh" glyph="✦" label="Shizenta" ratio="4 / 3" rounded={12}/>
              <span className="mr-catstory-badge">Made in India</span>
            </div>
            <div className="mr-catstory-content">
              <span className="mr-catstory-eyebrow">Where It Starts</span>
              <h2 className="mr-catstory-title">From the Forests of Madhya Pradesh</h2>
              <p className="mr-catstory-body">
                Every piece we make starts as a single slab or plank of timber — teak, sheesham and other hardwoods sourced through
                government-authorized procurement from Central India. We don't hide what makes each piece of wood individual: the
                grain, the knots, the natural edge left exactly as the tree grew it. Our mosaic wall art, live-edge slabs, bar
                cabinets and hand-turned wooden vessels are all built around that idea — that natural material, honestly worked,
                doesn't need to be disguised to be beautiful.
              </p>
              <ul className="mr-catstory-list">
                <li><span>✦</span> Real timber — teak, sheesham & selected Indian hardwoods</li>
                <li><span>✦</span> Handcrafted by artisans, not mass-manufactured</li>
                <li><span>✦</span> Every finished piece is naturally one of a kind</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mr-catfeatures">
        <div className="container container-1400">
          <SectionHeader subtitle="What We Believe" title="What Shizenta Stands For"/>
          <div className="mr-catfeatures-grid">
            {VALUES.map((v) => (<div key={v.title} className="mr-catfeature">
                <span className="mr-catfeature-icon">{v.icon}</span>
                <strong>{v.title}</strong>
                <p>{v.text}</p>
              </div>))}
          </div>
        </div>
      </section>

      <CtaBand eyebrow="Bring Nature Home" title="See the Craft for Yourself" text="Explore mosaic wall art, live-edge wood and handcrafted pieces built from real, natural timber." primaryLabel="Shop the Collection" primaryHref="/shop" secondaryLabel="Get in Touch" secondaryHref="/contact"/>
    </>);
}
