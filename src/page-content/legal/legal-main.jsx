"use client";
import Wrapper from "@/layouts/wrapper";
import HeaderSix from "@/layouts/headers/header-six";
import FooterSix from "@/layouts/footers/footer-six";
import LegalPage from "@/components/legal/legal-page";
export default function LegalMain({ slug, doc, cms }) {
    if (!doc && !cms)
        return null;
    return (<Wrapper>
      <HeaderSix />
      <main>
        <LegalPage slug={slug} doc={doc} cms={cms}/>
      </main>
      <FooterSix />
    </Wrapper>);
}
