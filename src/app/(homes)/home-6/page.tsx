import React from 'react';
import { Metadata } from 'next';
import HomeSixMain from '@/pages/homes/home-6';
import { getFeaturedProducts, getCategories, getCollectionProducts, getRoomProducts, collections, rooms } from '@/lib/catalog';
import { getFaqCmsList } from '@/lib/faq-cms';

export const metadata: Metadata = {
  title: "Liko - Home Six Page",
};

const HomePageSix = async () => {
  const [featuredProducts, categories, collectionCounts, roomCounts, faqs] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
    Promise.all(collections.map(async (c) => [c.slug, (await getCollectionProducts(c.slug, 100)).length] as const)).then(Object.fromEntries),
    Promise.all(rooms.map(async (r) => [r.slug, (await getRoomProducts(r.slug, 100)).length] as const)).then(Object.fromEntries),
    getFaqCmsList(),
  ]);

  return (
    <HomeSixMain
      featuredProducts={featuredProducts}
      categories={categories}
      collectionCounts={collectionCounts}
      roomCounts={roomCounts}
      faqs={faqs}
    />
  );
};

export default HomePageSix;
