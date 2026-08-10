"use client";
import React, { useState } from "react";
import Link from "next/link";
import type { FaqItem } from "@/lib/cms-content";

const DEFAULT_FAQS: FaqItem[] = [
  { question: "Is delivery and installation really free?", answer: "Yes. Every order includes complimentary white-glove delivery and professional assembly by our trained craftsmen, anywhere in India. Packaging is recyclable and hauled away at no cost." },
  { question: "What materials do you use?", answer: "We use solid Sheesham and Burma teak, genuine Makrana marble, full-grain leather, Italian velvets and hand-cut brass. Where we use engineered wood, it is premium BWR-grade for durability." },
  { question: "Do you offer No-Cost EMI?", answer: "Absolutely. We offer 3, 6, 9 and 12-month No-Cost EMI plans across all major Indian banks and cards, selectable at checkout." },
  { question: "What is your warranty and return policy?", answer: "Solid-wood pieces carry up to a 10-year structural warranty, and every order is covered by a 7-day easy return policy if you are not completely delighted." },
  { question: "Can I customise a piece or request a GST invoice?", answer: "Many pieces offer finish and upholstery choices. For business purchases, you can add your GSTIN at checkout to receive a GST-compliant invoice." },
  { question: "How can I track my order?", answer: "Once your order is placed you will receive an order number. Track its journey any time from the Track Order page or your account." },
];

export default function HomeFaq({ faqs }: { faqs?: FaqItem[] | null }) {
  const [open, setOpen] = useState(0);
  const data = faqs && faqs.length > 0 ? faqs : DEFAULT_FAQS;
  return (
    <section className="mr-faq">
      <div className="container container-1400">
        <div className="mr-faq-inner">
          <div className="mr-faq-intro">
            <span className="mr-faq-intro-eyebrow">Concierge</span>
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about buying, delivery, warranty and care. Still have a question? Our concierge is always at your service.</p>
            <Link href="/contact" className="mr-btn-outline">Talk to Concierge</Link>
          </div>
          <div className="mr-faq-list">
            {data.map((f, i) => (
              <div className={`mr-faq-item ${open === i ? "is-open" : ""}`} key={i}>
                <button className="mr-faq-q" onClick={() => setOpen(open === i ? -1 : i)}>{f.question}<span>+</span></button>
                <div className="mr-faq-a"><p>{f.answer}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
