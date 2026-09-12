import React from 'react';
import HomeSixMain from '@/page-content/homes/home-6';
import { getFeaturedProducts, getCategories, getAllCategories, getRoomCategories, getCategoryBySlug, getProducts, getRoomProducts } from '@/lib/catalog';
import { getFaqCmsList } from '@/lib/faq-cms';

export const metadata = {
    title: "Shizenta — Nature-Inspired Luxury Furniture",
};

const TOP_CATEGORY_SLUGS = ['wall-stories', 'live-edge-wood-collection', 'wood-slab-collection', 'vijaysar-mositure-heartwood-glass'];

const HomePageSix = async () => {
    const [featuredProducts, allTopCategories, allCategories, rooms, triptych, quadriptych, teakPlanks, teakPlanksProducts, faqs] = await Promise.all([
        getFeaturedProducts(8),
        getCategories(),
        getAllCategories(),
        getRoomCategories(),
        getProducts({ categorySlug: 'three-panel-mosaic-art', limit: 12 }),
        getProducts({ categorySlug: 'four-panel-mosaic-art', limit: 12 }),
        getCategoryBySlug('teak-wood-planks'),
        getProducts({ categorySlug: 'teak-wood-planks', limit: 8 }),
        getFaqCmsList(),
    ]);

    // Top of the page: a handful of hero categories, not the whole catalog at once.
    const heroCategories = allTopCategories.filter((c) => TOP_CATEGORY_SLUGS.includes(c.slug));
    // Everything else (Bar Cabinet, and every subcategory except the two with a dedicated
    // product showcase below) surfaces further down, in its own "Explore Our Collections" section.
    const remainingTop = allTopCategories.filter((c) => !TOP_CATEGORY_SLUGS.includes(c.slug));
    const subcategories = allCategories.filter((c) => !allTopCategories.some((tc) => tc.slug === c.slug) && c.slug !== 'three-panel-mosaic-art' && c.slug !== 'four-panel-mosaic-art');
    const moreCollections = [...remainingTop, ...subcategories].map((c) => ({ ...c, href: `/category/${c.slug}` }));

    const [heroCounts, moreCounts, roomCounts] = await Promise.all([
        Promise.all(heroCategories.map(async (c) => [c.slug, (await getProducts({ categorySlug: c.slug, limit: 1 })).total])).then(Object.fromEntries),
        Promise.all(moreCollections.map(async (c) => [c.slug, (await getProducts({ categorySlug: c.slug, limit: 1 })).total])).then(Object.fromEntries),
        Promise.all(rooms.map(async (r) => [r.slug, (await getRoomProducts(r.slug, 100)).length])).then(Object.fromEntries),
    ]);

    return (<HomeSixMain
      featuredProducts={featuredProducts}
      categories={heroCategories}
      categoryCounts={heroCounts}
      rooms={rooms}
      roomCounts={roomCounts}
      collections={moreCollections}
      collectionCounts={moreCounts}
      triptychProducts={triptych.items}
      quadriptychProducts={quadriptych.items}
      teakPlanks={teakPlanks}
      teakPlanksProducts={teakPlanksProducts.items}
      faqs={faqs}/>);
};
export default HomePageSix;
