import React, { Suspense } from "react";
import { Metadata } from "next";
import AccountMain from "@/pages/account/account-main";

export const metadata: Metadata = { title: "My Account — Made Royale" };

const AccountPage = () => {
  return (
    <Suspense fallback={null}>
      <AccountMain />
    </Suspense>
  );
};

export default AccountPage;
