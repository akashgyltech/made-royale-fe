'use client';
import React from 'react';

// Image-ready placeholder. Pass `src` (e.g. "/assets/img/products/sofa.jpg") and
// it renders the real image; leave it empty and an elegant monogram placeholder
// shows instead — so photos can be dropped in later without touching layout.

const GRADIENTS: [string, string][] = [
  ['#1a1208', '#3a2a12'], ['#20303a', '#0f1a20'], ['#2a1420', '#3a1f2e'], ['#14261c', '#0f3325'],
  ['#2a2416', '#3a3320'], ['#231a2e', '#150f20'], ['#2e1f14', '#1a120a'], ['#1c2330', '#12202e'],
];
function hash(s: string) { let h = 0; for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i); return Math.abs(h); }
function monogram(name: string) {
  const w = name.replace(/[^a-zA-Z ]/g, '').trim().split(/\s+/);
  return (w.length === 1 ? w[0].slice(0, 2) : w[0][0] + w[1][0]).toUpperCase();
}

type Props = {
  src?: string;
  alt: string;
  ratio?: string;
  label?: string;
  glyph?: string;
  className?: string;
  rounded?: number;
};

export default function SmartImage({ src, alt, ratio = '4 / 3', label, glyph, className = '', rounded = 0 }: Props) {
  if (src) {
    return (
      <div className={`mr-img ${className}`} style={{ aspectRatio: ratio, borderRadius: rounded }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" />
      </div>
    );
  }
  const [c1, c2] = GRADIENTS[hash(alt) % GRADIENTS.length];
  return (
    <div
      className={`mr-ph ${className}`}
      style={{ aspectRatio: ratio, borderRadius: rounded, background: `linear-gradient(145deg, ${c1} 0%, ${c2} 100%)` }}
      role="img"
      aria-label={alt}
    >
      <div className="mr-ph-pattern" aria-hidden="true" />
      <svg className="mr-ph-crown" width="26" height="20" viewBox="0 0 26 20" fill="none" aria-hidden="true">
        <path d="M2 6l4 4 7-8 7 8 4-4-2 12H4L2 6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
      <div className="mr-ph-inner">
        {glyph && <span className="mr-ph-glyph">{glyph}</span>}
        <span className="mr-ph-mono">{monogram(alt)}</span>
        {label && <span className="mr-ph-label">{label}</span>}
      </div>
    </div>
  );
}
