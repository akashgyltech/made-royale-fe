"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import SectionHeader from "@/components/ui/section-header";
const Arrow = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>);
const slider_setting = {
    slidesPerView: 2,
    spaceBetween: 12,
    speed: 900,
    loop: true,
    autoplay: { delay: 3000, disableOnInteraction: true },
    navigation: { prevEl: ".mr-cat-slider-prev", nextEl: ".mr-cat-slider-next" },
    breakpoints: {
        1400: { slidesPerView: 4, spaceBetween: 26 },
        1200: { slidesPerView: 3.3, spaceBetween: 24 },
        992: { slidesPerView: 2.6, spaceBetween: 22 },
        576: { slidesPerView: 2.2, spaceBetween: 16 },
    },
};
export default function ShopCategory({ categories, counts = {} }) {
    return (<div className="mr-cats">
      <div className="container container-1400">
        <SectionHeader subtitle="Curated Categories" title="Explore Luxury Furniture by Category"/>

        {categories.length > 0 ? (<div className="mr-slider-wrap">
            <button className="mr-slider-nav mr-cat-slider-prev" aria-label="Previous"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg></button>
            <button className="mr-slider-nav mr-cat-slider-next" aria-label="Next"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg></button>
            <Swiper {...slider_setting} modules={[Navigation, Autoplay]} className="mr-cats-slider">
              {categories.map((item) => {
                const count = counts[item.slug] ?? 0;
                return (<SwiperSlide key={item.id}>
                    <Link href={item.href || `/category/${item.slug}`} className={`mr-collection-card${item.image ? " has-image" : ""}`}>
                      {item.image && (<span className="mr-collection-media" aria-hidden="true">
                          <img src={item.image} alt="" loading="lazy"/>
                        </span>)}
                      <div className="mr-collection-body">
                        <h3 className="mr-collection-name">{item.name}</h3>
                        <p className="mr-collection-tag">{item.tagline}</p>
                        <span className="mr-collection-link">Explore{count > 0 ? ` ${count} pieces` : ""} <Arrow /></span>
                      </div>
                    </Link>
                  </SwiperSlide>);
            })}
            </Swiper>
          </div>) : (<p className="mr-catproducts-empty">Categories are being curated — check back soon.</p>)}

        <div className="mr-cats-cta">
          <Link href="/shop" className="mr-btn-outline">View All Furniture
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <Link href="/track-order" className="mr-btn-text">Track your order →</Link>
        </div>
      </div>
    </div>);
}
