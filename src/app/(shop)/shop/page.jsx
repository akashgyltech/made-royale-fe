import React, { Suspense } from "react";
import ShopMain from "@/page-content/shop/shop-main";
import { getCategories, getCategoryBySlug, collections, getCollectionProducts, getRoomProducts, rooms } from "@/lib/catalog";
import { productApi } from "@/lib/store-api";
import { adaptProduct } from "@/lib/adapters";
import { buildPageMetadata } from "@/lib/seo-cms";

export async function generateMetadata() {
    return buildPageMetadata("shop", {
        title: "Shizenta — Shop Luxury Furniture",
        description: "Browse our full range of handcrafted luxury furniture — sofas, beds, dining and more.",
        path: "/shop",
    });
}
// Price-step filter used by the sidebar (kept in sync with src/components/shop/shop-catalog.tsx).
const PRICE_STEPS = [
    { min: 0, max: 50000 },
    { min: 50000, max: 100000 },
    { min: 100000, max: 200000 },
    { min: 200000, max: 9999999 },
];
const sortByToQuery = {
    featured: 'isFeatured:desc,createdAt:desc',
    'price-asc': 'price:asc',
    'price-desc': 'price:desc',
    rating: 'ratings.average:desc',
    newest: 'createdAt:desc',
};
// The shared getProducts() helper in @/lib/catalog doesn't support filtering by the
// collection:<slug> tag convention (see src/lib/adapters.ts), so the shop page — which
// needs category + collection filters combinable — queries productApi directly here and
// adapts the results, rather than modifying the shared lib/catalog module.
async function queryShopProducts(params) {
    const [categoryCat, subCat] = await Promise.all([
        params.category ? getCategoryBySlug(params.category) : Promise.resolve(undefined),
        params.sub ? getCategoryBySlug(params.sub) : Promise.resolve(undefined),
    ]);
    const collectionSlug = params.collection ? collections.find((c) => c.name === params.collection)?.slug : undefined;
    const page = await productApi.getProducts({
        category: categoryCat?.id,
        subcategory: subCat?.id,
        tag: collectionSlug ? `collection:${collectionSlug}` : undefined,
        search: params.search,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        sortBy: params.sort ? sortByToQuery[params.sort] : undefined,
        page: params.page,
        limit: params.limit || 24,
    });
    return { items: page.results.map(adaptProduct), total: page.totalResults, totalPages: page.totalPages, page: page.page };
}
const ShopPage = async ({ searchParams }) => {
    const sp = await searchParams;
    const category = sp.category || '';
    const sub = sp.sub || '';
    const collection = sp.collection || '';
    const sort = sp.sort || 'featured';
    const priceIdx = sp.price ?? null;
    const search = sp.q || '';
    const page = sp.page ? Number(sp.page) : 1;
    const priceStep = priceIdx !== null ? PRICE_STEPS[Number(priceIdx)] : undefined;
    const [categories, result, cheapest] = await Promise.all([
        getCategories(),
        queryShopProducts({
            category: category || undefined, sub: sub || undefined, collection: collection || undefined,
            search: search || undefined, minPrice: priceStep?.min, maxPrice: priceStep?.max, sort, page,
        }),
        queryShopProducts({ sort: 'price-asc', limit: 1 }),
    ]);
    const [collectionCounts, roomCounts] = await Promise.all([
        Promise.all(collections.map(async (c) => [c.slug, (await getCollectionProducts(c.slug, 100)).length])).then(Object.fromEntries),
        Promise.all(rooms.map(async (r) => [r.slug, (await getRoomProducts(r.slug, 100)).length])).then(Object.fromEntries),
    ]);
    const activeCategory = category ? categories.find((c) => c.slug === category) : undefined;
    const priceFrom = cheapest.items[0]?.price ?? 0;
    return (<Suspense fallback={null}>
      <ShopMain categories={categories} products={result.items} total={result.total} totalPages={result.totalPages} page={result.page} priceFrom={priceFrom} activeCategoryName={activeCategory?.name} collectionCounts={collectionCounts} roomCounts={roomCounts}/>
    </Suspense>);
};
export default ShopPage;
