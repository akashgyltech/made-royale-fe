import type { Metadata } from "next";
import LegalMain from "@/pages/legal/legal-main";
import { getLegalDoc } from "@/data/legal";
import { getLegalCmsDoc } from "@/lib/legal-cms";

const SLUG = "shipping-policy";
const doc = getLegalDoc(SLUG)!;

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getLegalCmsDoc(SLUG);
  return { title: `${cms?.title || doc.title} — Shizenta`, description: cms?.intro || doc.intro };
}

export default async function ShippingPolicyPage() {
  const cms = await getLegalCmsDoc(SLUG);
  return <LegalMain slug={SLUG} doc={doc} cms={cms} />;
}
