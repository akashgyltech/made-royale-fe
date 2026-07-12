import React from "react";
import type { Metadata } from "next";
import ShopDetailsMain from "@/pages/shop/shop-details-main";
import { products, getProduct } from "@/data/catalog";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return { title: product ? `${product.name} — Shizenta` : "Shizenta", description: product?.shortDescription };
}

export default async function ShopDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ShopDetailsMain slug={slug} />;
}
