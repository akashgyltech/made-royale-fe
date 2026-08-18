'use client';
import React from 'react';
import Link from 'next/link';
const Arrow = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>);
// ── Reusable editorial hero (image + content) ────────────────────────────────
// Shared by the shop, category and collection landing pages. Drop a wide image
// into `banner` (falls back to `image`); leave both empty for an elegant
// gradient placeholder. Pair with `<HeaderSix transparent />` so the header
// floats over the artwork.
export default function LuxHero({ banner, image, eyebrow, title, intro, crumbs, stats, actions, }) {
    const bg = banner || image;
    return (<section className="mr-cathero">
      <div className="mr-cathero-media" aria-hidden="true">
        {bg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={bg} alt="" loading="eager"/>) : (<span className="mr-cathero-fallback"/>)}
        <span className="mr-cathero-scrim"/>
      </div>
      <div className="container container-1400">
        <div className="mr-cathero-inner">
          {crumbs && crumbs.length > 0 && (<nav className="mr-cathero-trail" aria-label="Breadcrumb">
              {crumbs.map((c, i) => (<React.Fragment key={i}>
                  {c.href ? <Link href={c.href}>{c.label}</Link> : <span>{c.label}</span>}
                  {i < crumbs.length - 1 && <em>/</em>}
                </React.Fragment>))}
            </nav>)}
          {eyebrow && <span className="mr-cathero-eyebrow">{eyebrow}</span>}
          <h1 className="mr-cathero-title">{title}</h1>
          {intro && <p className="mr-cathero-intro">{intro}</p>}
          {stats && stats.length > 0 && (<div className="mr-cathero-meta">
              {stats.map((s, i) => (<div key={i}><strong>{s.value}</strong><span>{s.label}</span></div>))}
            </div>)}
          {actions && actions.length > 0 && (<div className="mr-cathero-actions">
              {actions.map((a, i) => (<Link key={i} href={a.href} className={a.variant === 'ghost' ? 'mr-btn-outline mr-cathero-ghost' : 'mr-btn-gold'}>
                  {a.label}{a.variant === 'ghost' ? null : <> <Arrow /></>}
                </Link>))}
            </div>)}
        </div>
      </div>
    </section>);
}
