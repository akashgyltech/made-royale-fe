"use client";
import { gsap } from "gsap";
import { useEffect } from "react";
import { useGSAP } from "@gsap/react";
import useScrollSmooth from "@/hooks/use-scroll-smooth";
import { ScrollSmoother, ScrollTrigger, SplitText, cursorAnimation } from "@/plugins";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

// internal imports
import Wrapper from "@/layouts/wrapper";
import PortfolioGridFourColArea from "@/components/portfolio/portfolio-grid-4-col-area";
import FooterSix from "@/layouts/footers/footer-six";
// animation
import { hoverBtn } from "@/utils/hover-btn";
import { charAnimation, fadeAnimation, titleAnimation } from "@/utils/title-animation";
import { imageRevealAnimation } from "@/utils/image-reveal-anim";
import HeaderSix from "@/layouts/headers/header-six";

const PortfolioGridColFourMain = () => {
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
      titleAnimation();
      hoverBtn();
      imageRevealAnimation();
      fadeAnimation();
    }, 100);
    return () => clearTimeout(timer);
  });

  return (
    <Wrapper>

      {/* magic cursor start */}
      <div id="magic-cursor">
        <div id="ball"></div>
      </div>
      {/* magic cursor end */}

      <HeaderSix />

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            {/* portfolio hero */}
            <div className="tm-hero-area tm-hero-ptb">
              <div className="container">
                <div className="row">
                  <div className="col-xl-12">
                    <div className="tm-hero-content">
                      <span className="tm-hero-subtitle">Shizenta Studio</span>
                      <h4 className="tm-hero-title fs-220 tp-char-animation">
                        Classic Grid
                      </h4>
                    </div>
                    <div className="tm-hero-text tp_title_anim">
                      <p>
                        We’re a diverse team that works as fancies attention to
                        details, enjoys beers on Friday nights and aspires to
                        design the dent in the universe.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* portfolio hero */}

            {/* portfolio area */}
            <PortfolioGridFourColArea/>
            {/* portfolio area */}
          </main>

          {/* footer area */}
          <FooterSix />
          {/* footer area */}
        </div>
      </div>
    </Wrapper>
  );
};

export default PortfolioGridColFourMain;
