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
import HeroBannerTwo from "@/components/hero-banner/hero-banner-two";
import ProjectTwo from "@/components/project/project-two";
import { useEffect } from "react";
import { bounceAnimation } from "@/utils/title-animation";
import { aboutAnim } from "@/utils/about-anim";
import { panelOneAnimation } from "@/utils/panel-animation";
import PortfolioSliderHomeTen from "@/components/portfolio/slider/portfolio-slider-home-ten";
// animation

const HomeSixMain = () => {
  useScrollSmooth();
   useEffect(() => {
      document.body.classList.add("tp-smooth-scroll");
      return () => {
        document.body.classList.remove("tp-smooth-scroll");
      }
    }, []);

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
      // bounceAnimation();
      // aboutAnim();
      panelOneAnimation();
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

            <HeroBannerTwo imageSrc={"/assets/img/inner-shop/home/hero-bg-14.webp"} imageAlt={"Hero-banner-12"} buttonLink={"/"} buttonText={"Explore Now"} subtitle={"Experience the perfect blend of elegance, comfort, and craftsmanship. Our carefully curated furniture collections are designed to transform your home into a space that reflects your style while providing lasting quality and everyday comfort."} title={"Luxury Meets Comfort"}/>
            
            <ShopProducts />

            <PortfolioSliderHomeTen />
            

            <BrandFour />

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
