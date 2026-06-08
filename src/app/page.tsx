import { Metadata } from "next";
import HomePageSix from "./(homes)/home-6/page";

export const metadata: Metadata = {
  title: "Shizenta - Home Page",
};

export default function Home() {
  return (
    <>
      <HomePageSix />
    </>
  );
}
