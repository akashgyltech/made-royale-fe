import React from "react";
import { Metadata } from "next";
import WishlistMain from "@/pages/wishlist/wishlist-main";

export const metadata: Metadata = {
  title: "My Wishlist — Shizenta",
};

const WishlistPage = () => {
  return (
    <WishlistMain/>
  );
};

export default WishlistPage;
