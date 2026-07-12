import React from 'react';

export default function SectionHeader({ subtitle, title }: { subtitle: string; title: string }) {
  return (
    <div className="mr-section-head">
      <span className="mr-section-line" />
      <div className="mr-section-head-content">
        <span className="mr-section-sub">{subtitle}</span>
        <h2 className="mr-section-title">{title}</h2>
      </div>
      <span className="mr-section-line" />
    </div>
  );
}
