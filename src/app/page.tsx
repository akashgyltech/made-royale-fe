import { Metadata } from "next";
import HomePageSix from "./(homes)/home-6/page";
import { buildPageMetadata } from "@/lib/seo-cms";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("home", {
    title: "Shizenta — Nature-Inspired Luxury Furniture",
    description: "Handcrafted luxury furniture, curated collections and bespoke interiors — designed to transform your home.",
    path: "/",
  });
}

export default function Home() {
  return (
    <>
      <HomePageSix />
    </>
  );
}
