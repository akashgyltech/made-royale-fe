"use client";
import { useEffect, useState } from 'react';
import { cmsApi } from '@/lib/store-api';
import { adaptBranding } from '@/lib/cms-content';
let brandingPromise = null;
function loadBranding() {
    if (!brandingPromise) {
        brandingPromise = cmsApi
            .getByKey('branding')
            .then((content) => adaptBranding(content))
            .catch(() => null);
    }
    return brandingPromise;
}
export function useCmsBranding() {
    const [branding, setBranding] = useState({});
    useEffect(() => {
        let cancelled = false;
        loadBranding().then((result) => {
            if (!cancelled && result)
                setBranding(result);
        });
        return () => { cancelled = true; };
    }, []);
    return branding;
}
