import LegalMain from "@/page-content/legal/legal-main";
import { getLegalDoc } from "@/data/legal";
import { getLegalCmsDoc } from "@/lib/legal-cms";

const SLUG = "privacy-policy";
const doc = getLegalDoc(SLUG);
export async function generateMetadata() {
    const cms = await getLegalCmsDoc(SLUG);
    return { title: `${cms?.title || doc.title} — Shizenta`, description: cms?.intro || doc.intro };
}
export default async function PrivacyPolicyPage() {
    const cms = await getLegalCmsDoc(SLUG);
    return <LegalMain slug={SLUG} doc={doc} cms={cms}/>;
}
