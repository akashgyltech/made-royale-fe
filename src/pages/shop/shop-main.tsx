"use client";
import Wrapper from "@/layouts/wrapper";
import FooterSix from "@/layouts/footers/footer-six";
import HeaderSix from "@/layouts/headers/header-six";
import LuxBreadcrumb from "@/components/ui/lux-breadcrumb";
import ShopCatalog from "@/components/shop/shop-catalog";

const ShopMain = () => {
  return (
    <Wrapper>
      <HeaderSix />
      <main>
        <LuxBreadcrumb
          subtitle="The Collection"
          title="Shop Luxury Furniture"
          crumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]}
        />
        <ShopCatalog />
      </main>
      <FooterSix />
    </Wrapper>
  );
};

export default ShopMain;
