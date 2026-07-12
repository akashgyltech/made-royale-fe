import type { Metadata } from "next";
import LegalMain from "@/pages/legal/legal-main";
import { getLegalDoc } from "@/data/legal";

const doc = getLegalDoc("refund-policy")!;
export const metadata: Metadata = { title: `${doc.title} — Shizenta`, description: doc.intro };

export default function RefundPolicyPage() {
  return <LegalMain doc={doc} />;
}
