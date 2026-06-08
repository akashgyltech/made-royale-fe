"use client";
import { gsap } from "gsap";
import useScrollSmooth from "@/hooks/use-scroll-smooth";
import { ScrollSmoother, ScrollTrigger, SplitText } from "@/plugins";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

// internal imports
import Wrapper from "@/layouts/wrapper";
import ContactTwo from "@/components/contact/contact-two";
import ContactLocation from "@/components/contact/contact-location";
import FooterSix from "@/layouts/footers/footer-six";
// animation
import { charAnimation } from "@/utils/title-animation";
import HeaderSix from "@/layouts/headers/header-six";

const ContactMain = () => {
  useScrollSmooth();

  useGSAP(() => {
    const timer = setTimeout(() => {
      charAnimation();
    }, 100);
    return () => clearTimeout(timer);
  });

  return (
    <Wrapper>
      <HeaderSix />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div
            className="inner-bg"
            style={{
              backgroundImage:
                "url(/assets/img/home-01/team/team-details-bg.png)",
            }}
          >
            <main>
              {/* hero area start */}
              <div className="tm-hero-area tm-hero-ptb p-relative">
                <div className="container">
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="tm-hero-content">
                        <span className="tm-hero-subtitle">Shizenta Studio</span>
                        <h4 className="tm-hero-title-big tp-char-animation">
                          Get in touch
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* hero area end */}

              {/* contact area */}
              <ContactTwo/>
              {/* contact area */}

              {/* contact location */}
              <ContactLocation/>
              {/* contact location */}
            </main>
            <FooterSix />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default ContactMain;
