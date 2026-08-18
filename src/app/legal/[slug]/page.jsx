import { notFound } from "next/navigation";
import LegalMain from "@/page-content/legal/legal-main";
import { getLegalCmsDoc } from "@/lib/legal-cms";
import { buildPageMetadata } from "@/lib/seo-cms";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const cms = await getLegalCmsDoc(slug);
    if (!cms)
        return {};
    return buildPageMetadata("legal", {
        title: `${cms.title} — Shizenta`,
        description: cms.intro,
        image: cms.bannerImage,
        path: `/legal/${slug}`,
    });
}
export default async function LegalSlugPage({ params }) {
    const { slug } = await params;
    const cms = await getLegalCmsDoc(slug);
    if (!cms)
        notFound();
    return <LegalMain slug={slug} cms={cms}/>;
}
