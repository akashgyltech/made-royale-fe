import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ShopDetailsMain from "@/pages/shop/shop-details-main";
import { getProductBySlug, getProducts, getRelatedProducts } from "@/lib/catalog";
import { reviewApi } from "@/lib/store-api";
import type { BackendPage, BackendReview } from "@/types/backend";

export async function generateStaticParams() {
  try {
    const { items } = await getProducts({ limit: 100 });
    return items.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product ? `${product.name} — Shizenta` : "Shizenta", description: product?.shortDescription };
}

export default async function ShopDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  let initialReviews: BackendPage<BackendReview>;
  try {
    initialReviews = await reviewApi.getProductReviews(product.id, 1, 20);
  } catch {
    initialReviews = { results: [], page: 1, limit: 20, totalPages: 0, totalResults: 0 };
  }

  const related = await getRelatedProducts(product);

  return <ShopDetailsMain product={product} initialReviews={initialReviews.results} related={related} />;
}
