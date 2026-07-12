import React from "react";

const ITEMS = [
  { icon: "🚚", title: "White-Glove Delivery", text: "Free across India, fully installed" },
  { icon: "🛡️", title: "Up to 10-Yr Warranty", text: "On solid-wood craftsmanship" },
  { icon: "🧾", title: "No-Cost EMI", text: "Flexible 3–12 month plans" },
  { icon: "↩️", title: "7-Day Easy Returns", text: "Peace of mind, guaranteed" },
];

export default function AssuranceStrip() {
  return (
    <section className="mr-assure-strip">
      <div className="container container-1400">
        <div className="mr-assure-grid">
          {ITEMS.map((it) => (
            <div className="mr-assure-item" key={it.title}>
              <div className="mr-assure-icon">{it.icon}</div>
              <div><strong>{it.title}</strong><span>{it.text}</span></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
