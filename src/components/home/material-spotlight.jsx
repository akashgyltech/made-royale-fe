"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ShopItem from "@/components/shop/shop-item";
const Arrow = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>);
export default function MaterialSpotlight({ image, eyebrow = "Shop the Material", title, subtitle, href, buttonText, products = [], sectionId = "spotlight" }) {
    return (<section className="mr-spotlight">
      <div className="container container-1500">
        <div className="mr-spotlight-grid">
          <div className="mr-spotlight-media" style={{ backgroundImage: `url(${image})` }}>
            <div className="mr-spotlight-scrim"/>
            <div className="mr-spotlight-content">
              <div className="mr-spotlight-glass">
                <span className="mr-spotlight-eyebrow">{eyebrow}</span>
                <h2 className="mr-spotlight-title">{title}</h2>
                {subtitle && <p className="mr-spotlight-body">{subtitle}</p>}
                <Link href={href} className="mr-btn-white">{buttonText} <Arrow /></Link>
              </div>
            </div>
          </div>
          <div className="mr-spotlight-products">
            {products.length > 0 ? (<div className="mr-slider-wrap">
                <button className={`mr-slider-nav mr-slider-prev mr-slider-prev-${sectionId}`} aria-label="Previous"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg></button>
                <button className={`mr-slider-nav mr-slider-next mr-slider-next-${sectionId}`} aria-label="Next"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg></button>
                <Swiper slidesPerView={1} spaceBetween={20} loop={products.length > 2} navigation={{ prevEl: `.mr-slider-prev-${sectionId}`, nextEl: `.mr-slider-next-${sectionId}` }} modules={[Navigation]} breakpoints={{ 640: { slidesPerView: 2 } }} className="mr-spotlight-slider">
                  {products.map((p) => (<SwiperSlide key={p.id}><ShopItem product={p}/></SwiperSlide>))}
                </Swiper>
              </div>) : (<div className="mr-spotlight-empty">
                <span>✦</span>
                <p>New pieces from this collection are being crafted — check back soon.</p>
                <Link href={href} className="mr-btn-outline">Explore the Collection</Link>
              </div>)}
          </div>
        </div>
      </div>
    </section>);
}
