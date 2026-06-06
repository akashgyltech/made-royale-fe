'use client';
import { gsap } from "gsap";
import { useEffect } from "react";
import useScrollSmooth from '@/hooks/use-scroll-smooth';
import { ScrollSmoother, ScrollTrigger, SplitText } from '@/plugins';
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

// internal imports
import Wrapper from "@/layouts/wrapper";
import HeroBannerTwo from "@/components/hero-banner/hero-banner-two";
import AboutOne from "@/components/about/about-one";
import VideoTwo from "@/components/video/video-two";
import ServiceTwo from "@/components/service/service-two";
import ProjectTwo from "@/components/project/project-two";
import AwardTwo from "@/components/award/award-two";
import LineText from "@/components/line-text/line-text";
// animation
import { bounceAnimation, heroBgAnimation, heroTitleAnim } from "@/utils/title-animation";
import { videoAnimTwo } from "@/utils/video-anim";
import { panelOneAnimation } from "@/utils/panel-animation";
import { awardAnimOne } from "@/utils/award-anim";
import { instagramAnim } from "@/utils/instagram-anim";
import { hoverBtn } from "@/utils/hover-btn";
import { aboutAnim } from "@/utils/about-anim";
import HeaderSix from "@/layouts/headers/header-six";
import FooterSix from "@/layouts/footers/footer-six";

const HomeTwoMain = () => {
  useScrollSmooth();
  useEffect(() => {
    document.body.classList.add("tp-smooth-scroll");
    return () => {
      document.body.classList.remove("tp-smooth-scroll");
    }
  }, []);

  useGSAP(() => {
    const timer = setTimeout(() => {
      // hero animation
      heroTitleAnim();
      heroBgAnimation();
      // about animation
      aboutAnim()
      // bounce animation
      bounceAnimation();
      // video anim
      videoAnimTwo();
      // panel animation
      panelOneAnimation();
      // award animation
      awardAnimOne();
      // instagram animation
      instagramAnim();
      hoverBtn();
    }, 100)
    return () => clearTimeout(timer);
  });


  return (
    <Wrapper>
     <HeaderSix />

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            {/* hero area start */}
            <HeroBannerTwo />
            {/* hero area end */}

            {/* about area start */}
            <AboutOne />
            {/* about area end */}

            {/* video area start */}
            <VideoTwo />
            {/* video area end */}

            {/* service area start */}
            <ServiceTwo />
            {/* service area end */}

            {/* project area */}
            <ProjectTwo />
            {/* project area */}

            {/* award area */}
            <AwardTwo />
            {/* award area */}

            {/* line text area */}
            <LineText />
            {/* line text area */}
          </main>
          <FooterSix />

        </div>
      </div>
    </Wrapper>
  );
};

export default HomeTwoMain;
