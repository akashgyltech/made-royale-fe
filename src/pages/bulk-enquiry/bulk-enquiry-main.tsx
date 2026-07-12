"use client";
import Wrapper from "@/layouts/wrapper";
import HeaderSix from "@/layouts/headers/header-six";
import FooterSix from "@/layouts/footers/footer-six";
import LuxBreadcrumb from "@/components/ui/lux-breadcrumb";
import BulkEnquiry from "@/components/bulk-enquiry/bulk-enquiry";
import CtaBand from "@/components/ui/cta-band";

const BulkEnquiryMain = () => {
  return (
    <Wrapper>
      <HeaderSix />
      <main>
        <LuxBreadcrumb
          subtitle="Trade & Bulk Orders"
          title="Bulk & Trade Enquiry"
          crumbs={[{ label: "Home", href: "/" }, { label: "Bulk Enquiry" }]}
        />
        <BulkEnquiry />
        <CtaBand
          eyebrow="Design Partnership"
          title="Architects, designers & developers"
          text="Join the Shizenta trade programme for exclusive pricing, priority support and bespoke manufacturing for your projects."
          primaryLabel="Talk to Our Trade Team"
          primaryHref="/contact"
          secondaryLabel="Browse the Collection"
          secondaryHref="/shop"
        />
      </main>
      <FooterSix />
    </Wrapper>
  );
};

export default BulkEnquiryMain;
