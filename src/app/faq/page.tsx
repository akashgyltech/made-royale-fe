import React from "react";
import { Metadata } from "next";
import FaqMain from "@/pages/faq/faq-main";

export const metadata: Metadata = {
  title: "Shizenta - Faq page",
};

const FaqPage = () => {
  return (
    <FaqMain/>
  );
};

export default FaqPage;
