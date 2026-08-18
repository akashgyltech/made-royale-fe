import LegalMain from "@/page-content/legal/legal-main";
import { getLegalDoc } from "@/data/legal";
import { getLegalCmsDoc } from "@/lib/legal-cms";
import { buildPageMetadata } from "@/lib/seo-cms";

const SLUG = "refund-policy";
const doc = getLegalDoc(SLUG);
export async function generateMetadata() {
    const cms = await getLegalCmsDoc(SLUG);
    return buildPageMetadata(SLUG, {
        title: `${cms?.title || doc.title} — Shizenta`,
        description: cms?.intro || doc.intro,
        image: cms?.bannerImage,
        path: `/${SLUG}`,
    });
}
export default async function RefundPolicyPage() {
    const cms = await getLegalCmsDoc(SLUG);
    return <LegalMain slug={SLUG} doc={doc} cms={cms}/>;
}
