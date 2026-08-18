// Real, async replacement for @/data/catalog's query functions — backed by the
// made-royale-be API instead of the static dummy dataset. Page-level components
// (app/**/page.tsx) should fetch through this module; @/data/catalog now only
// supplies TypeScript types (Product, Category, ...) plus editorial copy for
// collections/rooms (name/tagline/story/banner) that has no CMS backing yet.
import { productApi } from './store-api';
import { adaptProduct, adaptCategory, deriveCollection, deriveRoomSlugs } from './adapters';
import { collections, rooms, getCollection, getRoom } from '@/data/catalog';
const sortByToQuery = {
    featured: 'isFeatured:desc,createdAt:desc',
    'price-asc': 'price:asc',
    'price-desc': 'price:desc',
    rating: 'ratings.average:desc',
    newest: 'createdAt:desc',
};
export async function getCategories() {
    const cats = await productApi.getCategories(null);
    return cats.map(adaptCategory);
}
export async function getCategoryBySlug(slug) {
    try {
        const cat = await productApi.getCategoryBySlug(slug);
        return adaptCategory(cat);
    }
    catch {
        return undefined;
    }
}
export async function getProducts(filter = {}) {
    let categoryId;
    let subcategoryId;
    if (filter.categorySlug) {
        const cat = await getCategoryBySlug(filter.categorySlug);
        categoryId = cat?.id;
    }
    if (filter.subcategorySlug) {
        const sub = await getCategoryBySlug(filter.subcategorySlug);
        subcategoryId = sub?.id;
    }
    const page = await productApi.getProducts({
        category: categoryId,
        subcategory: subcategoryId,
        search: filter.search,
        minPrice: filter.minPrice,
        maxPrice: filter.maxPrice,
        sortBy: filter.sort ? sortByToQuery[filter.sort] : undefined,
        page: filter.page,
        limit: filter.limit || 24,
    });
    return { items: page.results.map(adaptProduct), total: page.totalResults, totalPages: page.totalPages, page: page.page };
}
export async function getProductBySlug(slug) {
    try {
        const bp = await productApi.getProductBySlug(slug);
        return adaptProduct(bp);
    }
    catch {
        return undefined;
    }
}
export async function getFeaturedProducts(limit = 8) {
    const page = await productApi.getProducts({ isFeatured: true, limit });
    return page.results.map(adaptProduct);
}
// Other active products sharing this product's category — a real, computed signal
// (not a hand-authored relatedIds list, which the backend has no field for).
export async function getRelatedProducts(product, limit = 4) {
    if (!product.categorySlug)
        return [];
    const { items } = await getProducts({ categorySlug: product.categorySlug, limit: limit + 1 });
    return items.filter((p) => p.id !== product.id).slice(0, limit);
}
// Products tagged `collection:<slug>` / `room:<slug>` in the admin panel (see
// src/lib/adapters.ts for the convention). Empty until an admin actually tags
// products that way — intentionally no fallback/fake content.
export async function getCollectionProducts(collectionSlug, limit = 24) {
    const page = await productApi.getProducts({ tag: `collection:${collectionSlug}`, limit });
    return page.results.map(adaptProduct);
}
export async function getRoomProducts(roomSlug, limit = 24) {
    const page = await productApi.getProducts({ tag: `room:${roomSlug}`, limit });
    return page.results.map(adaptProduct);
}
export function productCollectionSlug(product) {
    return product.collection ? collections.find((c) => c.name === product.collection)?.slug : undefined;
}
export function productRoomSlugs(product) {
    return deriveRoomSlugs(product.tags);
}
// Editorial metadata for collections/rooms (name/tagline/story/banner) has no CMS
// backing in the backend yet, so it's still sourced from the static demo module —
// only the product listings within each page are real.
export { collections, rooms, getCollection, getRoom, deriveCollection };
