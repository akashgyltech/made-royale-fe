import React from 'react';
import Link from 'next/link';

export interface Crumb { label: string; href?: string; }

export default function LuxBreadcrumb({ title, subtitle, crumbs }: { title: string; subtitle?: string; crumbs: Crumb[] }) {
  return (
    <section className="mr-breadcrumb">
      <div className="mr-breadcrumb-pattern" aria-hidden="true" />
      <div className="container">
        <div className="mr-breadcrumb-inner text-center">
          <div className="mr-breadcrumb-ornament"><span />❖<span /></div>
          {subtitle && <span className="mr-breadcrumb-sub">{subtitle}</span>}
          <h1 className="mr-breadcrumb-title">{title}</h1>
          <nav className="mr-breadcrumb-trail" aria-label="Breadcrumb">
            {crumbs.map((c, i) => (
              <React.Fragment key={i}>
                {c.href ? <Link href={c.href}>{c.label}</Link> : <span>{c.label}</span>}
                {i < crumbs.length - 1 && <em className="mr-breadcrumb-sep">/</em>}
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
