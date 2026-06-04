"use client";
import { gsap } from "gsap";
import { useEffect } from "react";
import useScrollSmooth from "@/hooks/use-scroll-smooth";
import { ScrollSmoother, ScrollTrigger, SplitText } from "@/plugins";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, SplitText);

// internal imports
import Wrapper from "@/layouts/wrapper";
import HeroBannerFour from "@/components/hero-banner/hero-banner-four";
import GalleryOne from "@/components/gallery/gallery-one";
import AboutThree from "@/components/about/about-three";
import BrandThree from "@/components/brand/brand-three";
import VideoThree from "@/components/video/video-three";
import ServiceFour from "@/components/service/service-four";
import ContactOne from "@/components/contact/contact-one";
import FooterFour from "@/layouts/footers/footer-four";
import { textInvert } from "@/utils/text-invert";
import { fadeAnimation, revelAnimationOne } from "@/utils/title-animation";
import { projectThreeAnimation } from "@/utils/project-anim";
import { ctaAnimation } from "@/utils/cta-anim";
import HeaderOne from "@/layouts/headers/header-one";

const HomeFourMain = () => {
  useScrollSmooth();
  useEffect(() => {
    document.body.classList.add("tp-smooth-scroll");
    return () => {
      document.body.classList.remove("tp-smooth-scroll");
    };
  }, []);

  useGSAP(() => {
    const timer = setTimeout(() => {
      fadeAnimation();
      revelAnimationOne();
      projectThreeAnimation();
      ctaAnimation();
      textInvert();
    }, 100);
    return () => clearTimeout(timer);
  });

  return (
    <Wrapper>
      <HeaderOne />
      <div id="smooth-content">
        <main>

          {/* hero area start */}
          <HeroBannerFour />
          {/* hero area end */}

          {/* gallery area start */}
          <GalleryOne />
          {/* gallery area end */}

          {/* about area start */}
          <AboutThree />
          {/* about area end */}

          {/* brand area start */}
          <BrandThree />
          {/* brand area end */}
          {/* video area start */}
          <VideoThree />
          {/* video area end */}

          {/* service area start */}
          <ServiceFour />
          {/* service area end */}

          {/* contact area start */}
          <ContactOne />
          {/* contact area end */}

        </main>

        {/* footer area */}
        <FooterFour />
        {/* footer area */}
      </div>
    </Wrapper>
  );
};

export default HomeFourMain;
