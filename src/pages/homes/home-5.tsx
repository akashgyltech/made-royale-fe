"use client";
import { gsap } from "gsap";
import { useEffect } from "react";
import useScrollSmooth from "@/hooks/use-scroll-smooth";
import { ScrollSmoother, ScrollTrigger, SplitText, cursorAnimation } from "@/plugins";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, SplitText);

// internal imports
import Wrapper from "@/layouts/wrapper";
import HeroBannerFive from "@/components/hero-banner/hero-banner-five";
import AboutFour from "@/components/about/about-four";
import ProjectFive from "@/components/project/project-five";
import CounterOne from "@/components/counter/counter-one";
import MissionOne from "@/components/mission/mission-one";
import ServiceFive from "@/components/service/service-five";
import BlogOne from "@/components/blog/blog-one";
// animation
import { charAnimation, fadeAnimation, revelAnimationTwo } from "@/utils/title-animation";
import { imageRevealAnimation } from "@/utils/image-reveal-anim";
import { hoverBtn } from "@/utils/hover-btn";
import { heroScrollTextAnim } from "@/utils/scroll-marque";
import { footerTwoAnimation } from "@/utils/footer-anim";
import HeaderSix from "@/layouts/headers/header-six";
import FooterSix from "@/layouts/footers/footer-six";

const HomeFiveMain = () => {
  useScrollSmooth();
  useEffect(() => {
    document.body.classList.add("tp-magic-cursor");
    return () => {
      document.body.classList.remove("tp-magic-cursor");
    }
  }, []);

  useEffect(() => {
    if(typeof window !== 'undefined' && document.querySelector('.tp-magic-cursor')) {
      cursorAnimation();
    }
  },[]);

  useGSAP(() => {
    const timer = setTimeout(() => {
      charAnimation();
      heroScrollTextAnim();
      imageRevealAnimation();
      hoverBtn();
      revelAnimationTwo();
      fadeAnimation();
      footerTwoAnimation();
    }, 100)
    return () => clearTimeout(timer);
  });

  return (
    <Wrapper>

      {/* magic cursor start */}
      <div id="magic-cursor">
        <div id="ball"></div>
      </div>
      {/* magic cursor end */}

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <HeaderSix />
            {/* hero area start */}
            <HeroBannerFive />
            {/* hero area end */}

            {/* about area start */}
            <AboutFour />
            {/* about area end */}

            {/* project area start */}
            <ProjectFive />
            {/* project area end */}

            {/* counter area start */}
            <CounterOne />
            {/* counter area end */}

            {/* mission area start */}
            <MissionOne />
            {/* mission area end */}

            {/* service area start */}
            <ServiceFive />
            {/* service area end */}

            {/* blog area start */}
            <BlogOne />
            {/* blog area end */}

          </main>
          <FooterSix />
        </div>
      </div>
    </Wrapper>
  );
};

export default HomeFiveMain;
