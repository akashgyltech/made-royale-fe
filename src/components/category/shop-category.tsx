import React from "react";
import Image from "next/image";
import Link from "next/link";
import cate_1 from "@/assets/img/inner-shop/category/shop-by-sofa.webp";
import cate_2 from "@/assets/img/inner-shop/category/shop-by-bed.webp";
import cate_3 from "@/assets/img/inner-shop/category/shop-by-dining.webp";
import cate_4 from "@/assets/img/inner-shop/category/shop-by-chair.webp";
import cate_5 from "@/assets/img/inner-shop/category/shop-by-centertable.webp";
import cate_6 from "@/assets/img/inner-shop/category/shop-by-tvunit.webp";
import cate_7 from "@/assets/img/inner-shop/category/shop-by-wardrobe.webp";

const category_data = [
  { id: 1, img: cate_1, title: "Sofas", slug: "sofas" },
  { id: 2, img: cate_2, title: "Beds", slug: "beds" },
  { id: 3, img: cate_3, title: "Dining", slug: "dining" },
  { id: 4, img: cate_4, title: "Chairs", slug: "chairs" },
  { id: 5, img: cate_5, title: "Center Tables", slug: "center-tables" },
  { id: 6, img: cate_6, title: "TV Units", slug: "tv-units" },
  { id: 7, img: cate_7, title: "Wardrobes", slug: "wardrobes" },
  { id: 8, img: cate_4, title: "Recliners", slug: "recliners" },
];

export default function ShopCategory() {
  return (
    <div className="tp-shop-category-area pt-50 pb-50">
      <style>{`
        .category-card {
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          transition: transform 0.32s cubic-bezier(.25,.8,.25,1), box-shadow 0.32s ease;
          position: relative;
          display: block;
          background: #fff;
          cursor: pointer;
          text-decoration: none !important;
        }
        .category-card:hover {
          transform: translateY(-6px) scale(1.025);
          box-shadow: 0 8px 24px rgba(0,0,0,0.09);
        }
        .category-card-img-wrap {
          position: relative;
          overflow: hidden;
        }
        .category-card-img-wrap img {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.4s ease;
        }
        .category-card:hover .category-card-img-wrap img {
          transform: scale(1.07);
        }
        .category-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%);
          opacity: 0;
          transition: opacity 0.32s ease;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 16px;
        }
        .category-card:hover .category-card-overlay {
          opacity: 1;
        }
        .category-card-overlay-text {
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .category-card-overlay-text svg {
          transition: transform 0.2s ease;
        }
        .category-card:hover .category-card-overlay-text svg {
          transform: translateX(4px);
        }
        .category-card-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 12px 8px 14px;
          font-size: 14px;
          font-weight: 600;
          color: #222;
          letter-spacing: 0.2px;
          transition: color 0.2s ease;
          text-align: center;
        }
        .category-card:hover .category-card-title {
          color: #b8860b;
        }
        .category-card-title-arrow {
          display: inline-flex;
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .category-card:hover .category-card-title-arrow {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>
      <div className="container container-1200">
        <div className="row">
               <div className="tp-royal-shop-header mb-55">
            <div className="tp-royal-shop-header-line" />
            <div className="tp-royal-shop-header-content">
              <span className="tp-royal-shop-subtitle">Curated Catgories</span>
              <h2 className="tp-royal-shop-title">Explore Luxury Furniture by Categories</h2>
            </div>
            <div className="tp-royal-shop-header-line" />
          </div>
          <div className="py-lg-3" />
          {category_data.map((item) => (
            <div key={item.id} className="col-xl-3 col-lg-3 col-md-4 col-6 mb-30">
              <Link href={`/shop?category=${item.slug}`} className="category-card">
                <div className="category-card-img-wrap">
                  <Image
                    src={item.img}
                    alt={item.title}
                    unoptimized
                  />
                  <div className="category-card-overlay">
                    <span className="category-card-overlay-text">
                      Shop Now
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="category-card-title">
                  {item.title}
                  <span className="category-card-title-arrow">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span>
                </div>
              </Link>
            </div>
          ))}
          <div className="col-12 text-center mt-10 mb-10">
            <Link href="/shop" className="tp-btn-view-all">
              View All Categories
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
      <style>{`
        .tp-btn-view-all {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 34px;
          border: 2px solid #b8860b;
          border-radius: 50px;
          color: #b8860b;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.4px;
          text-decoration: none !important;
          transition: background 0.28s ease, color 0.28s ease, box-shadow 0.28s ease;
        }
        .tp-btn-view-all:hover {
          background: #b8860b;
          color: #fff;
          box-shadow: 0 4px 16px rgba(184,134,11,0.18);
        }
        .tp-btn-view-all svg {
          transition: transform 0.22s ease;
        }
        .tp-btn-view-all:hover svg {
          transform: translateX(5px);
        }
      `}</style>
    </div>
  );
}
