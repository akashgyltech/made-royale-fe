import { cmsApi } from "@/lib/store-api";
import { adaptFaqList } from "@/lib/cms-content";
export async function getFaqCmsList() {
    try {
        const raw = await cmsApi.getByKey("faq");
        return adaptFaqList(raw);
    }
    catch {
        return null;
    }
}
