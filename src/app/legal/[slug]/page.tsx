import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalMain from "@/pages/legal/legal-main";
import { getLegalCmsDoc } from "@/lib/legal-cms";
import { buildPageMetadata } from "@/lib/seo-cms";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cms = await getLegalCmsDoc(slug);
  if (!cms) return {};
  return buildPageMetadata("legal", {
    title: `${cms.title} — Shizenta`,
    description: cms.intro,
    image: cms.bannerImage,
    path: `/legal/${slug}`,
  });
}

export default async function LegalSlugPage({ params }: Props) {
  const { slug } = await params;
  const cms = await getLegalCmsDoc(slug);
  if (!cms) notFound();
  return <LegalMain slug={slug} cms={cms} />;
}
