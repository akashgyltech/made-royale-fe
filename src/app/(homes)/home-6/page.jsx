import React from 'react';
import HomeSixMain from '@/page-content/homes/home-6';
import { getFeaturedProducts, getCategories, getCollectionProducts, getRoomProducts, collections, rooms } from '@/lib/catalog';
import { getFaqCmsList } from '@/lib/faq-cms';
export const metadata = {
    title: "Liko - Home Six Page",
};
const HomePageSix = async () => {
    const [featuredProducts, categories, collectionCounts, roomCounts, faqs] = await Promise.all([
        getFeaturedProducts(8),
        getCategories(),
        Promise.all(collections.map(async (c) => [c.slug, (await getCollectionProducts(c.slug, 100)).length])).then(Object.fromEntries),
        Promise.all(rooms.map(async (r) => [r.slug, (await getRoomProducts(r.slug, 100)).length])).then(Object.fromEntries),
        getFaqCmsList(),
    ]);
    return (<HomeSixMain featuredProducts={featuredProducts} categories={categories} collectionCounts={collectionCounts} roomCounts={roomCounts} faqs={faqs}/>);
};
export default HomePageSix;
