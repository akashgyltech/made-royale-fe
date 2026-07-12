import type { Metadata } from "next";
import LegalMain from "@/pages/legal/legal-main";
import { getLegalDoc } from "@/data/legal";

const doc = getLegalDoc("terms-conditions")!;
export const metadata: Metadata = { title: `${doc.title} — Shizenta`, description: doc.intro };

export default function TermsConditionsPage() {
  return <LegalMain doc={doc} />;
}
