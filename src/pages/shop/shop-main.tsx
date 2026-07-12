"use client";
import Wrapper from "@/layouts/wrapper";
import FooterSix from "@/layouts/footers/footer-six";
import HeaderSix from "@/layouts/headers/header-six";
import LuxHero from "@/components/ui/lux-hero";
import ShopCatalog from "@/components/shop/shop-catalog";
import AssuranceStrip from "@/components/home/assurance-strip";
import RoomShowcase from "@/components/home/room-showcase";
import CollectionsShowcase from "@/components/home/collections-showcase";
import CtaBand from "@/components/ui/cta-band";
import { categories, formatINR, priceBounds, products } from "@/data/catalog";

const SHOP_HERO = "/assets/img/inner-shop/home/hero-bg-13.webp";

const ShopMain = () => {
  return (
    <Wrapper>
      <HeaderSix transparent />
      <main>
        <LuxHero
          banner={SHOP_HERO}
          eyebrow="The Collection"
          title="Shop Luxury Furniture"
          intro="Handcrafted sofas, beds, dining sets and more — each piece built to order by master karigars and finished to last generations."
          crumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]}
          stats={[
            { value: `${products.length}`, label: "Pieces" },
            { value: `${categories.length}`, label: "Categories" },
            { value: formatINR(priceBounds.min), label: "Starting from" },
          ]}
          actions={[
            { label: "Shop Bestsellers", href: "/shop?sort=rating" },
            { label: "Book a Consultation", href: "/contact", variant: "ghost" },
          ]}
        />
        <AssuranceStrip />
        <ShopCatalog />
        <RoomShowcase />
        <CollectionsShowcase />
        <CtaBand
          eyebrow="Bespoke Interiors"
          title="Furnishing an entire home?"
          text="Tell us about your space and our design consultants will curate a room-by-room selection tailored to your taste and budget."
          primaryLabel="Book a Free Consultation"
          primaryHref="/contact"
          secondaryLabel="Bulk & Trade Enquiry"
          secondaryHref="/bulk-enquiry"
        />
      </main>
      <FooterSix />
    </Wrapper>
  );
};

export default ShopMain;
