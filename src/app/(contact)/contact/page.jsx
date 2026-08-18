import React from "react";
import ContactMain from "@/page-content/contact/contact";
import { buildPageMetadata } from "@/lib/seo-cms";
export async function generateMetadata() {
    return buildPageMetadata("contact", {
        title: "Contact — Shizenta",
        description: "Get in touch with Shizenta for enquiries, custom orders and support.",
        path: "/contact",
    });
}
const ContactPage = () => {
    return (<ContactMain />);
};
export default ContactPage;
