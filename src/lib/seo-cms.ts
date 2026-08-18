// Builds Next.js `Metadata` (title, description, Open Graph, Twitter Card) for a page from
// admin-authored CMS content, layering three sources cheapest-to-override-first:
//   1. the page's own `seo-<pageKey>` CMS doc (made-royale-admin's SEO tab)
//   2. the sitewide `seo-default` CMS doc (fallback title/description/siteName/images)
//   3. the hardcoded fallback the calling page.tsx passes in (e.g. a product's own name/image)
import type { Metadata } from "next";
import { cmsApi } from "@/lib/store-api";
import { adaptSeoContent, type SeoContent, type TwitterCardType } from "@/lib/cms-content";

const SITE_NAME_FALLBACK = "Shizenta";

// One `/store/cms/type/seo` call returns every page's SEO doc at once. Next.js's fetch
// memoization (same URL + options, same request render) means calling this from several
// places in one page render — e.g. buildPageMetadata plus something else — costs one
// network round trip, not several.
async function getSeoMap(): Promise<Record<string, SeoContent>> {
  try {
    const items = await cmsApi.getByType("seo");
    const map: Record<string, SeoContent> = {};
    for (const item of items) {
      if (item.isActive === false) continue;
      const adapted = adaptSeoContent(item.content);
      if (adapted) map[item.key] = adapted;
    }
    return map;
  } catch {
    return {};
  }
}

export interface SeoFallback {
  /** Used when neither the page's own CMS doc nor seo-default set a title. */
  title: string;
  description?: string;
  /** e.g. a product/category/collection's own image — preferred over seo-default's OG image. */
  image?: string;
  /** Canonical path for this page, e.g. `/shop` or `/collection/maharaja`. */
  path?: string;
}

/**
 * Fetch admin-authored SEO for `pageKey` (looked up as CMS doc `seo-<pageKey>`), merge with
 * the `seo-default` doc and `fallback`, and return a ready-to-export Next.js `Metadata`
 * object with title, description, Open Graph, and Twitter Card all populated.
 */
export async function buildPageMetadata(pageKey: string, fallback: SeoFallback): Promise<Metadata> {
  const map = await getSeoMap();
  const page = map[`seo-${pageKey}`];
  const def = map["seo-default"];

  const title = page?.title || def?.title || fallback.title;
  const description = page?.description || def?.description || fallback.description;
  const siteName = def?.siteName || SITE_NAME_FALLBACK;

  const ogTitle = page?.og?.title || page?.title || fallback.title;
  const ogDescription = page?.og?.description || description;
  const ogImage = page?.og?.image || fallback.image || def?.og?.image;

  const twitterCard: TwitterCardType = page?.twitter?.card || def?.twitter?.card || (ogImage ? "summary_large_image" : "summary");
  const twitterTitle = page?.twitter?.title || ogTitle;
  const twitterDescription = page?.twitter?.description || ogDescription;
  const twitterImage = page?.twitter?.image || ogImage;

  return {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      siteName,
      type: "website",
      ...(fallback.path ? { url: fallback.path } : {}),
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: twitterCard,
      title: twitterTitle,
      description: twitterDescription,
      ...(twitterImage ? { images: [twitterImage] } : {}),
    },
  };
}
