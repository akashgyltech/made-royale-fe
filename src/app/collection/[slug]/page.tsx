import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CollectionMain from "@/pages/collection/collection-main";
import { collections, getCollection, getCollectionProducts } from "@/lib/catalog";
import { buildPageMetadata } from "@/lib/seo-cms";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  return buildPageMetadata("collection", {
    title: collection ? `${collection.name} Collection — Shizenta` : "Collections — Shizenta",
    description: collection ? `${collection.name}: ${collection.tagline} Handcrafted luxury furniture by Shizenta.` : undefined,
    image: collection?.banner || collection?.image,
    path: `/collection/${slug}`,
  });
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const products = await getCollectionProducts(slug, 100);

  return <CollectionMain collection={collection} products={products} />;
}
