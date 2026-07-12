"use client";
import Wrapper from "@/layouts/wrapper";
import FooterSix from "@/layouts/footers/footer-six";
import HeaderSix from "@/layouts/headers/header-six";
import CategoryLanding from "@/components/category/category-landing";

const CategoryMain = ({ slug }: { slug: string }) => {
  return (
    <Wrapper>
      <HeaderSix transparent />
      <main>
        <CategoryLanding slug={slug} />
      </main>
      <FooterSix />
    </Wrapper>
  );
};

export default CategoryMain;
