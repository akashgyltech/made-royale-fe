"use client";
import { useEffect, useState } from 'react';
import { cmsApi } from '@/lib/store-api';
import { adaptBranding, type BrandingContent } from '@/lib/cms-content';

let brandingPromise: Promise<BrandingContent | null> | null = null;

function loadBranding(): Promise<BrandingContent | null> {
  if (!brandingPromise) {
    brandingPromise = cmsApi
      .getByKey('branding')
      .then((content) => adaptBranding(content))
      .catch(() => null);
  }
  return brandingPromise;
}

export function useCmsBranding(): BrandingContent {
  const [branding, setBranding] = useState<BrandingContent>({});

  useEffect(() => {
    let cancelled = false;
    loadBranding().then((result) => {
      if (!cancelled && result) setBranding(result);
    });
    return () => { cancelled = true; };
  }, []);

  return branding;
}
