"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import SectionHeader from "@/components/ui/section-header";
const Arrow = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
const slider_setting = {
    slidesPerView: 2,
    spaceBetween: 12,
    speed: 900,
    loop: true,
    autoplay: { delay: 3000, disableOnInteraction: true },
    navigation: { prevEl: ".mr-coll-slider-prev", nextEl: ".mr-coll-slider-next" },
    breakpoints: {
        1400: { slidesPerView: 4, spaceBetween: 26 },
        1200: { slidesPerView: 3.3, spaceBetween: 24 },
        992: { slidesPerView: 2.6, spaceBetween: 22 },
        576: { slidesPerView: 2.2, spaceBetween: 16 },
    },
};
export default function CollectionsShowcase({ collections, counts = {} }) {
    if (!collections || collections.length === 0)
        return null;
    return (<section className="mr-collections" id="collections">
      <div className="container container-1400">
        <SectionHeader subtitle="Signature Lines" title="Explore Our Collections"/>
        <div className="mr-slider-wrap">
          <button className="mr-slider-nav mr-coll-slider-prev" aria-label="Previous"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg></button>
          <button className="mr-slider-nav mr-coll-slider-next" aria-label="Next"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg></button>
          <Swiper {...slider_setting} modules={[Navigation, Autoplay]} className="mr-cats-slider">
            {collections.map((c) => {
                const count = counts[c.slug] ?? 0;
                return (<SwiperSlide key={c.slug}>
                    <Link href={c.href || `/collection/${c.slug}`} className={`mr-collection-card${c.image ? " has-image" : ""}`}>
                      {c.image && (<span className="mr-collection-media" aria-hidden="true">
                          <img src={c.image} alt="" loading="lazy"/>
                        </span>)}
                      <div className="mr-collection-body">
                        <h3 className="mr-collection-name">{c.name}</h3>
                        <p className="mr-collection-tag">{c.tagline}</p>
                        <span className="mr-collection-link">Explore{count > 0 ? ` ${count} pieces` : ""} <Arrow /></span>
                      </div>
                    </Link>
                  </SwiperSlide>);
            })}
          </Swiper>
        </div>
      </div>
    </section>);
}
