"use client";
import { gsap } from "gsap";
import React from "react";
import { useGSAP } from "@gsap/react";
import useScrollSmooth from "@/hooks/use-scroll-smooth";
import { ScrollSmoother, ScrollTrigger, SplitText } from "@/plugins";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

// internal imports
import Wrapper from "@/layouts/wrapper";
import ProjectThree from "@/components/project/project-three";
import FooterTwo from "@/layouts/footers/footer-two";
// animation
import { panelTwoAnimation } from "@/utils/panel-animation";
import { charAnimation, revelAnimationTwo, titleAnimation } from "@/utils/title-animation";
import HeaderOne from "@/layouts/headers/header-one";

const PortfolioShowcaseMain = () => {
  useScrollSmooth();

  useGSAP(() => {
    const timer = setTimeout(() => {
      charAnimation();
      titleAnimation();
      panelTwoAnimation();
      revelAnimationTwo();
    }, 100);
    return () => clearTimeout(timer);
  });

  return (
    <Wrapper>

      <HeaderOne />

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            {/* portfolio area */}
            <ProjectThree />
            {/* portfolio area */}
          </main>

          {/* footer area */}
          <FooterTwo topCls="" />
          {/* footer area */}
        </div>
      </div>
    </Wrapper>
  );
};

export default PortfolioShowcaseMain;
