import React from "react";
import { Metadata } from "next";
import FaqMain from "@/pages/faq/faq-main";
import { getFaqCmsList } from "@/lib/faq-cms";
import { buildPageMetadata } from "@/lib/seo-cms";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("faq", {
    title: "FAQs — Shizenta",
    description: "Answers to common questions about Shizenta's furniture, orders, shipping and returns.",
    path: "/faq",
  });
}

const FaqPage = async () => {
  const faqs = await getFaqCmsList();
  return (
    <FaqMain faqs={faqs} />
  );
};

export default FaqPage;
