"use client";
import Wrapper from "@/layouts/wrapper";
import FooterSix from "@/layouts/footers/footer-six";
import HeaderSix from "@/layouts/headers/header-six";
import LuxBreadcrumb from "@/components/ui/lux-breadcrumb";
import CheckoutFlow from "@/components/checkout/checkout-flow";
const CheckoutMain = () => {
    return (<Wrapper>
      <HeaderSix />
      <main>
        <LuxBreadcrumb subtitle="Secure Checkout" title="Checkout" crumbs={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]} image="/images/shizenta-account-bg.webp"/>
        <CheckoutFlow />
      </main>
      <FooterSix />
    </Wrapper>);
};
export default CheckoutMain;
