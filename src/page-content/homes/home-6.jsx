"use client";
import { gsap } from "gsap";
import useScrollSmooth from "@/hooks/use-scroll-smooth";
import { ScrollSmoother, ScrollTrigger, SplitText } from "@/plugins";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, SplitText);
import Wrapper from "@/layouts/wrapper";
import HeaderSix from "@/layouts/headers/header-six";
import HeroBannerSix from "@/components/hero-banner/hero-banner-six";
import ShopCategory from "@/components/category/shop-category";
import ShopProducts from "@/components/shop/shop-products";
import FooterSix from "@/layouts/footers/footer-six";
import HeroBannerTwo from "@/components/hero-banner/hero-banner-two";
import AssuranceStrip from "@/components/home/assurance-strip";
import PaymentMethods from "@/components/home/payment-methods";
import RoomShowcase from "@/components/home/room-showcase";
import CollectionsShowcase from "@/components/home/collections-showcase";
import MaterialSpotlight from "@/components/home/material-spotlight";
import Testimonials from "@/components/home/testimonials";
import HomeFaq from "@/components/home/home-faq";
import { useEffect } from "react";
import { panelOneAnimation } from "@/utils/panel-animation";
const HomeSixMain = ({ featuredProducts, categories, categoryCounts, rooms, roomCounts, collections, collectionCounts, triptychProducts, quadriptychProducts, teakPlanks, teakPlanksProducts, faqs }) => {
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

            <ShopCategory categories={categories} counts={categoryCounts}/>

            <ShopProducts products={featuredProducts} sectionId="trending" subtitle="Curated Collection" title="Trending Masterpieces" viewAllHref="/shop" viewAllLabel="View All Products"/>

            <ShopProducts products={triptychProducts} sectionId="triptych" subtitle="Three Panels, One Story" title="The Triptych Edit" viewAllHref="/category/three-panel-mosaic-art" viewAllLabel="Shop Triptych Collection" emptyMessage="The Triptych Collection is being restocked — check back soon."/>

            <RoomShowcase rooms={rooms} counts={roomCounts}/>

            <HeroBannerTwo imageSrc={"https://ik.imagekit.io/shizenta/shizenta/categories/1788521412005-y6kcr9dficq.png"} imageAlt={"Live edge wood slabs showcasing natural timber grain"} buttonLink={"/shop"} buttonText={"Explore Now"} subtitle={"From hand-selected Madhya Pradesh teak to live-edge slabs that keep their natural silhouette, every piece we craft lets real timber — not uniform manufacturing — define its character. Discover mosaic wall art, live-edge wood and handcrafted pieces built to last generations."} title={"Where Nature Meets Craftsmanship"}/>

            <ShopProducts products={quadriptychProducts} sectionId="quadriptych" subtitle="Four Panels, One Expansive Story" title="The Quadriptych Edit" viewAllHref="/category/four-panel-mosaic-art" viewAllLabel="Shop Quadriptych Collection" emptyMessage="The Quadriptych Collection is being restocked — check back soon."/>

            <CollectionsShowcase collections={collections} counts={collectionCounts}/>

            {teakPlanks && (<MaterialSpotlight sectionId="teak" image={teakPlanks.banner || teakPlanks.image} title={teakPlanks.story?.title || teakPlanks.name} subtitle="Cut-size teak planks from Madhya Pradesh — natural grain and tiger-line character, precision-prepared for your craft." href={`/category/${teakPlanks.slug}`} buttonText={`Explore ${teakPlanks.name}`} products={teakPlanksProducts}/>)}

            <Testimonials />

            <HomeFaq faqs={faqs}/>

            <AssuranceStrip />

            <PaymentMethods />

          </main>
          <FooterSix />
        </div>
      </div>
    </Wrapper>);
};
export default HomeSixMain;
