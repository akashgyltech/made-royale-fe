"use client";
import { gsap } from "gsap";
import React from "react";
import { useGSAP } from "@gsap/react";
import useScrollSmooth from "@/hooks/use-scroll-smooth";
import { ScrollSmoother, ScrollTrigger, SplitText } from "@/plugins";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

// internal imports
import Wrapper from "@/layouts/wrapper";
import PortfolioDetailsShowcaseTwoArea from "@/components/portfolio/details/portfolio-details-showcase-2-area";
import FooterTwo from "@/layouts/footers/footer-two";
// animation
import { charAnimation, titleAnimation } from "@/utils/title-animation";
import { movingImageSlider } from "@/utils/scroll-marque";
import HeaderOne from "@/layouts/headers/header-one";

const PortfolioDetailsShowcaseTwoMain = () => {
  useScrollSmooth();

  useGSAP(() => {
    const timer = setTimeout(() => {
      charAnimation();
      titleAnimation();
      movingImageSlider();
    }, 100);
    return () => clearTimeout(timer);
  });

  return (
    <Wrapper>
      <HeaderOne />

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            {/* portfolio details area */}
            <PortfolioDetailsShowcaseTwoArea />
            {/* portfolio details area */}
          </main>

          {/* footer area */}
          <FooterTwo topCls="" />
          {/* footer area */}
        </div>
      </div>
    </Wrapper>
  );
};

export default PortfolioDetailsShowcaseTwoMain;
