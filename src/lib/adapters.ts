// Maps real made-royale-be API responses onto the storefront's existing Product/
// Category/SubCategory/Collection/Room types (defined in @/data/catalog, which is
// otherwise now legacy demo data — see src/lib/catalog.ts for the real replacement).
//
// The backend has no concept of "collection" or "room" (only a Category tree +
// free-form tags). Rather than fabricate that content, both are derived from a real,
// admin-editable field — Product.tags — using the convention `collection:<slug>` /
// `room:<slug>`. Until products are tagged that way in the admin panel, collection/
// room pages simply show no products (a true empty state), which is correct: there is
// no fake data standing in for it.
import type { BackendProduct, BackendCategory, BackendCustomization } from '@/types/backend';
import type { Product, Category, SubCategory, CollectionName, ProductColor } from '@/data/catalog';

const COLLECTION_SLUGS: Record<string, CollectionName> = {
  maharaja: 'Maharaja',
  vintage: 'Vintage',
  'contemporary-royale': 'Contemporary Royale',
  heritage: 'Heritage',
};

const TAG_PREFIX = { collection: 'collection:', room: 'room:' } as const;

export function deriveCollection(tags: string[]): CollectionName | undefined {
  const tag = tags.find((t) => t.startsWith(TAG_PREFIX.collection));
  if (!tag) return undefined;
  return COLLECTION_SLUGS[tag.slice(TAG_PREFIX.collection.length)];
}

export function deriveRoomSlugs(tags: string[]): string[] {
  return tags.filter((t) => t.startsWith(TAG_PREFIX.room)).map((t) => t.slice(TAG_PREFIX.room.length));
}

function publicTags(tags: string[]): string[] {
  return tags.filter((t) => !t.startsWith(TAG_PREFIX.collection) && !t.startsWith(TAG_PREFIX.room));
}

function categoryRef(ref: BackendCategory | string | undefined): { id: string; name: string; slug: string } {
  if (!ref) return { id: '', name: 'Uncategorized', slug: '' };
  if (typeof ref === 'string') return { id: ref, name: 'Uncategorized', slug: '' };
  return { id: ref.id, name: ref.name, slug: ref.slug };
}

function deriveColors(customizations: BackendCustomization[] | undefined): ProductColor[] {
  const colorGroup = (customizations || []).find((c) => c.type === 'color' && c.isActive);
  if (!colorGroup) return [];
  return colorGroup.options.filter((o) => o.isActive).map((o) => ({ name: o.label, hex: o.value }));
}

function deriveSpecs(bp: BackendProduct): { label: string; value: string }[] {
  const specs: { label: string; value: string }[] = [];
  if (bp.dimensions && (bp.dimensions.length || bp.dimensions.width || bp.dimensions.height)) {
    const { length, width, height, unit = 'cm' } = bp.dimensions;
    specs.push({ label: 'Dimensions', value: `${length ?? '—'} × ${width ?? '—'} × ${height ?? '—'} ${unit}` });
  }
  if (bp.weight) specs.push({ label: 'Weight', value: `${bp.weight} kg` });
  if (bp.sku) specs.push({ label: 'SKU', value: bp.sku });
  if (bp.gst?.hsnCode) specs.push({ label: 'HSN Code', value: bp.gst.hsnCode });
  if (typeof bp.gst?.rate === 'number') specs.push({ label: 'GST', value: `${bp.gst.rate}%` });
  return specs;
}

function deriveDimensionsString(bp: BackendProduct): string {
  if (!bp.dimensions) return '';
  const { length, width, height, unit = 'cm' } = bp.dimensions;
  if (!length && !width && !height) return '';
  return `W ${width ?? '—'} × D ${length ?? '—'} × H ${height ?? '—'} ${unit}`;
}

// A real (not fabricated) "Bestseller" signal derived from actual rating aggregates.
// No "New Arrival" badge: the backend's toJSON plugin strips createdAt, so there is no
// real signal for recency available to the frontend at all.
function deriveBadge(bp: BackendProduct): Product['badge'] {
  if (bp.ratings.average >= 4.5 && bp.ratings.count >= 10) return 'Bestseller';
  return undefined;
}

export function adaptProduct(bp: BackendProduct): Product {
  const category = categoryRef(bp.category);
  const subcategory = categoryRef(bp.subcategory);
  const primary = bp.images.find((i) => i.isPrimary) || bp.images[0];
  const gallery = bp.images.filter((i) => i !== primary).map((i) => i.url);

  return {
    id: bp.id,
    slug: bp.slug,
    name: bp.name,
    categorySlug: category.slug,
    categoryName: category.name,
    subcategorySlug: subcategory.slug,
    subcategoryName: subcategory.name,
    collection: deriveCollection(bp.tags),
    price: bp.price,
    comparePrice: bp.comparePrice ?? bp.price,
    image: primary?.url || '',
    gallery,
    shortDescription: bp.shortDescription || bp.description?.slice(0, 160) || '',
    description: bp.description || '',
    highlights: [],
    specs: deriveSpecs(bp),
    dimensions: deriveDimensionsString(bp),
    colors: deriveColors(bp.customizations),
    sku: bp.sku || '',
    stock: bp.stock,
    rating: bp.ratings.average,
    reviewCount: bp.ratings.count,
    tags: publicTags(bp.tags),
    badge: deriveBadge(bp),
    isFeatured: bp.isFeatured,
    customizations: bp.customizations,
  };
}

export function adaptSubCategory(bc: BackendCategory): SubCategory {
  return { id: bc.id, name: bc.name, slug: bc.slug, image: bc.image };
}

export function adaptCategory(bc: BackendCategory): Category {
  return {
    id: bc.id,
    name: bc.name,
    slug: bc.slug,
    tagline: bc.tagline || bc.description || '',
    description: bc.description,
    story: bc.story?.title && bc.story?.body ? { title: bc.story.title, body: bc.story.body } : undefined,
    icon: '✦',
    image: bc.image,
    banner: bc.banner || bc.image,
    seo: bc.seo,
    subcategories: (bc.subcategories || []).map(adaptSubCategory),
  };
}
