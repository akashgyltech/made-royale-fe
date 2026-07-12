import React from "react";
import SectionHeader from "@/components/ui/section-header";
import Stars from "@/components/ui/stars";

const TESTIMONIALS = [
  { name: "Aditya & Meera Rathore", location: "Jaipur, Rajasthan", rating: 5, text: "Our Udaipur Chesterfield is the soul of our living room now. The finish is flawless and the installation team treated our home like a palace." },
  { name: "Rohan Malhotra", location: "Gurugram, Haryana", rating: 5, text: "I compared five luxury brands before choosing Shizenta. Nothing came close to this craftsmanship. It genuinely feels like an heirloom." },
  { name: "Ananya Sen", location: "Kolkata, West Bengal", rating: 5, text: "The Mysore poster bed is a work of art. Delivery was on time, white-glove, and utterly seamless. Worth every rupee." },
];

export default function Testimonials() {
  return (
    <section className="mr-testi">
      <div className="container container-1400">
        <SectionHeader subtitle="Word of Mouth" title="Loved by Discerning Homes" />
        <div className="mr-testi-grid">
          {TESTIMONIALS.map((t) => (
            <div className="mr-testi-card" key={t.name}>
              <span className="mr-testi-quote">&ldquo;</span>
              <Stars rating={t.rating} size={15} />
              <p>{t.text}</p>
              <div className="mr-testi-author"><div className="mr-testi-avatar">{t.name.charAt(0)}</div><div><strong>{t.name}</strong><span>{t.location}</span></div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
