"use client";
import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { SwiperOptions } from "swiper/types";
import product_data from "@/data/product-data";
import { IProductDT } from "@/types/product-d-t";
import ProductModal from "../modal/product-modal";
import ShopItem from "./shop-item";

const slider_setting: SwiperOptions = {
  slidesPerView: 4,
  spaceBetween: 30,
  loop: true,
  speed: 900,
  autoplay: { delay: 3500, disableOnInteraction: false },
  navigation: {
    prevEl: ".tp-royal-shop-prev",
    nextEl: ".tp-royal-shop-next",
  },
  breakpoints: {
    1400: { slidesPerView: 4 },
    1200: { slidesPerView: 3 },
    992: { slidesPerView: 3 },
    768: { slidesPerView: 2 },
    576: { slidesPerView: 2 },
    0: { slidesPerView: 1 },
  },
};

export default function ShopProducts() {
  const products = [...product_data].slice(0, 8);
  const [productItem, setProductItem] = React.useState<IProductDT | null>(null);
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);

  function handleProductModal(product: IProductDT) {
    setModalOpen(true);
    setProductItem(product);
  }

  return (
    <>
      <section className="tp-royal-shop-area pt-70 pb-80">
        <div className="container-fluid">

          {/* Header */}
          <div className="tp-royal-shop-header mb-55">
            <div className="tp-royal-shop-header-line" />
            <div className="tp-royal-shop-header-content">
              <span className="tp-royal-shop-subtitle">Curated Collection</span>
              <h2 className="tp-royal-shop-title">Trending Products</h2>
            </div>
            <div className="tp-royal-shop-header-line" />
          </div>

          {/* Slider wrapper */}
          <div className="tp-royal-shop-slider-wrap p-relative">

            {/* Nav buttons */}
            <button className="tp-royal-shop-nav tp-royal-shop-prev" aria-label="Previous">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button className="tp-royal-shop-nav tp-royal-shop-next" aria-label="Next">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            <Swiper
              {...slider_setting}
              modules={[Navigation, Autoplay]}
              className="tp-royal-shop-slider"
            >
              {products.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="tp-royal-shop-card">
                    <ShopItem product={item} handleProductModal={handleProductModal} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* View All button */}
          <div className="tp-royal-shop-btn-wrap text-center mt-55">
            <Link href="/shop" className="tp-royal-view-all-btn">
              <span className="tp-royal-view-all-btn-text">View All Products</span>
              <span className="tp-royal-view-all-btn-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </div>

        </div>
      </section>

      {productItem && (
        <ProductModal
          showModal={modalOpen}
          setShowModal={setModalOpen}
          productItem={productItem}
          setProductItem={setProductItem}
        />
      )}
    </>
  );
}
