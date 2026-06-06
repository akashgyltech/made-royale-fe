"use client";
import { gsap } from "gsap";
import useScrollSmooth from "@/hooks/use-scroll-smooth";
import { ScrollSmoother, ScrollTrigger, SplitText } from "@/plugins";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

// internal imports
import Wrapper from "@/layouts/wrapper";
import FooterTwo from "@/layouts/footers/footer-two";
import BlogDetailsArea from "@/components/blog/details/blog-details-area";
import BlogDetailsBreadcrumb from "@/components/blog/details/blog-details-breadcrumb";
import BlogDetailsRelatedPosts from "@/components/blog/details/blog-details-related-posts";
// animation
import { charAnimation } from "@/utils/title-animation";
import { IdProps } from "@/types/custom-d-t";
import HeaderSix from "@/layouts/headers/header-six";

const BlogDetailsMain = ({ id }: IdProps) => {
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
            {/* blog details hero */}
            <BlogDetailsBreadcrumb id={id}/>
            {/* blog details hero */}

            {/* blog details area */}
            <BlogDetailsArea/>
            {/* blog details area */}

            {/* related posts */}
            <BlogDetailsRelatedPosts/>
            {/* related posts */}
          </main>

          {/* footer area */}
          <FooterTwo topCls="" />
          {/* footer area */}
        </div>
      </div>
    </Wrapper>
  );
};

export default BlogDetailsMain;
