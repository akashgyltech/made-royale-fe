"use client";
import { gsap } from "gsap";
import useScrollSmooth from "@/hooks/use-scroll-smooth";
import { ScrollSmoother, ScrollTrigger, SplitText } from "@/plugins";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, SplitText);

// internal imports
import Wrapper from "@/layouts/wrapper";
import HeaderSix from "@/layouts/headers/header-six";
import HeroBannerSix from "@/components/hero-banner/hero-banner-six";
import ShopCategory from "@/components/category/shop-category";
import ShopProducts from "@/components/shop/shop-products";
// images
import BrandFour from "@/components/brand/brand-four";
import FooterSix from "@/layouts/footers/footer-six";
import AboutTwo from "@/components/about/about-two";
import HeroBannerTwo from "@/components/hero-banner/hero-banner-two";
// animation

const HomeSixMain = () => {
  useScrollSmooth();

  useGSAP(() => {
    const timer = setTimeout(() => {
      let sp = gsap.matchMedia();
      sp.add("(min-width: 1200px)", () => {
        if (document.querySelectorAll(".tp-shop-area")) {
          ScrollTrigger.create({
            trigger: ".tp-shop-area",
            start: "top -3%",
            end: "bottom 110.5%",
            pin: ".tp-shop-left-thumb",
            pinSpacing: true,
          });
        }
      });
    }, 100);
    return () => clearTimeout(timer);
  });

  return (
    <Wrapper>
    
      <HeaderSix transparent />

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <HeroBannerSix />

            <ShopCategory />

            <HeroBannerTwo />
            
            <ShopProducts />

            {/* brand area start */}
            <BrandFour />
            {/* brand area end */}
          </main>

          {/* footer area */}
          <FooterSix />
          {/* footer area */}
        </div>
      </div>
    </Wrapper>
  );
};

export default HomeSixMain;
