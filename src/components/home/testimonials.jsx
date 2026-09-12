"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import SectionHeader from "@/components/ui/section-header";
import Stars from "@/components/ui/stars";
const TESTIMONIALS = [
    { name: "Aditya & Meera Rathore", location: "Jaipur, Rajasthan", rating: 5, text: "The Quadriptych mosaic panels are the centerpiece of our living room now. The grain detail is stunning and the installation team treated our home with real care." },
    { name: "Rohan Malhotra", location: "Gurugram, Haryana", rating: 5, text: "I compared a few wood art brands before choosing Shizenta. Nothing came close to the craftsmanship on the Triptych set — it genuinely feels like a handmade heirloom." },
    { name: "Ananya Sen", location: "Kolkata, West Bengal", rating: 5, text: "Ordered a set of the mosaic wall art panels for our new apartment. Delivery was on time and the packaging was excellent. Worth every rupee." },
    { name: "Karan Vora", location: "Ahmedabad, Gujarat", rating: 5, text: "The natural grain on the live-edge pieces is exactly what we wanted — no two panels are alike, which is the whole point." },
    { name: "Priya Nair", location: "Bengaluru, Karnataka", rating: 5, text: "Beautiful craftsmanship on the wall art. It's clear these are handmade, not mass-produced — you can see it in the finish." },
];
export default function Testimonials() {
    return (<section className="mr-testi">
      <div className="container container-1400">
        <SectionHeader subtitle="Word of Mouth" title="Loved by Discerning Homes"/>
        <Swiper
          modules={[Autoplay]}
          slidesPerView={1}
          spaceBetween={24}
          loop={true}
          speed={5000}
          autoplay={{ delay: 1, disableOnInteraction: false, pauseOnMouseEnter: true }}
          allowTouchMove={true}
          breakpoints={{ 768: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } }}
          className="mr-testi-slider"
        >
          {TESTIMONIALS.map((t) => (<SwiperSlide key={t.name}>
              <div className="mr-testi-card">
                <span className="mr-testi-quote">&ldquo;</span>
                <Stars rating={t.rating} size={15}/>
                <p>{t.text}</p>
                <div className="mr-testi-author"><div className="mr-testi-avatar">{t.name.charAt(0)}</div><div><strong>{t.name}</strong><span>{t.location}</span></div></div>
              </div>
            </SwiperSlide>))}
        </Swiper>
      </div>
    </section>);
}
