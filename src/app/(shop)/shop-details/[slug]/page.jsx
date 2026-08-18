import React from "react";
import { notFound } from "next/navigation";
import ShopDetailsMain from "@/page-content/shop/shop-details-main";
import { getProductBySlug, getProducts, getRelatedProducts } from "@/lib/catalog";
import { reviewApi } from "@/lib/store-api";
import { buildPageMetadata } from "@/lib/seo-cms";
export async function generateStaticParams() {
    try {
        const { items } = await getProducts({ limit: 100 });
        return items.map((p) => ({ slug: p.slug }));
    }
    catch {
        return [];
    }
}
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
