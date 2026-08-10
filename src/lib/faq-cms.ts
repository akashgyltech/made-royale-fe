import { cmsApi } from "@/lib/store-api";
import { adaptFaqList, type FaqItem } from "@/lib/cms-content";

export async function getFaqCmsList(): Promise<FaqItem[] | null> {
  try {
    const raw = await cmsApi.getByKey("faq");
    return adaptFaqList(raw);
  } catch {
    return null;
  }
}
