import { cmsApi } from "@/lib/store-api";
import { adaptLegalDoc } from "@/lib/cms-content";
export async function getLegalCmsDoc(slug) {
    try {
        const raw = await cmsApi.getByKey(slug);
        return adaptLegalDoc(raw);
    }
    catch {
        return null;
    }
}
