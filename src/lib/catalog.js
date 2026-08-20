// Real, async replacement for @/data/catalog's query functions — backed by the
// made-royale-be API instead of the static dummy dataset. Page-level components
// (app/**/page.tsx) should fetch through this module.
import { productApi } from './store-api';
import { adaptProduct, adaptCategory } from './adapters';
const sortByToQuery = {
    featured: 'isFeatured:desc,createdAt:desc',
    'price-asc': 'price:asc',
    'price-desc': 'price:desc',
    rating: 'ratings.average:desc',
    newest: 'createdAt:desc',
};
export async function getCategories() {
    try {
        const cats = await productApi.getCategories(null);
        return cats.map(adaptCategory);
    }
    catch {
        return [];
    }
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
export async function getShopCollections() {
    try {
        const cats = await productApi.getShopCategories();
        return cats.map(adaptCategory);
    }
    catch {
        return [];
    }
}
export async function getRoomCategories() {
    try {
        const cats = await productApi.getRoomCategories();
        return cats.map(adaptCategory);
    }
    catch {
        return [];
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
    try {
        const page = await productApi.getProducts({ isFeatured: true, limit });
        return page.results.map(adaptProduct);
    }
    catch {
        return [];
    }
}
// Other active products sharing this product's category — a real, computed signal
// (not a hand-authored relatedIds list, which the backend has no field for).
export async function getRelatedProducts(product, limit = 4) {
    if (!product.categorySlug)
        return [];
    const { items } = await getProducts({ categorySlug: product.categorySlug, limit: limit + 1 });
    return items.filter((p) => p.id !== product.id).slice(0, limit);
}
export async function getCollectionProducts(collectionSlug, limit = 100) {
    return getProducts({ categorySlug: collectionSlug, limit }).then((r) => r.items);
}
export async function getRoomProducts(roomSlug, limit = 100) {
    return getProducts({ categorySlug: roomSlug, limit }).then((r) => r.items);
}
