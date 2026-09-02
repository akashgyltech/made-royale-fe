import React from "react";
import { notFound } from "next/navigation";
import CollectionMain from "@/page-content/collection/collection-main";
import { getCategoryBySlug, getShopCollections, getCollectionProducts } from "@/lib/catalog";
import { buildPageMetadata } from "@/lib/seo-cms";

// See shop-details/[slug]/page.jsx: every backend fetch here uses cache: 'no-store',
// so pre-rendering a fixed slug list conflicts with that at runtime for anything
// added after the last deploy. Force dynamic rendering instead.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const collection = await getCategoryBySlug(slug);
    return buildPageMetadata("collection", {
        title: collection ? `${collection.name} Collection — Shizenta` : "Collections — Shizenta",
        description: collection ? `${collection.name}: ${collection.tagline} Handcrafted luxury furniture by Shizenta.` : undefined,
        image: collection?.banner || collection?.image,
        path: `/collection/${slug}`,
    });
}
export default async function CollectionPage({ params }) {
    const { slug } = await params;
    const collection = await getCategoryBySlug(slug);
    if (!collection || !collection.showInShop)
        notFound();
    const [products, others] = await Promise.all([
        getCollectionProducts(slug, 100),
        getShopCollections(),
    ]);
    return <CollectionMain collection={collection} products={products} otherCollections={others.filter((c) => c.slug !== slug)} />;
}
