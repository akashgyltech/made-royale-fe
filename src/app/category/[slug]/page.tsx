import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryMain from "@/pages/category/category-main";
import { categories, getCategory } from "@/data/catalog";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  return {
    title: category ? `${category.name} — Shizenta` : "Shop by Category — Shizenta",
    description: category ? `${category.name}: ${category.tagline}. Handcrafted luxury furniture by Shizenta.` : undefined,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getCategory(slug)) notFound();
  return <CategoryMain slug={slug} />;
}
