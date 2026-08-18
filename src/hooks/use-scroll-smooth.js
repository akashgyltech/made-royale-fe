"use client";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";
import { useState } from "react";
import { gsap } from "gsap";
export default function useScrollSmooth() {
    const [isScrollSmooth] = useState(true);
    useGSAP(() => {
        // Register plugins properly
        gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
        const smoothWrapper = document.getElementById("smooth-wrapper");
        const smoothContent = document.getElementById("smooth-content");
        if (!(smoothWrapper && smoothContent && isScrollSmooth))
            return;
        gsap.config({
            nullTargetWarn: false,
        });
        // create the smooth scroller FIRST
        const smoother = ScrollSmoother.create({
            wrapper: smoothWrapper,
            content: smoothContent,
            smooth: 2,
            effects: true,
            smoothTouch: 0.1,
            normalizeScroll: false,
            ignoreMobileResize: true,
        });
        // example ScrollTrigger (you can remove if not needed)
        const shapeTrigger = ScrollTrigger.create({
            trigger: ".shape",
            pin: true,
            start: "center center",
            end: "+=300",
            markers: false,
        });
        // Without this, navigating to another route leaves the smoother running against
        // DOM nodes that React is about to unmount — its inertia keeps animating and the
        // next page visibly scrolls from the old (e.g. bottom) position back to top.
        return () => {
            shapeTrigger.kill();
            smoother.kill();
        };
    }, [isScrollSmooth]);
}
