"use client";
import Wrapper from "@/layouts/wrapper";
import FooterSix from "@/layouts/footers/footer-six";
import HeaderSix from "@/layouts/headers/header-six";
import LuxBreadcrumb from "@/components/ui/lux-breadcrumb";
import AccountDashboard from "@/components/account/account-dashboard";

const AccountMain = () => {
  return (
    <Wrapper>
      <HeaderSix />
      <main>
        <LuxBreadcrumb subtitle="Your Shizenta Circle" title="My Account" crumbs={[{ label: "Home", href: "/" }, { label: "Account" }]} />
        <AccountDashboard />
      </main>
      <FooterSix />
    </Wrapper>
  );
};

export default AccountMain;
