"use client";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import useScrollSmooth from "@/hooks/use-scroll-smooth";
import { ScrollSmoother, ScrollTrigger, SplitText } from "@/plugins";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

// internal imports
import Wrapper from "@/layouts/wrapper";
import { ServiceItems } from "@/components/service/service-five";
import ServiceSix from "@/components/service/service-six";
import { Leaf } from "@/components/svg";
import FooterTwo from "@/layouts/footers/footer-two";
// animation
import { charAnimation, fadeAnimation } from "@/utils/title-animation";
import { servicePanel } from "@/utils/panel-animation";
import HeaderSix from "@/layouts/headers/header-six";

const ServiceMain = () => {
  useScrollSmooth();

  useGSAP(() => {
    const timer = setTimeout(() => {
      charAnimation();
      fadeAnimation();
      servicePanel();
    }, 100);
    return () => clearTimeout(timer);
  });

  return (
    <Wrapper>
      <HeaderSix />

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>

            {/* service area */}
            <div className="tp-service-5-area sv-service-style pb-70 pt-150 text-center">
              <div className="container container-1530">
                <div className="row">
                  <div className="col-xl-12">
                    <div className="tp-service-5-title-box mb-90">
                      <span className="ab-inner-subtitle mb-20">
                        <Leaf />
                        Services
                      </span>
                      <h4 className="tp-service-5-title">
                        We strongly believe that only design reinforced by{" "}
                        <br />
                        strategy can provide real results.
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="tp-service-5-wrap">
                  <ServiceItems />
                </div>
              </div>
            </div>
            {/* service area */}

            {/* service area */}
            <ServiceSix />
            {/* service area */}

          </main>

          {/* footer area */}
          <FooterTwo topCls="" />
          {/* footer area */}
        </div>
      </div>
    </Wrapper>
  );
};

export default ServiceMain;
