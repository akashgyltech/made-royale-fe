import { cmsApi } from "@/lib/store-api";
import { adaptLegalDoc, type LegalCmsDoc } from "@/lib/cms-content";

export async function getLegalCmsDoc(slug: string): Promise<LegalCmsDoc | null> {
  try {
    const raw = await cmsApi.getByKey(slug);
    return adaptLegalDoc(raw);
  } catch {
    return null;
  }
}
