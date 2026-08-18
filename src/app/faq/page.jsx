import React from "react";
import FaqMain from "@/page-content/faq/faq-main";
import { getFaqCmsList } from "@/lib/faq-cms";
import { buildPageMetadata } from "@/lib/seo-cms";
export async function generateMetadata() {
    return buildPageMetadata("faq", {
        title: "FAQs — Shizenta",
        description: "Answers to common questions about Shizenta's furniture, orders, shipping and returns.",
        path: "/faq",
    });
}
const FaqPage = async () => {
    const faqs = await getFaqCmsList();
    return (<FaqMain faqs={faqs}/>);
};
export default FaqPage;
