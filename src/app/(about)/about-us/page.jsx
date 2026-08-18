import React from "react";
import AboutUsMain from "@/page-content/about/about-us";
import { buildPageMetadata } from "@/lib/seo-cms";

export async function generateMetadata() {
    return buildPageMetadata("about", {
        title: "About Us — Shizenta",
        description: "The story, craft and people behind Shizenta's handcrafted luxury furniture.",
        path: "/about-us",
    });
}
const AboutUsPage = () => {
    return (<AboutUsMain />);
};
export default AboutUsPage;
