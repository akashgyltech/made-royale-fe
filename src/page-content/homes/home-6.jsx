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
import AssuranceStrip from "@/components/home/assurance-strip";
import CollectionsShowcase from "@/components/home/collections-showcase";
import RoomShowcase from "@/components/home/room-showcase";
import Testimonials from "@/components/home/testimonials";
import HomeFaq from "@/components/home/home-faq";
import { useEffect } from "react";
import { panelOneAnimation } from "@/utils/panel-animation";
import PortfolioSliderHomeTen from "@/components/portfolio/slider/portfolio-slider-home-ten";
const HomeSixMain = ({ featuredProducts, categories, collectionCounts, roomCounts, faqs }) => {
    useScrollSmooth();
    useEffect(() => {
        document.body.classList.add("tp-smooth-scroll");
        return () => {
            document.body.classList.remove("tp-smooth-scroll");
        };
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
    return (<Wrapper>
    
      <HeaderSix transparent/>

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <HeroBannerSix />

            <AssuranceStrip />

            <ShopCategory categories={categories}/>

            <RoomShowcase counts={roomCounts}/>

            <HeroBannerTwo imageSrc={"/assets/img/inner-shop/home/hero-bg-14.webp"} imageAlt={"Hero-banner-12"} buttonLink={"/shop"} buttonText={"Explore Now"} subtitle={"Experience the perfect blend of elegance, comfort, and craftsmanship. Our carefully curated furniture collections are designed to transform your home into a space that reflects your style while providing lasting quality and everyday comfort."} title={"Luxury Meets Comfort"}/>

            <ShopProducts products={featuredProducts}/>

            <CollectionsShowcase counts={collectionCounts}/>

            <PortfolioSliderHomeTen />

            <Testimonials />

            <HomeFaq faqs={faqs}/>

            <BrandFour />

          </main>

          {/* footer area */}
          <FooterSix />
          {/* footer area */}
        </div>
      </div>
    </Wrapper>);
};
export default HomeSixMain;
