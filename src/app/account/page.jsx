import React, { Suspense } from "react";
import AccountMain from "@/page-content/account/account-main";
export const metadata = { title: "My Account — Shizenta" };
const AccountPage = () => {
    return (<Suspense fallback={null}>
      <AccountMain />
    </Suspense>);
};
export default AccountPage;
