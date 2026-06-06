"use client";
import { gsap } from "gsap";
import useScrollSmooth from "@/hooks/use-scroll-smooth";
import { ScrollSmoother, ScrollTrigger, SplitText } from "@/plugins";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

// internal imports
import Wrapper from "@/layouts/wrapper";
import FooterTwo from "@/layouts/footers/footer-two";
import CheckoutArea from "@/components/checkout/checkout-area";
import HeaderSix from "@/layouts/headers/header-six";

const CheckoutMain = () => {

  useScrollSmooth();

  return (
    <Wrapper>
      <HeaderSix />

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            {/* checkout area */}
            <CheckoutArea/>
            {/* checkout area */}
          </main>

          {/* footer area */}
          <FooterTwo topCls="" />
          {/* footer area */}
        </div>
      </div>
    </Wrapper>
  );
};

export default CheckoutMain;
