import React from 'react';
import Link from 'next/link';
export default function LuxBreadcrumb({ title, subtitle, crumbs, image }) {
    return (<section className="mr-breadcrumb">
      {image && (<>
          <img src={image} alt="" className="mr-breadcrumb-bg"/>
          <div className="mr-breadcrumb-overlay" aria-hidden="true"/>
        </>)}
      <div className="mr-breadcrumb-pattern" aria-hidden="true"/>
      <div className="container">
        <div className="mr-breadcrumb-inner text-center">
          <div className="mr-breadcrumb-ornament"><span />❖<span /></div>
          {subtitle && <span className="mr-breadcrumb-sub">{subtitle}</span>}
          <h1 className="mr-breadcrumb-title">{title}</h1>
          <nav className="mr-breadcrumb-trail" aria-label="Breadcrumb">
            {crumbs.map((c, i) => (<React.Fragment key={i}>
                {c.href ? <Link href={c.href}>{c.label}</Link> : <span>{c.label}</span>}
                {i < crumbs.length - 1 && <em className="mr-breadcrumb-sep">/</em>}
              </React.Fragment>))}
          </nav>
        </div>
      </div>
    </section>);
}
