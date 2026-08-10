import React from "react";
import { Metadata } from "next";
import FaqMain from "@/pages/faq/faq-main";
import { getFaqCmsList } from "@/lib/faq-cms";

export const metadata: Metadata = {
  title: "FAQs — Shizenta",
};

const FaqPage = async () => {
  const faqs = await getFaqCmsList();
  return (
    <FaqMain faqs={faqs} />
  );
};

export default FaqPage;
