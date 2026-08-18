import React from "react";
import { Metadata } from "next";
import ContactMain from "@/pages/contact/contact";
import { buildPageMetadata } from "@/lib/seo-cms";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("contact", {
    title: "Contact — Shizenta",
    description: "Get in touch with Shizenta for enquiries, custom orders and support.",
    path: "/contact",
  });
}

const ContactPage = () => {
  return (
    <ContactMain/>
  );
};

export default ContactPage;
