import React from 'react';
import HomeSixMain from '@/page-content/homes/home-6';
import { getFeaturedProducts, getCategories, getProducts, getShopCollections, getRoomCategories, getCollectionProducts, getRoomProducts } from '@/lib/catalog';
import { categories as staticCategories } from '@/data/catalog';
import { getFaqCmsList } from '@/lib/faq-cms';

export const metadata = {
    title: "Liko - Home Six Page",
};
const HomePageSix = async () => {
    const [featuredProducts, categories, shopCollections, roomCategories, categoryCounts, faqs] = await Promise.all([
        getFeaturedProducts(8),
        getCategories(),
        getShopCollections(),
        getRoomCategories(),
        Promise.all(staticCategories.map(async (c) => [c.slug, (await getProducts({ categorySlug: c.slug, limit: 1 })).total])).then(Object.fromEntries),
        getFaqCmsList(),
    ]);
    const [collectionCounts, roomCounts] = await Promise.all([
        Promise.all(shopCollections.map(async (c) => [c.slug, (await getCollectionProducts(c.slug, 100)).length])).then(Object.fromEntries),
        Promise.all(roomCategories.map(async (r) => [r.slug, (await getRoomProducts(r.slug, 100)).length])).then(Object.fromEntries),
    ]);
    return (<HomeSixMain featuredProducts={featuredProducts} categories={categories} collections={shopCollections} collectionCounts={collectionCounts} rooms={roomCategories} roomCounts={roomCounts} categoryCounts={categoryCounts} faqs={faqs}/>);
};
export default HomePageSix;
