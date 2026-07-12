import React, { Suspense } from "react";
import { Metadata } from "next";
import ShopMain from "@/pages/shop/shop-main";

export const metadata: Metadata = {
  title: "Made Royale — Shop Luxury Furniture",
};

const ShopPage = () => {
  return (
    <Suspense fallback={null}>
      <ShopMain />
    </Suspense>
  );
};

export default ShopPage;
