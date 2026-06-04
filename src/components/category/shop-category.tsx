import React from "react";
import Image from "next/image";
import cate_1 from "@/assets/img/inner-shop/category/shop-by-sofa.webp";
import cate_2 from "@/assets/img/inner-shop/category/shop-by-bed.webp";
import cate_3 from "@/assets/img/inner-shop/category/shop-by-dining.webp";
import cate_4 from "@/assets/img/inner-shop/category/shop-by-chair.webp";

import Link from "next/link";

const category_data = [
  {
    id: 1,
    img: cate_1,
    title: "Shop by Sofas",
  },
  {
    id: 2,
    img: cate_2,
    title: "Shop by Beds",
  },
  {
    id: 3,
    img: cate_3,
    title: "Shop by Dining",
  },
  {
    id: 4,
    img: cate_4,
    title: "Shop by Chairs",
  },
];

export default function ShopCategory() {
  return (
    <div className="tp-shop-category-area pt-50 pb-90">
      <div className="container container-1720">
        <div className="row">
          <div className="row justify-content-center">
            <div className="col-xxl-8 col-xl-10">
              <div className="tp-about-2-title-box tp-btn-trigger tp-btn-bounce mb-70 text-start text-xl-center">
                <h2 className="tp-about-2-section-title ">
                  Explore Luxury Furniture by Categories
                </h2>
              </div>
            </div>
          </div>
          {category_data.map((item) => (
            <div key={item.id} className="col-xl-3 col-lg-3 col-md-3 mb-30">
              <div className="tp-shop-category-item p-relative fix">
                <Image src={item.img} alt="category-img" style={{ height: "auto" }} unoptimized className="border-radius-10"/>
                <Link className="tp-btn-shop-category" href="/shop">
                  {item.title}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
