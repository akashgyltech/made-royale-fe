'use client';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade } from "swiper/modules";
import { SwiperOptions } from "swiper/types";
import Link from "next/link";

const hero_data = [
  {
    id: 1,
    bg: "/assets/img/home/home-bg-1.webp",
    subtitle: "Nature Inspired Living",
    title: "Crafted to Perfection",
  },
];

export default function HeroBannerSix() {
  const slider_setting: SwiperOptions = {
    slidesPerView: 1,
    loop: false,
    spaceBetween: 0,
    speed: 1000,
    effect: "fade",
    navigation: {
      prevEl: ".tp-shop-prev",
      nextEl: ".tp-shop-next",
    },
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: "#paginations",
      type: "custom",
      renderCustom: function (swiper, current, total) {
        const zero = total > 9 ? "" : "0";
        const index = zero + current;
        const all = zero + total;
        const html = `<div class="shop-slider-pagination">
                  <span>${index}</span>
                  <span>${all}</span>
                </div>`;
        return html;
      },
    },
  };
  return (
    <div className="tp-shop-slider-area p-relative">
      <div className="shop-slider-wrapper">
        <Swiper
          {...slider_setting}
          modules={[Navigation, Pagination,EffectFade]}
          className="swiper-container tp-shop-slider-active"
        >
          {hero_data.map((item) => (
            <SwiperSlide key={item.id} className="swiper-slide">
              <div className="tp-shop-slider-bg tp-shop-slider-ovarlay">
                <div
                  className="tp-shop-slider-thumb"
                  data-background="assets/img/inner-shop/home/slider-1.jpg"
                  style={{ backgroundImage: `url(${item.bg})` }}
                ></div>
                <div className="container container-1300">
                  <div className="row">
                    <div className="col-xl-8">
                      <div className="tp-shop-slider-content z-index">
                        <div className="tp-shop-slider-title-box">
                          <span className="tp-shop-slider-subtitle">
                            {item.subtitle}
                          </span>
                          <h2
                            className="tp-shop-slider-title"
                            dangerouslySetInnerHTML={{ __html: item.title }}
                          ></h2>
                        </div>
                        <div className="tp-shop-slider-btn-box">
                          <Link className="tp-shop-btn" href="/shop">
                            Shop Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
