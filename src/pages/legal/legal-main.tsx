"use client";
import Wrapper from "@/layouts/wrapper";
import HeaderSix from "@/layouts/headers/header-six";
import FooterSix from "@/layouts/footers/footer-six";
import LegalPage from "@/components/legal/legal-page";
import { LegalDoc } from "@/data/legal";

export default function LegalMain({ doc }: { doc: LegalDoc }) {
  if (!doc) return null;
  return (
    <Wrapper>
      <HeaderSix />
      <main>
        <LegalPage doc={doc} />
      </main>
      <FooterSix />
    </Wrapper>
  );
}
