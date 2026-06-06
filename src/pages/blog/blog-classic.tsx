"use client";
import { ScrollSmoother, ScrollTrigger, SplitText } from "@/plugins";
import useScrollSmooth from "@/hooks/use-scroll-smooth";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

// internal imports
import Wrapper from "@/layouts/wrapper";
import FooterSix from "@/layouts/footers/footer-six";
// animation
import { charAnimation } from "@/utils/title-animation";
import BlogClassicArea from "@/components/blog/blog-classic-area";
import HeaderSix from "@/layouts/headers/header-six";

const BlogClassicMain = () => {
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
          <main>
  

            {/* blog classic area area */}
            <BlogClassicArea />
            {/* blog classic area area */}
          </main>

          {/* footer area */}
          <FooterSix />
          {/* footer area */}
        </div>
      </div>
    </Wrapper>
  );
};

export default BlogClassicMain;
