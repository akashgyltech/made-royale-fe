import React from "react";
import Link from "next/link";

type Props = {
  eyebrow?: string;
  title: string;
  text?: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

// Reusable "call to action" band — dark, gold-accented panel used across the
// site (category pages, home, account) to keep pages feeling full and guide
// visitors toward shopping or booking a consultation.
export default function CtaBand({ eyebrow, title, text, primaryLabel, primaryHref, secondaryLabel, secondaryHref }: Props) {
  return (
    <section className="mr-cta-band">
      <div className="container container-1300">
        <div className="mr-cta-band-inner">
          <div className="mr-cta-band-pattern" aria-hidden="true" />
          <div className="mr-cta-band-content">
            {eyebrow && <span className="mr-cta-band-eyebrow">{eyebrow}</span>}
            <h2 className="mr-cta-band-title">{title}</h2>
            {text && <p className="mr-cta-band-text">{text}</p>}
          </div>
          <div className="mr-cta-band-actions">
            <Link href={primaryHref} className="mr-btn-gold">{primaryLabel}</Link>
            {secondaryLabel && secondaryHref && (
              <Link href={secondaryHref} className="mr-btn-outline mr-cta-band-ghost">{secondaryLabel}</Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
