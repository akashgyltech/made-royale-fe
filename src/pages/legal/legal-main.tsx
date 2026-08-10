"use client";
import Wrapper from "@/layouts/wrapper";
import HeaderSix from "@/layouts/headers/header-six";
import FooterSix from "@/layouts/footers/footer-six";
import LegalPage from "@/components/legal/legal-page";
import { LegalDoc } from "@/data/legal";
import type { LegalCmsDoc } from "@/lib/cms-content";

type Props = { slug: string; doc?: LegalDoc; cms?: LegalCmsDoc | null };

export default function LegalMain({ slug, doc, cms }: Props) {
  if (!doc && !cms) return null;
  return (
    <Wrapper>
      <HeaderSix />
      <main>
        <LegalPage slug={slug} doc={doc} cms={cms} />
      </main>
      <FooterSix />
    </Wrapper>
  );
}
