"use client";
import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import ShopItem from "./shop-item";
import SectionHeader from "@/components/ui/section-header";
export default function ShopProducts({ products, sectionId = "trending", subtitle = "Curated Collection", title = "Trending Masterpieces", viewAllHref = "/shop", viewAllLabel = "View All Products", emptyMessage = "New masterpieces are on their way — check back soon." }) {
    const list = products.slice(0, 8);
    const prevClass = `mr-slider-prev-${sectionId}`;
    const nextClass = `mr-slider-next-${sectionId}`;
    const slider_setting = {
        slidesPerView: 4,
        spaceBetween: 26,
        loop: true,
        speed: 900,
        autoplay: { delay: 3500, disableOnInteraction: false },
        navigation: { prevEl: `.${prevClass}`, nextEl: `.${nextClass}` },
        breakpoints: { 1400: { slidesPerView: 4 }, 1200: { slidesPerView: 3 }, 992: { slidesPerView: 3 }, 768: { slidesPerView: 2 }, 576: { slidesPerView: 2 }, 0: { slidesPerView: 1 } },
    };
    return (<section className="mr-trending">
      <div className="container container-1500">
        <SectionHeader subtitle={subtitle} title={title}/>
        {list.length > 0 ? (<div className="mr-slider-wrap">
            <button className={`mr-slider-nav mr-slider-prev ${prevClass}`} aria-label="Previous"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg></button>
            <button className={`mr-slider-nav mr-slider-next ${nextClass}`} aria-label="Next"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg></button>
            <Swiper {...slider_setting} modules={[Navigation, Autoplay]} className="mr-trending-slider">
              {list.map((item) => (<SwiperSlide key={item.id}><ShopItem product={item}/></SwiperSlide>))}
            </Swiper>
          </div>) : (<p className="mr-catproducts-empty">{emptyMessage}</p>)}
        <div className="text-center mt-45"><Link href={viewAllHref} className="mr-btn-solid">{viewAllLabel}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></Link></div>
      </div>
    </section>);
}
