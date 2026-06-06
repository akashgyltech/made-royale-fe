import React from "react";
import Image from "next/image";
import cate_1 from "@/assets/img/inner-shop/category/shop-by-sofa.webp";
import cate_2 from "@/assets/img/inner-shop/category/shop-by-bed.webp";
import cate_3 from "@/assets/img/inner-shop/category/shop-by-dining.webp";
import cate_4 from "@/assets/img/inner-shop/category/shop-by-chair.webp";
import cate_5 from "@/assets/img/inner-shop/category/shop-by-centertable.webp";
import cate_6 from "@/assets/img/inner-shop/category/shop-by-tvunit.webp";
import cate_7  from "@/assets/img/inner-shop/category/shop-by-wardrobe.webp";




import Link from "next/link";

const category_data = [
  {
    id: 1,
    img: cate_1,
    title: "Sofas",
  },
  {
    id: 2,
    img: cate_2,
    title: "Beds",
  },
  {
    id: 3,
    img: cate_3,
    title: "Dining",
  },
  {
    id: 4,
    img: cate_4,
    title: "Chairs",
  },
  {
    id: 5,
    img: cate_5,
    title: "Center Tables",
  },
  {
    id: 6,
    img: cate_6,
    title: "TV Units",
  },
  {
    id: 7,
    img: cate_7,
    title: "Dining",
  },
  {
    id: 8,
    img: cate_4,
    title: "Shop by Chairs",
  },
];

export default function ShopCategory() {
  return (
    <div className="tp-shop-category-area pt-50 pb-50">
      <div className="container container-1200">
        <div className="row">
          <div className="row justify-content-center">
            <div className="col-xxl-8 col-xl-10">
              <div className="tp-about-2-title-box tp-btn-trigger tp-btn-bounce text-start text-xl-center">
                <h2 className="tp-about-2-section-title gradient-text ">
                  Explore Luxury Furniture by Categories
                </h2>
              </div>
            </div>
          </div>
          <div className="py-lg-3" />
          {category_data.map((item) => (
            <div key={item.id} className="col-xl-3 col-lg-3 col-md-3 mb-30">
              <div
                className="tp-shop-category-item p-relative fix"
                style={{
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                }}
              >
                <Image
                  src={item.img}
                  alt="category-img"
                  unoptimized
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "10px",
                    display: "block",
                  }}
                />

                
              </div>
              <h4
                  className="text-center tp-shop-top-text p-2"
                >
                  {item.title}
                </h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
