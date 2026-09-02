import React from "react";
import { notFound } from "next/navigation";
import ShopDetailsMain from "@/page-content/shop/shop-details-main";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { reviewApi } from "@/lib/store-api";
import { buildPageMetadata } from "@/lib/seo-cms";

// Every backend call in this app fetches with cache: 'no-store' (see src/lib/api.js),
// so this route is inherently dynamic. Pre-rendering a fixed slug list here at build
// time conflicts with that at runtime for any product added after the last deploy
// (Next.js error: "Page changed from static to dynamic at runtime") — new products
// would 404/error on the shop page until the next build. Force dynamic rendering
// instead so every product, old or new, renders on-demand from live data.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    return buildPageMetadata("product", {
        title: product ? `${product.name} — Shizenta` : "Shizenta",
        description: product?.shortDescription,
        image: product?.image,
        path: `/shop-details/${slug}`,
    });
}
export default async function ShopDetailsPage({ params }) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product)
        notFound();
    let initialReviews;
    try {
        initialReviews = await reviewApi.getProductReviews(product.id, 1, 20);
    }
    catch {
        initialReviews = { results: [], page: 1, limit: 20, totalPages: 0, totalResults: 0 };
    }
    const related = await getRelatedProducts(product);
    return <ShopDetailsMain product={product} initialReviews={initialReviews.results} related={related}/>;
}
