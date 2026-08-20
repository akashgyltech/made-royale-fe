import React from "react";
import { notFound } from "next/navigation";
import CategoryMain from "@/page-content/category/category-main";
import { getCategories, getCategoryBySlug, getProducts } from "@/lib/catalog";
import { buildPageMetadata } from "@/lib/seo-cms";

export async function generateStaticParams() {
    try {
        const categories = await getCategories();
        return categories.map((c) => ({ slug: c.slug }));
    }
    catch {
        return [];
    }
}
export async function generateMetadata({ params }) {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);
    if (!category)
        return buildPageMetadata("category", { title: "Shop by Category — Shizenta" });
    return buildPageMetadata("category", {
        title: category.seo?.metaTitle || `${category.name} — Shizenta`,
        description: category.seo?.metaDescription || `${category.name}: ${category.tagline}. Handcrafted luxury furniture by Shizenta.`,
        image: category.banner || category.image,
        path: `/category/${slug}`,
    });
}
export default async function CategoryPage({ params }) {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);
    if (!category)
        notFound();
    const [featured, cheapest, subCounts, allCategories] = await Promise.all([
        getProducts({ categorySlug: slug, sort: 'featured', limit: 8 }),
        getProducts({ categorySlug: slug, sort: 'price-asc', limit: 1 }),
        Promise.all(category.subcategories.map(async (s) => [s.slug, (await getProducts({ subcategorySlug: s.slug, limit: 1 })).total])).then(Object.fromEntries),
        getCategories(),
    ]);
    const otherCategories = allCategories.filter((c) => c.slug !== slug).slice(0, 6);
    const otherCategoryCounts = await Promise.all(otherCategories.map(async (c) => [c.slug, (await getProducts({ categorySlug: c.slug, limit: 1 })).total])).then(Object.fromEntries);
    return (<CategoryMain category={category} featuredProducts={featured.items} totalInCategory={featured.total} priceFrom={cheapest.items[0]?.price ?? 0} subCategoryCounts={subCounts} otherCategories={otherCategories} otherCategoryCounts={otherCategoryCounts}/>);
}
