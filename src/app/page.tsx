import { Metadata } from "next";
import HomePageSix from "./(homes)/home-6/page";

export const metadata: Metadata = {
  title: "Shizenta — Nature-Inspired Luxury Furniture",
  description: "Handcrafted luxury furniture, curated collections and bespoke interiors — designed to transform your home.",
};

export default function Home() {
  return (
    <>
      <HomePageSix />
    </>
  );
}
