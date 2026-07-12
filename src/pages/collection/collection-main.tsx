"use client";
import Wrapper from "@/layouts/wrapper";
import FooterSix from "@/layouts/footers/footer-six";
import HeaderSix from "@/layouts/headers/header-six";
import CollectionLanding from "@/components/collection/collection-landing";

const CollectionMain = ({ slug }: { slug: string }) => {
  return (
    <Wrapper>
      <HeaderSix transparent />
      <main>
        <CollectionLanding slug={slug} />
      </main>
      <FooterSix />
    </Wrapper>
  );
};

export default CollectionMain;
