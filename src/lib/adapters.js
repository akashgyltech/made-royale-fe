function categoryRef(ref) {
    if (!ref)
        return { id: '', name: 'Uncategorized', slug: '' };
    if (typeof ref === 'string')
        return { id: ref, name: 'Uncategorized', slug: '' };
    return { id: ref.id, name: ref.name, slug: ref.slug };
}
function deriveColors(customizations) {
    const colorGroup = (customizations || []).find((c) => c.type === 'color' && c.isActive);
    if (!colorGroup)
        return [];
    return colorGroup.options.filter((o) => o.isActive).map((o) => ({ name: o.label, hex: o.value }));
}
function deriveSpecs(bp) {
    const specs = [];
    if (bp.dimensions && (bp.dimensions.length || bp.dimensions.width || bp.dimensions.height)) {
        const { length, width, height, unit = 'cm' } = bp.dimensions;
        specs.push({ label: 'Dimensions', value: `${length ?? '—'} × ${width ?? '—'} × ${height ?? '—'} ${unit}` });
    }
    if (bp.weight)
        specs.push({ label: 'Weight', value: `${bp.weight} kg` });
    if (bp.sku)
        specs.push({ label: 'SKU', value: bp.sku });
    if (bp.gst?.hsnCode)
        specs.push({ label: 'HSN Code', value: bp.gst.hsnCode });
    if (typeof bp.gst?.rate === 'number')
        specs.push({ label: 'GST', value: `${bp.gst.rate}%` });
    return specs;
}
function deriveDimensionsString(bp) {
    if (!bp.dimensions)
        return '';
    const { length, width, height, unit = 'cm' } = bp.dimensions;
    if (!length && !width && !height)
        return '';
    return `W ${width ?? '—'} × D ${length ?? '—'} × H ${height ?? '—'} ${unit}`;
}
// A real (not fabricated) "Bestseller" signal derived from actual rating aggregates.
// No "New Arrival" badge: the backend's toJSON plugin strips createdAt, so there is no
// real signal for recency available to the frontend at all.
function deriveBadge(bp) {
    if (bp.ratings.average >= 4.5 && bp.ratings.count >= 10)
        return 'Bestseller';
    return undefined;
}
export function adaptProduct(bp) {
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
        tags: bp.tags || [],
        badge: deriveBadge(bp),
        isFeatured: bp.isFeatured,
        customizations: bp.customizations,
    };
}
export function adaptSubCategory(bc) {
    return { id: bc.id, name: bc.name, slug: bc.slug, image: bc.image };
}
export function adaptCategory(bc) {
    return {
        id: bc.id,
        parent: bc.parent && typeof bc.parent === 'object' ? bc.parent.id : (bc.parent || null),
        name: bc.name,
        slug: bc.slug,
        tagline: bc.tagline || bc.description || '',
        description: bc.description,
        story: bc.story?.title && bc.story?.body ? { title: bc.story.title, body: bc.story.body } : undefined,
        icon: '✦',
        image: bc.image,
        banner: bc.banner || bc.image,
        storyImage: bc.storyImage || bc.image,
        showInShop: !!bc.showInShop,
        showInRoom: !!bc.showInRoom,
        seo: bc.seo,
        subcategories: (bc.subcategories || []).map(adaptSubCategory),
    };
}
