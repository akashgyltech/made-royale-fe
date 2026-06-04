"use client";
import { gsap } from "gsap";
import React from "react";
import useScrollSmooth from "@/hooks/use-scroll-smooth";
import { ScrollSmoother, ScrollTrigger, SplitText } from "@/plugins";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

import Wrapper from "@/layouts/wrapper";
import FooterTwo from "@/layouts/footers/footer-two";
import TeamDetailsArea from "@/components/team/team-details-area";
import { IdProps } from "@/types/custom-d-t";
import HeaderOne from "@/layouts/headers/header-one";

const TeamDetailsMain = ({id}:IdProps) => {
  useScrollSmooth();

  return (
    <Wrapper>
      <HeaderOne />

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            {/* team details area */}
            <TeamDetailsArea id={id} />
            {/* team details area */}
          </main>

          {/* footer area */}
          <FooterTwo topCls="" />
          {/* footer area */}
        </div>
      </div>
    </Wrapper>
  );
};

export default TeamDetailsMain;
