// ─────────────────────────────────────────────────────────────────────────────
// MADE ROYALE — Luxury Furniture Catalog (dummy data)
//
// Self-contained, client-side catalog powering the whole storefront while the
// backend & payment gateway are built. Every product/category has an `image`
// slot (and products a `gallery[]`): drop a path like
// "/assets/img/products/my-sofa.jpg" and it renders instantly; leave it empty
// and an elegant monogram placeholder shows instead. Prices are in INR (₹).
// ─────────────────────────────────────────────────────────────────────────────

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  image?: string; // ← drop a real image path here later
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  icon: string;
  image?: string; // ← drop a real image path here later
  subcategories: SubCategory[];
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  categoryName: string;
  subcategorySlug: string;
  subcategoryName: string;
  collection: 'Maharaja' | 'Vintage' | 'Contemporary Royale' | 'Heritage';
  price: number;
  comparePrice: number;
  image?: string; // ← main product image
  gallery?: string[]; // ← additional images
  shortDescription: string;
  description: string;
  highlights: string[];
  specs: { label: string; value: string }[];
  material: string;
  dimensions: string;
  colors: ProductColor[];
  sku: string;
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  badge?: 'Bestseller' | 'New Arrival' | 'Limited Edition' | 'Handcrafted';
  isFeatured?: boolean;
  warranty: string;
  assembly: string;
  upsellIds?: string[];
  relatedIds?: string[];
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  location: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image?: string;
  content: string[];
}

export interface Coupon {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  minOrder: number;
  maxDiscount?: number;
  description: string;
}

// ── Currency ──────────────────────────────────────────────────────────────────
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

const CAT_IMG = '/assets/img/inner-shop/category';

// ── Categories & subcategories ────────────────────────────────────────────────
export const categories: Category[] = [
  {
    id: 'c-sofas', name: 'Sofas & Seating', slug: 'sofas', tagline: 'Thrones for the modern living room', icon: '🛋️',
    image: `${CAT_IMG}/shop-by-sofa.webp`,
    subcategories: [
      { id: 's-sofa-3', name: '3 Seater Sofas', slug: '3-seater' },
      { id: 's-sofa-l', name: 'L-Shaped Sofas', slug: 'l-shaped' },
      { id: 's-sofa-recliner', name: 'Recliner Sofas', slug: 'recliners' },
      { id: 's-sofa-bed', name: 'Sofa Cum Beds', slug: 'sofa-cum-beds' },
    ],
  },
  {
    id: 'c-beds', name: 'Beds & Bedroom', slug: 'beds', tagline: 'Rest like royalty', icon: '🛏️',
    image: `${CAT_IMG}/shop-by-bed.webp`,
    subcategories: [
      { id: 's-bed-king', name: 'King Size Beds', slug: 'king-beds' },
      { id: 's-bed-queen', name: 'Queen Size Beds', slug: 'queen-beds' },
      { id: 's-bed-poster', name: 'Poster Beds', slug: 'poster-beds' },
      { id: 's-bed-storage', name: 'Storage Beds', slug: 'storage-beds' },
    ],
  },
  {
    id: 'c-dining', name: 'Dining', slug: 'dining', tagline: 'Feasts fit for a durbar', icon: '🍽️',
    image: `${CAT_IMG}/shop-by-dining.webp`,
    subcategories: [
      { id: 's-dine-6', name: '6 Seater Dining Sets', slug: '6-seater' },
      { id: 's-dine-4', name: '4 Seater Dining Sets', slug: '4-seater' },
      { id: 's-dine-chair', name: 'Dining Chairs', slug: 'dining-chairs' },
      { id: 's-dine-bar', name: 'Bar & Cabinets', slug: 'bar-units' },
    ],
  },
  {
    id: 'c-wardrobes', name: 'Wardrobes', slug: 'wardrobes', tagline: 'Keep your regalia in order', icon: '🚪',
    image: `${CAT_IMG}/shop-by-wardrobe.webp`,
    subcategories: [
      { id: 's-ward-2', name: '2 Door Wardrobes', slug: '2-door' },
      { id: 's-ward-3', name: '3 Door Wardrobes', slug: '3-door' },
      { id: 's-ward-slide', name: 'Sliding Wardrobes', slug: 'sliding' },
    ],
  },
  {
    id: 'c-seating', name: 'Chairs & Accent', slug: 'chairs', tagline: 'A seat for every occasion', icon: '🪑',
    image: `${CAT_IMG}/shop-by-chair.webp`,
    subcategories: [
      { id: 's-seat-accent', name: 'Accent Chairs', slug: 'accent-chairs' },
      { id: 's-seat-arm', name: 'Armchairs', slug: 'armchairs' },
      { id: 's-seat-bench', name: 'Benches & Ottomans', slug: 'benches' },
    ],
  },
  {
    id: 'c-tables', name: 'Tables', slug: 'tables', tagline: 'Centrepieces with character', icon: '🪵',
    image: `${CAT_IMG}/shop-by-centertable.webp`,
    subcategories: [
      { id: 's-tab-coffee', name: 'Coffee Tables', slug: 'coffee-tables' },
      { id: 's-tab-console', name: 'Console Tables', slug: 'console-tables' },
      { id: 's-tab-study', name: 'Study Tables', slug: 'study-tables' },
      { id: 's-tab-side', name: 'Side Tables', slug: 'side-tables' },
    ],
  },
  {
    id: 'c-storage', name: 'Storage & TV', slug: 'storage', tagline: 'Considered, concealed, curated', icon: '🗄️',
    image: `${CAT_IMG}/shop-by-tvunit.webp`,
    subcategories: [
      { id: 's-stor-tv', name: 'TV Units', slug: 'tv-units' },
      { id: 's-stor-cab', name: 'Cabinets & Sideboards', slug: 'cabinets' },
      { id: 's-stor-book', name: 'Bookshelves', slug: 'bookshelves' },
    ],
  },
  {
    id: 'c-decor', name: 'Decor & Lighting', slug: 'decor', tagline: 'The finishing flourish', icon: '🕯️',
    image: '', // ← add your own decor image
    subcategories: [
      { id: 's-dec-mirror', name: 'Mirrors', slug: 'mirrors' },
      { id: 's-dec-light', name: 'Lighting', slug: 'lighting' },
      { id: 's-dec-rug', name: 'Rugs & Carpets', slug: 'rugs' },
    ],
  },
];

// ── Products ──────────────────────────────────────────────────────────────────
const C = {
  walnut: { name: 'Royal Walnut', hex: '#5a3a22' },
  teak: { name: 'Burma Teak', hex: '#8a5a2b' },
  mahogany: { name: 'Deep Mahogany', hex: '#4a2118' },
  ivory: { name: 'Ivory Velvet', hex: '#efe6d2' },
  emerald: { name: 'Emerald Velvet', hex: '#0f5132' },
  sapphire: { name: 'Sapphire Velvet', hex: '#1e2a52' },
  wine: { name: 'Royal Wine', hex: '#5b1f2e' },
  charcoal: { name: 'Charcoal Grey', hex: '#33373b' },
  gold: { name: 'Antique Gold', hex: '#b8965a' },
};

export const products: Product[] = [
  {
    id: 'p-udaipur-sofa', slug: 'udaipur-3-seater-sofa', name: 'Udaipur Chesterfield 3-Seater Sofa',
    categorySlug: 'sofas', categoryName: 'Sofas & Seating', subcategorySlug: '3-seater', subcategoryName: '3 Seater Sofas',
    collection: 'Maharaja', price: 189000, comparePrice: 249000, image: '', gallery: [],
    shortDescription: 'Hand-tufted chesterfield in Italian velvet on a solid Sheesham frame.',
    description: 'Inspired by the lakeside palaces of Udaipur, this deep-buttoned chesterfield pairs old-world grandeur with modern comfort. Every button is hand-tufted, the arms hand-rolled, and the frame joined in solid Sheesham by master karigars. High-resilience foam wrapped in feather-blend ensures the seat is as forgiving as it is regal.',
    highlights: ['Hand-tufted deep-button chesterfield back', 'Solid Sheesham (Indian Rosewood) frame', 'Italian cotton-velvet upholstery', 'Feather-blend wrapped high-resilience foam'],
    specs: [{ label: 'Seating Capacity', value: '3 Seater' }, { label: 'Primary Material', value: 'Solid Sheesham Wood' }, { label: 'Upholstery', value: 'Italian Cotton Velvet' }, { label: 'Filling', value: 'Feather-blend + HR Foam' }, { label: 'Weight Capacity', value: '350 kg' }],
    material: 'Solid Sheesham + Italian Velvet', dimensions: 'W 213 × D 91 × H 78 cm',
    colors: [C.emerald, C.sapphire, C.wine, C.ivory], sku: 'MR-SOF-UDP-001', stock: 6, rating: 4.8, reviewCount: 126,
    tags: ['sofa', 'chesterfield', 'velvet', 'living room'], badge: 'Bestseller', isFeatured: true,
    warranty: '5 Year Frame Warranty', assembly: 'Free expert installation',
    upsellIds: ['p-jaipur-coffee-table', 'p-benares-rug', 'p-mysore-floor-lamp'], relatedIds: ['p-jodhpur-lsofa', 'p-travancore-recliner', 'p-hyderabad-accent-chair'],
  },
  {
    id: 'p-jodhpur-lsofa', slug: 'jodhpur-l-shaped-sofa', name: 'Jodhpur L-Shaped Modular Sofa',
    categorySlug: 'sofas', categoryName: 'Sofas & Seating', subcategorySlug: 'l-shaped', subcategoryName: 'L-Shaped Sofas',
    collection: 'Contemporary Royale', price: 264000, comparePrice: 329000, image: '', gallery: [],
    shortDescription: 'Six-seat modular corner sofa with a hand-finished brass base.',
    description: 'A commanding corner piece for grand living rooms. The Jodhpur seats six in generous comfort, with a low, architectural silhouette resting on a hand-finished antique-brass base. Cushions are reversible with a memory-foam core for lasting shape.',
    highlights: ['Modular 6-seat corner configuration', 'Antique-brass finished metal base', 'Reversible memory-foam cushions', 'Stain-resistant premium linen weave'],
    specs: [{ label: 'Seating Capacity', value: '6 Seater (Corner)' }, { label: 'Primary Material', value: 'Engineered Hardwood + Metal' }, { label: 'Upholstery', value: 'Stain-Resistant Linen' }, { label: 'Configuration', value: 'Left / Right adaptable' }],
    material: 'Hardwood + Brass-finish Metal', dimensions: 'W 300 × D 200 × H 74 cm',
    colors: [C.charcoal, C.ivory, C.emerald], sku: 'MR-SOF-JDP-002', stock: 4, rating: 4.7, reviewCount: 88,
    tags: ['sofa', 'l-shaped', 'modular', 'living room'], badge: 'New Arrival', isFeatured: true,
    warranty: '5 Year Frame Warranty', assembly: 'Free expert installation',
    upsellIds: ['p-jaipur-coffee-table', 'p-benares-rug', 'p-lucknow-tv-unit'], relatedIds: ['p-udaipur-sofa', 'p-travancore-recliner'],
  },
  {
    id: 'p-travancore-recliner', slug: 'travancore-leather-recliner', name: 'Travancore Full-Grain Leather Recliner',
    categorySlug: 'sofas', categoryName: 'Sofas & Seating', subcategorySlug: 'recliners', subcategoryName: 'Recliner Sofas',
    collection: 'Heritage', price: 148000, comparePrice: 179000, image: '', gallery: [],
    shortDescription: 'Single-seat power recliner in full-grain leather with USB charging.',
    description: 'The Travancore reclines to a near-flat 165° at the touch of a button, cradling you in supple full-grain leather that only grows richer with age. An integrated USB port and cup-holder make it the quiet luxury of a private study.',
    highlights: ['Power recline up to 165°', 'Full-grain aniline leather', 'Integrated USB charging + cup holder', 'Whisper-quiet German motor'],
    specs: [{ label: 'Type', value: 'Single-Seat Power Recliner' }, { label: 'Upholstery', value: 'Full-Grain Aniline Leather' }, { label: 'Recline Angle', value: 'Up to 165°' }, { label: 'Power', value: 'USB + AC adaptor' }],
    material: 'Full-Grain Leather', dimensions: 'W 90 × D 95 × H 105 cm',
    colors: [C.mahogany, C.charcoal, C.walnut], sku: 'MR-SOF-TRV-003', stock: 9, rating: 4.9, reviewCount: 154,
    tags: ['recliner', 'leather', 'living room'], badge: 'Bestseller',
    warranty: '3 Year Motor Warranty', assembly: 'Plug & play',
    upsellIds: ['p-mysore-floor-lamp', 'p-jaipur-side-table'], relatedIds: ['p-udaipur-sofa', 'p-jodhpur-lsofa'],
  },
  {
    id: 'p-mysore-king-bed', slug: 'mysore-king-poster-bed', name: 'Mysore Maharaja King Poster Bed',
    categorySlug: 'beds', categoryName: 'Beds & Bedroom', subcategorySlug: 'poster-beds', subcategoryName: 'Poster Beds',
    collection: 'Maharaja', price: 312000, comparePrice: 399000, image: '', gallery: [],
    shortDescription: 'Hand-carved teak four-poster with a canopy-ready frame.',
    description: 'A true centrepiece bed carved from solid Burma teak by the woodcarvers of Mysore. Four turned posts rise to a canopy-ready crown, while the headboard carries traditional jaali fretwork rendered with jeweller-like precision.',
    highlights: ['Solid Burma teak, hand-carved', 'Canopy-ready four-poster frame', 'Traditional jaali fretwork headboard', 'Natural bees-wax hand finish'],
    specs: [{ label: 'Size', value: 'King (72 × 78 in)' }, { label: 'Primary Material', value: 'Solid Burma Teak' }, { label: 'Finish', value: 'Natural Bees-Wax' }, { label: 'Storage', value: 'Optional hydraulic' }],
    material: 'Solid Burma Teak', dimensions: 'W 193 × L 210 × H 220 cm',
    colors: [C.teak, C.walnut, C.mahogany], sku: 'MR-BED-MYS-004', stock: 3, rating: 4.9, reviewCount: 97,
    tags: ['bed', 'king', 'teak', 'bedroom'], badge: 'Limited Edition', isFeatured: true,
    warranty: '10 Year Structural Warranty', assembly: 'Free expert installation',
    upsellIds: ['p-kashmir-wardrobe', 'p-jaipur-side-table', 'p-mysore-floor-lamp'], relatedIds: ['p-awadh-storage-bed', 'p-kashmir-wardrobe'],
  },
  {
    id: 'p-awadh-storage-bed', slug: 'awadh-king-storage-bed', name: 'Awadh King Hydraulic Storage Bed',
    categorySlug: 'beds', categoryName: 'Beds & Bedroom', subcategorySlug: 'storage-beds', subcategoryName: 'Storage Beds',
    collection: 'Contemporary Royale', price: 176000, comparePrice: 219000, image: '', gallery: [],
    shortDescription: 'Upholstered king bed with full-lift hydraulic storage.',
    description: 'The Awadh combines a serene upholstered headboard with a whole-mattress hydraulic lift, revealing a cavernous storage bay beneath. German gas-lift struts make opening effortless even when fully loaded.',
    highlights: ['Full hydraulic lift-up storage', 'Wing-back upholstered headboard', 'German gas-lift struts', 'Moisture-resistant ply base'],
    specs: [{ label: 'Size', value: 'King (72 × 78 in)' }, { label: 'Storage', value: 'Full Hydraulic Lift' }, { label: 'Headboard', value: 'Upholstered Wing-back' }, { label: 'Base', value: 'BWR-grade Ply' }],
    material: 'Engineered Wood + Fabric', dimensions: 'W 193 × L 205 × H 120 cm',
    colors: [C.charcoal, C.ivory, C.sapphire], sku: 'MR-BED-AWD-005', stock: 7, rating: 4.6, reviewCount: 143,
    tags: ['bed', 'king', 'storage', 'bedroom'], badge: 'Bestseller',
    warranty: '5 Year Warranty', assembly: 'Free expert installation',
    upsellIds: ['p-kashmir-wardrobe', 'p-jaipur-side-table'], relatedIds: ['p-mysore-king-bed', 'p-kashmir-wardrobe'],
  },
  {
    id: 'p-hyderabad-dining', slug: 'hyderabad-nizam-6-seater-dining', name: 'Hyderabad Nizam 6-Seater Dining Set',
    categorySlug: 'dining', categoryName: 'Dining', subcategorySlug: '6-seater', subcategoryName: '6 Seater Dining Sets',
    collection: 'Maharaja', price: 258000, comparePrice: 319000, image: '', gallery: [],
    shortDescription: 'Marble-top dining table with six velvet high-back chairs.',
    description: 'Dine like a Nizam. A single slab of Makrana marble crowns a hand-finished frame, surrounded by six high-back chairs in plush velvet with brass-capped legs. Built for long, unhurried feasts.',
    highlights: ['Genuine Makrana marble table top', 'Six velvet high-back chairs included', 'Brass-capped solid wood legs', 'Sealed, stain-resistant marble'],
    specs: [{ label: 'Seating Capacity', value: '6 Seater' }, { label: 'Table Top', value: 'Makrana Marble' }, { label: 'Chairs', value: '6 × Velvet High-back' }, { label: 'Frame', value: 'Solid Wood + Brass' }],
    material: 'Makrana Marble + Solid Wood', dimensions: 'Table: L 180 × W 90 × H 76 cm',
    colors: [C.emerald, C.wine, C.ivory], sku: 'MR-DIN-HYD-006', stock: 5, rating: 4.8, reviewCount: 71,
    tags: ['dining', '6 seater', 'marble'], badge: 'Handcrafted', isFeatured: true,
    warranty: '5 Year Warranty', assembly: 'Free expert installation',
    upsellIds: ['p-benares-rug', 'p-lucknow-sideboard'], relatedIds: ['p-goa-4-seater-dining', 'p-lucknow-sideboard'],
  },
  {
    id: 'p-goa-4-seater-dining', slug: 'goa-4-seater-dining', name: 'Goa Coastal 4-Seater Dining Set',
    categorySlug: 'dining', categoryName: 'Dining', subcategorySlug: '4-seater', subcategoryName: '4 Seater Dining Sets',
    collection: 'Contemporary Royale', price: 118000, comparePrice: 149000, image: '', gallery: [],
    shortDescription: 'Breezy solid-wood 4-seater with cane-back chairs.',
    description: 'Light, airy and effortlessly elegant — the Goa brings coastal calm indoors. A solid mango-wood table pairs with four hand-woven cane-back chairs for relaxed, sunlit meals.',
    highlights: ['Solid mango-wood table', 'Hand-woven natural cane chair backs', 'Compact 4-seat footprint', 'Matte weather-sealed finish'],
    specs: [{ label: 'Seating Capacity', value: '4 Seater' }, { label: 'Table', value: 'Solid Mango Wood' }, { label: 'Chairs', value: '4 × Cane-back' }, { label: 'Finish', value: 'Matte Sealed' }],
    material: 'Solid Mango Wood + Cane', dimensions: 'Table: L 120 × W 75 × H 76 cm',
    colors: [C.teak, C.walnut], sku: 'MR-DIN-GOA-007', stock: 11, rating: 4.5, reviewCount: 64,
    tags: ['dining', '4 seater', 'cane'],
    warranty: '3 Year Warranty', assembly: 'Free expert installation',
    upsellIds: ['p-benares-rug'], relatedIds: ['p-hyderabad-dining', 'p-lucknow-sideboard'],
  },
  {
    id: 'p-kashmir-wardrobe', slug: 'kashmir-3-door-wardrobe', name: 'Kashmir Walnut 3-Door Wardrobe',
    categorySlug: 'wardrobes', categoryName: 'Wardrobes', subcategorySlug: '3-door', subcategoryName: '3 Door Wardrobes',
    collection: 'Heritage', price: 198000, comparePrice: 245000, image: '', gallery: [],
    shortDescription: 'Walnut-burl wardrobe with mirror, drawers and soft-close doors.',
    description: 'Echoing the famed walnut craft of Kashmir, this three-door wardrobe features a bookmatched burl veneer, a full-length dressing mirror, felt-lined jewellery drawers and whisper-soft closing hinges throughout.',
    highlights: ['Bookmatched walnut-burl veneer', 'Full-length dressing mirror', 'Felt-lined jewellery drawers', 'Soft-close hinges throughout'],
    specs: [{ label: 'Doors', value: '3 Door (1 Mirror)' }, { label: 'Veneer', value: 'Walnut Burl' }, { label: 'Drawers', value: '4 (Felt-lined)' }, { label: 'Hinges', value: 'Soft-close' }],
    material: 'Engineered Wood + Walnut Veneer', dimensions: 'W 152 × D 60 × H 210 cm',
    colors: [C.walnut, C.mahogany, C.charcoal], sku: 'MR-WRD-KSH-008', stock: 6, rating: 4.7, reviewCount: 58,
    tags: ['wardrobe', '3 door', 'bedroom'], badge: 'Bestseller',
    warranty: '5 Year Warranty', assembly: 'Free expert installation',
    upsellIds: ['p-mysore-king-bed', 'p-jaipur-side-table'], relatedIds: ['p-awadh-storage-bed', 'p-mysore-king-bed'],
  },
  {
    id: 'p-hyderabad-accent-chair', slug: 'hyderabad-accent-wing-chair', name: 'Hyderabad Wing Accent Chair',
    categorySlug: 'chairs', categoryName: 'Chairs & Accent', subcategorySlug: 'accent-chairs', subcategoryName: 'Accent Chairs',
    collection: 'Vintage', price: 62000, comparePrice: 82000, image: '', gallery: [],
    shortDescription: 'High wing-back accent chair in emerald velvet with brass studs.',
    description: 'A statement seat for reading nooks and grand corners. The Hyderabad wing chair is upholstered in deep emerald velvet, finished with a hand-hammered brass stud trim and turned wooden legs.',
    highlights: ['High wing-back silhouette', 'Emerald cotton-velvet upholstery', 'Hand-hammered brass stud trim', 'Turned solid-wood legs'],
    specs: [{ label: 'Type', value: 'Accent Wing Chair' }, { label: 'Upholstery', value: 'Cotton Velvet' }, { label: 'Legs', value: 'Turned Solid Wood' }, { label: 'Trim', value: 'Brass Studs' }],
    material: 'Solid Wood + Velvet', dimensions: 'W 80 × D 85 × H 110 cm',
    colors: [C.emerald, C.wine, C.sapphire, C.ivory], sku: 'MR-CHR-HYD-009', stock: 14, rating: 4.6, reviewCount: 112,
    tags: ['chair', 'accent', 'velvet'], badge: 'New Arrival', isFeatured: true,
    warranty: '3 Year Warranty', assembly: 'Minimal assembly',
    upsellIds: ['p-jaipur-side-table', 'p-mysore-floor-lamp'], relatedIds: ['p-udaipur-sofa', 'p-travancore-recliner'],
  },
  {
    id: 'p-jaipur-coffee-table', slug: 'jaipur-marble-coffee-table', name: 'Jaipur Marble & Brass Coffee Table',
    categorySlug: 'tables', categoryName: 'Tables', subcategorySlug: 'coffee-tables', subcategoryName: 'Coffee Tables',
    collection: 'Maharaja', price: 74000, comparePrice: 96000, image: '', gallery: [],
    shortDescription: 'Round marble-top coffee table on a sculpted brass frame.',
    description: 'The pink-city glamour of Jaipur, distilled into a coffee table. A honed marble disc floats on a sculptural, hand-polished brass frame — a jewel for the centre of any living room.',
    highlights: ['Honed natural marble top', 'Hand-polished sculptural brass frame', 'Anti-scratch felt base', 'Each marble grain unique'],
    specs: [{ label: 'Shape', value: 'Round' }, { label: 'Top', value: 'Natural Marble' }, { label: 'Frame', value: 'Polished Brass' }, { label: 'Diameter', value: '90 cm' }],
    material: 'Marble + Brass', dimensions: 'Ø 90 × H 42 cm',
    colors: [C.gold, C.ivory], sku: 'MR-TBL-JPR-010', stock: 10, rating: 4.8, reviewCount: 90,
    tags: ['table', 'coffee', 'marble', 'brass'], badge: 'Bestseller', isFeatured: true,
    warranty: '3 Year Warranty', assembly: 'Minimal assembly',
    upsellIds: ['p-benares-rug', 'p-mysore-floor-lamp'], relatedIds: ['p-jaipur-side-table', 'p-udaipur-sofa'],
  },
  {
    id: 'p-jaipur-side-table', slug: 'jaipur-nesting-side-table', name: 'Jaipur Nesting Side Table (Set of 2)',
    categorySlug: 'tables', categoryName: 'Tables', subcategorySlug: 'side-tables', subcategoryName: 'Side Tables',
    collection: 'Contemporary Royale', price: 38000, comparePrice: 52000, image: '', gallery: [],
    shortDescription: 'Pair of nesting side tables with enamel-inlay tops.',
    description: 'A versatile pair that tucks away or spreads out as the moment demands. Meenakari-inspired enamel inlay tops sit on slender brass-finish legs.',
    highlights: ['Set of 2 nesting tables', 'Meenakari-inspired enamel inlay', 'Brass-finish slender legs', 'Space-saving design'],
    specs: [{ label: 'Pieces', value: 'Set of 2' }, { label: 'Top', value: 'Enamel Inlay' }, { label: 'Legs', value: 'Brass-finish Metal' }],
    material: 'MDF + Metal', dimensions: 'Large: Ø 45 × H 55 cm',
    colors: [C.gold, C.emerald, C.sapphire], sku: 'MR-TBL-JPR-011', stock: 18, rating: 4.5, reviewCount: 47,
    tags: ['table', 'side', 'nesting'], badge: 'New Arrival',
    warranty: '2 Year Warranty', assembly: 'Ready to use',
    upsellIds: ['p-mysore-floor-lamp'], relatedIds: ['p-jaipur-coffee-table', 'p-hyderabad-accent-chair'],
  },
  {
    id: 'p-lucknow-tv-unit', slug: 'lucknow-tv-entertainment-unit', name: 'Lucknow Chikankari TV Entertainment Unit',
    categorySlug: 'storage', categoryName: 'Storage & TV', subcategorySlug: 'tv-units', subcategoryName: 'TV Units',
    collection: 'Heritage', price: 96000, comparePrice: 128000, image: '', gallery: [],
    shortDescription: 'Wall-length TV unit with fluted doors and cable management.',
    description: 'A low, wall-length media console with softly fluted doors, integrated cable management and touch-open compartments. Fits screens up to 75 inches with room for consoles and soundbars.',
    highlights: ['Fits up to 75" screens', 'Fluted soft-close doors', 'Integrated cable management', 'Touch-open compartments'],
    specs: [{ label: 'Screen Fit', value: 'Up to 75"' }, { label: 'Doors', value: 'Fluted Soft-close' }, { label: 'Cable Mgmt', value: 'Integrated' }],
    material: 'Engineered Wood + Veneer', dimensions: 'W 200 × D 40 × H 55 cm',
    colors: [C.walnut, C.charcoal, C.ivory], sku: 'MR-STO-LKN-012', stock: 8, rating: 4.6, reviewCount: 53,
    tags: ['tv unit', 'storage', 'living room'], badge: 'Bestseller',
    warranty: '3 Year Warranty', assembly: 'Free expert installation',
    upsellIds: ['p-benares-rug', 'p-jaipur-coffee-table'], relatedIds: ['p-lucknow-sideboard', 'p-udaipur-sofa'],
  },
  {
    id: 'p-lucknow-sideboard', slug: 'lucknow-sideboard-cabinet', name: 'Lucknow Brass-Inlay Sideboard Cabinet',
    categorySlug: 'storage', categoryName: 'Storage & TV', subcategorySlug: 'cabinets', subcategoryName: 'Cabinets & Sideboards',
    collection: 'Maharaja', price: 132000, comparePrice: 168000, image: '', gallery: [],
    shortDescription: 'Solid-wood sideboard with hand-cut brass inlay motifs.',
    description: 'A dining-room heirloom. This solid-wood sideboard carries hand-cut brass inlay in traditional bel-buti motifs across its doors, with soft-close storage and a display-ready top.',
    highlights: ['Hand-cut brass inlay motifs', 'Solid-wood construction', 'Soft-close doors & drawers', 'Display-ready top surface'],
    specs: [{ label: 'Type', value: 'Sideboard / Buffet' }, { label: 'Material', value: 'Solid Wood' }, { label: 'Detailing', value: 'Brass Inlay' }],
    material: 'Solid Wood + Brass Inlay', dimensions: 'W 165 × D 45 × H 85 cm',
    colors: [C.mahogany, C.walnut], sku: 'MR-STO-LKN-013', stock: 5, rating: 4.9, reviewCount: 39,
    tags: ['sideboard', 'cabinet', 'dining'], badge: 'Handcrafted',
    warranty: '5 Year Warranty', assembly: 'Free expert installation',
    upsellIds: ['p-hyderabad-dining', 'p-benares-rug'], relatedIds: ['p-hyderabad-dining', 'p-lucknow-tv-unit'],
  },
  {
    id: 'p-benares-rug', slug: 'benares-hand-knotted-rug', name: 'Benares Hand-Knotted Silk Rug',
    categorySlug: 'decor', categoryName: 'Decor & Lighting', subcategorySlug: 'rugs', subcategoryName: 'Rugs & Carpets',
    collection: 'Heritage', price: 89000, comparePrice: 119000, image: '', gallery: [],
    shortDescription: 'Hand-knotted wool-silk rug with a Mughal medallion motif.',
    description: 'Woven over four months on traditional looms, this wool-silk rug carries a classic Mughal medallion in jewel tones. Every knot is tied by hand, giving a subtle sheen that shifts with the light.',
    highlights: ['Hand-knotted over 4 months', 'Wool & silk blend', 'Mughal medallion motif', 'Natural vegetable dyes'],
    specs: [{ label: 'Weave', value: 'Hand-knotted' }, { label: 'Material', value: 'Wool + Silk' }, { label: 'Size', value: '8 × 10 ft' }],
    material: 'Wool + Silk', dimensions: '244 × 305 cm',
    colors: [C.wine, C.emerald, C.sapphire], sku: 'MR-DEC-BNS-014', stock: 7, rating: 4.9, reviewCount: 61,
    tags: ['rug', 'decor', 'silk'], badge: 'Limited Edition', isFeatured: true,
    warranty: 'Lifetime weave guarantee', assembly: 'Ready to use',
    upsellIds: ['p-udaipur-sofa', 'p-jaipur-coffee-table'], relatedIds: ['p-mysore-floor-lamp', 'p-jaipur-coffee-table'],
  },
  {
    id: 'p-mysore-floor-lamp', slug: 'mysore-brass-floor-lamp', name: 'Mysore Brass Arc Floor Lamp',
    categorySlug: 'decor', categoryName: 'Decor & Lighting', subcategorySlug: 'lighting', subcategoryName: 'Lighting',
    collection: 'Contemporary Royale', price: 42000, comparePrice: 58000, image: '', gallery: [],
    shortDescription: 'Sweeping brass arc lamp on a solid marble base.',
    description: 'An elegant arc of hand-polished brass sweeps over your seating, grounded by a solid marble base. Warm dimmable LED light, ready for reading and ambience alike.',
    highlights: ['Hand-polished brass arc', 'Solid marble base', 'Warm dimmable LED', 'Weighted for stability'],
    specs: [{ label: 'Type', value: 'Arc Floor Lamp' }, { label: 'Base', value: 'Solid Marble' }, { label: 'Lighting', value: 'Dimmable LED' }],
    material: 'Brass + Marble', dimensions: 'H 200 × Reach 120 cm',
    colors: [C.gold], sku: 'MR-DEC-MYS-015', stock: 12, rating: 4.7, reviewCount: 44,
    tags: ['lamp', 'lighting', 'decor'], badge: 'New Arrival',
    warranty: '2 Year Warranty', assembly: 'Minimal assembly',
    upsellIds: ['p-benares-rug', 'p-hyderabad-accent-chair'], relatedIds: ['p-benares-rug', 'p-jaipur-side-table'],
  },
  {
    id: 'p-udaipur-sofa-bed', slug: 'amber-sofa-cum-bed', name: 'Amber Sofa Cum Bed',
    categorySlug: 'sofas', categoryName: 'Sofas & Seating', subcategorySlug: 'sofa-cum-beds', subcategoryName: 'Sofa Cum Beds',
    collection: 'Contemporary Royale', price: 84000, comparePrice: 109000, image: '', gallery: [],
    shortDescription: 'Three-seat sofa that folds flat into a queen bed.',
    description: 'For the gracious host. The Amber seats three by day and, with a single smooth motion, folds into a comfortable queen bed by night — upholstered in a durable boucle weave.',
    highlights: ['Converts to queen bed', 'One-motion click-clack mechanism', 'Durable boucle weave', 'Under-seat storage'],
    specs: [{ label: 'Type', value: 'Sofa Cum Bed' }, { label: 'Bed Size', value: 'Queen' }, { label: 'Upholstery', value: 'Boucle Weave' }],
    material: 'Hardwood + Boucle', dimensions: 'Sofa: W 200 × D 95 × H 82 cm',
    colors: [C.ivory, C.charcoal, C.emerald], sku: 'MR-SOF-AMB-016', stock: 9, rating: 4.5, reviewCount: 76,
    tags: ['sofa', 'sofa cum bed', 'living room'],
    warranty: '3 Year Warranty', assembly: 'Free expert installation',
    upsellIds: ['p-jaipur-coffee-table', 'p-benares-rug'], relatedIds: ['p-udaipur-sofa', 'p-jodhpur-lsofa'],
  },
  {
    id: 'p-shimla-bookshelf', slug: 'shimla-ladder-bookshelf', name: 'Shimla Solid-Wood Ladder Bookshelf',
    categorySlug: 'storage', categoryName: 'Storage & TV', subcategorySlug: 'bookshelves', subcategoryName: 'Bookshelves',
    collection: 'Vintage', price: 46000, comparePrice: 62000, image: '', gallery: [],
    shortDescription: 'Five-tier leaning ladder shelf in solid Sheesham.',
    description: 'A gently leaning ladder shelf in solid Sheesham, its five graduated tiers perfect for a curated library of books, ceramics and heirlooms.',
    highlights: ['Solid Sheesham wood', 'Five graduated tiers', 'Anti-tip wall anchor', 'Hand-rubbed finish'],
    specs: [{ label: 'Tiers', value: '5' }, { label: 'Material', value: 'Solid Sheesham' }, { label: 'Safety', value: 'Anti-tip anchor' }],
    material: 'Solid Sheesham', dimensions: 'W 64 × D 40 × H 185 cm',
    colors: [C.walnut, C.teak], sku: 'MR-STO-SML-017', stock: 13, rating: 4.4, reviewCount: 33,
    tags: ['bookshelf', 'storage'],
    warranty: '3 Year Warranty', assembly: 'Minimal assembly',
    upsellIds: ['p-mysore-floor-lamp'], relatedIds: ['p-lucknow-tv-unit', 'p-shimla-study-table'],
  },
  {
    id: 'p-shimla-study-table', slug: 'shimla-executive-study-table', name: 'Shimla Executive Study Desk',
    categorySlug: 'tables', categoryName: 'Tables', subcategorySlug: 'study-tables', subcategoryName: 'Study Tables',
    collection: 'Heritage', price: 58000, comparePrice: 76000, image: '', gallery: [],
    shortDescription: 'Leather-top executive desk with cable-managed drawers.',
    description: 'An executive writing desk with a hand-tooled leather inlay top, three soft-close drawers and discreet cable management — a study worthy of a maharaja’s correspondence.',
    highlights: ['Hand-tooled leather top', 'Three soft-close drawers', 'Discreet cable routing', 'Solid-wood legs'],
    specs: [{ label: 'Type', value: 'Executive Desk' }, { label: 'Top', value: 'Leather Inlay' }, { label: 'Drawers', value: '3 Soft-close' }],
    material: 'Engineered Wood + Leather', dimensions: 'W 140 × D 70 × H 76 cm',
    colors: [C.mahogany, C.walnut, C.charcoal], sku: 'MR-TBL-SML-018', stock: 10, rating: 4.6, reviewCount: 41,
    tags: ['desk', 'study', 'office'],
    warranty: '3 Year Warranty', assembly: 'Minimal assembly',
    upsellIds: ['p-mysore-floor-lamp', 'p-hyderabad-accent-chair'], relatedIds: ['p-shimla-bookshelf', 'p-hyderabad-accent-chair'],
  },
];

// ── Reviews (seeded) ──────────────────────────────────────────────────────────
const reviewAuthors = [
  { name: 'Aditya Rathore', location: 'Jaipur, RJ' }, { name: 'Meera Krishnan', location: 'Chennai, TN' },
  { name: 'Rohan Malhotra', location: 'Gurugram, HR' }, { name: 'Ananya Sen', location: 'Kolkata, WB' },
  { name: 'Vikram Deshmukh', location: 'Pune, MH' }, { name: 'Ishita Kapoor', location: 'New Delhi, DL' },
  { name: 'Kabir Nair', location: 'Kochi, KL' }, { name: 'Sanya Gupta', location: 'Lucknow, UP' },
];
const reviewTitles = ['Absolutely regal', 'Worth every rupee', 'Craftsmanship is unreal', 'Elevated our whole room', 'Exceeded expectations', 'A true heirloom piece'];
const reviewBodies = [
  'The finish is flawless and the installation team was courteous and professional. It has become the centrepiece of our home.',
  'Photos do not do it justice — the material quality is genuinely premium. Guests keep asking where we bought it.',
  'Delivery was on time and the assembly was seamless. Feels sturdy and built to last for decades.',
  'The attention to detail in the joinery and finish is remarkable. You can tell it is handcrafted.',
  'Comfortable, beautiful and clearly made to last. Made Royale has earned a loyal customer.',
  'We compared several brands and nothing came close to this level of finish at the price.',
];

export function getReviews(productId: string): Review[] {
  const product = products.find((p) => p.id === productId);
  const count = product ? Math.min(5, Math.max(2, Math.round(product.rating))) : 3;
  const seed = productId.length;
  const out: Review[] = [];
  for (let i = 0; i < count; i++) {
    const a = reviewAuthors[(seed + i) % reviewAuthors.length];
    const rating = i === 0 ? 5 : 4 + ((seed + i) % 2);
    out.push({
      id: `${productId}-rev-${i}`, productId, author: a.name, location: a.location, rating,
      title: reviewTitles[(seed + i) % reviewTitles.length], comment: reviewBodies[(seed + i) % reviewBodies.length],
      date: new Date(2025, (seed + i) % 12, ((seed + i) % 27) + 1).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      verified: true,
    });
  }
  return out;
}

// ── Blogs ─────────────────────────────────────────────────────────────────────
export const blogs: Blog[] = [
  { id: 'b-1', slug: 'art-of-indian-woodcraft', title: 'The Living Art of Indian Woodcraft', excerpt: 'From the walnut carvers of Kashmir to the brass inlay of Lucknow — meet the karigars behind every Made Royale piece.', category: 'Craftsmanship', author: 'Made Royale Studio', date: '12 Jun 2026', readTime: '6 min read', image: '', content: ['Every piece of furniture we make begins not in a factory, but in the hands of a karigar whose family has practised the craft for generations.', 'In the workshops of Saharanpur and Jodhpur, joinery is still cut by eye and finished by feel. This is what gives a Made Royale piece its soul — the subtle irregularities that machine production can never replicate.', 'When you choose handcrafted furniture, you are not just buying an object. You are commissioning an heirloom, and keeping a centuries-old tradition alive.'] },
  { id: 'b-2', slug: 'styling-the-royal-living-room', title: 'How to Style a Royal Yet Liveable Living Room', excerpt: 'Layering velvet, brass and marble without tipping into excess — a designer’s guide to understated grandeur.', category: 'Interior Styling', author: 'Ishita Kapoor', date: '28 May 2026', readTime: '5 min read', image: '', content: ['Royal does not mean crowded. The secret to grandeur is restraint — one hero piece, supported by quieter companions.', 'Anchor the room with a statement sofa such as the Udaipur Chesterfield, then let a marble-and-brass coffee table and a hand-knotted rug do the supporting work.', 'Keep your palette to three tones: a jewel colour, a warm neutral, and a metallic accent. Repeat them across the room for a cohesive, curated feel.'] },
  { id: 'b-3', slug: 'caring-for-solid-wood-furniture', title: 'Caring for Solid Wood Furniture in Indian Climates', excerpt: 'Humidity, monsoon and sunlight — a practical care guide to keep your teak and Sheesham pristine for decades.', category: 'Care & Maintenance', author: 'Made Royale Studio', date: '14 May 2026', readTime: '4 min read', image: '', content: ['Solid wood is a living material — it breathes with the seasons. A little care keeps it beautiful for generations.', 'Dust weekly with a soft, dry cloth, and apply a wood conditioner twice a year. Keep pieces out of direct sunlight and away from air-conditioning vents to prevent drying.', 'During monsoon, ensure good ventilation and wipe away any moisture promptly. Never place hot vessels directly on wood or marble surfaces.'] },
  { id: 'b-4', slug: 'maharaja-collection-story', title: 'Inside the Maharaja Collection', excerpt: 'The inspiration, the materials, and the months of work behind our most opulent line of furniture.', category: 'Collections', author: 'Made Royale Studio', date: '02 May 2026', readTime: '7 min read', image: '', content: ['The Maharaja Collection is our love letter to the palaces of Rajasthan and the Deccan.', 'Each piece is built from solid teak or Sheesham, finished with genuine Makrana marble and hand-cut brass. Nothing is veneered where it can be solid, and nothing is stamped where it can be carved.', 'Because every piece is made to order, no two are ever identical — which is exactly the point of true luxury.'] },
  { id: 'b-5', slug: 'small-spaces-big-luxury', title: 'Big Luxury for Small Spaces', excerpt: 'You do not need a palace to live like royalty. Multi-functional, space-smart pieces for compact urban homes.', category: 'Interior Styling', author: 'Kabir Nair', date: '18 Apr 2026', readTime: '5 min read', image: '', content: ['Luxury and small spaces are not opposites. The trick is choosing pieces that work harder.', 'A sofa-cum-bed, nesting side tables and a lift-up storage bed give you flexibility without sacrificing style.', 'Use mirrors and warm lighting to expand the sense of space, and keep the floor visible with legged furniture rather than boxy, floor-hugging designs.'] },
  { id: 'b-6', slug: 'choosing-the-right-dining-set', title: 'Choosing the Right Dining Set for Your Home', excerpt: 'Marble or wood? Four seats or six? A simple framework to pick a dining set you will love for years.', category: 'Buying Guide', author: 'Made Royale Studio', date: '30 Mar 2026', readTime: '4 min read', image: '', content: ['Start with how you actually live. A family that hosts often will value a six-seater; a couple in a compact flat may be happier with a nimble four-seater.', 'Marble tops bring drama and are wonderfully cool, but need sealing; solid wood is warmer and more forgiving. Choose the material that fits your lifestyle, not just the photograph.', 'Finally, leave at least 90 cm of clearance around the table so chairs can be pulled out comfortably.'] },
];

// ── Coupons ─────────────────────────────────────────────────────────────────
export const coupons: Coupon[] = [
  { code: 'ROYALE10', type: 'percent', value: 10, minOrder: 0, maxDiscount: 15000, description: '10% off (up to ₹15,000)' },
  { code: 'MAHARAJA', type: 'flat', value: 20000, minOrder: 150000, description: '₹20,000 off on orders above ₹1,50,000' },
  { code: 'WELCOME5000', type: 'flat', value: 5000, minOrder: 50000, description: '₹5,000 off on orders above ₹50,000' },
];

export function validateCoupon(code: string, orderAmount: number): { valid: boolean; discount: number; message: string; coupon?: Coupon } {
  const coupon = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
  if (!coupon) return { valid: false, discount: 0, message: 'Invalid coupon code' };
  if (orderAmount < coupon.minOrder) return { valid: false, discount: 0, message: `Minimum order of ${formatINR(coupon.minOrder)} required` };
  let discount = coupon.type === 'percent' ? Math.round((orderAmount * coupon.value) / 100) : coupon.value;
  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  return { valid: true, discount, message: `Coupon applied — you saved ${formatINR(discount)}`, coupon };
}

// ── Query helpers ─────────────────────────────────────────────────────────────
export function getCategory(slug: string) { return categories.find((c) => c.slug === slug); }
export function getBlog(slug: string) { return blogs.find((b) => b.slug === slug); }
export function getProduct(slug: string) { return products.find((p) => p.slug === slug); }
export function getProductById(id: string) { return products.find((p) => p.id === id); }
export function getFeatured() { return products.filter((p) => p.isFeatured); }

export function getRelated(product: Product): Product[] {
  const ids = product.relatedIds || [];
  const explicit = ids.map((id) => getProductById(id)).filter((p): p is Product => !!p);
  if (explicit.length >= 4) return explicit.slice(0, 4);
  const fillers = products.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id && !ids.includes(p.id));
  return [...explicit, ...fillers].slice(0, 4);
}
export function getUpsell(product: Product): Product[] {
  return (product.upsellIds || []).map((id) => getProductById(id)).filter((p): p is Product => !!p).slice(0, 4);
}

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
export interface ProductFilter { category?: string; sub?: string; collection?: string; search?: string; minPrice?: number; maxPrice?: number; sort?: SortKey; }

export function filterProducts(filter: ProductFilter): Product[] {
  let list = [...products];
  if (filter.category) list = list.filter((p) => p.categorySlug === filter.category);
  if (filter.sub) list = list.filter((p) => p.subcategorySlug === filter.sub);
  if (filter.collection) list = list.filter((p) => p.collection === filter.collection);
  if (typeof filter.minPrice === 'number') list = list.filter((p) => p.price >= filter.minPrice!);
  if (typeof filter.maxPrice === 'number') list = list.filter((p) => p.price <= filter.maxPrice!);
  if (filter.search) {
    const q = filter.search.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q)));
  }
  switch (filter.sort) {
    case 'price-asc': list.sort((a, b) => a.price - b.price); break;
    case 'price-desc': list.sort((a, b) => b.price - a.price); break;
    case 'rating': list.sort((a, b) => b.rating - a.rating); break;
    case 'newest': list.sort((a, b) => (b.badge === 'New Arrival' ? 1 : 0) - (a.badge === 'New Arrival' ? 1 : 0)); break;
    default: list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }
  return list;
}

export const priceBounds = { min: Math.min(...products.map((p) => p.price)), max: Math.max(...products.map((p) => p.price)) };

// EMI (no-cost, 12 months) helper for product pages
export function emiPerMonth(price: number, months = 12): number { return Math.round(price / months); }

// Care instructions derived from a product's material
export function careFor(material: string): string[] {
  const m = material.toLowerCase();
  const care: string[] = [];
  if (/wood|teak|sheesham|walnut|mango|rosewood/.test(m)) care.push('Dust weekly with a soft, dry cloth', 'Apply a wood conditioner twice a year', 'Keep away from direct sunlight & AC vents');
  if (/velvet|linen|fabric|boucle/.test(m)) care.push('Vacuum the upholstery gently every fortnight', 'Blot spills immediately — never rub');
  if (/leather/.test(m)) care.push('Wipe with a dry cloth; condition twice a year', 'Avoid direct heat & sharp objects');
  if (/marble/.test(m)) care.push('Reseal the marble surface annually', 'Use coasters; wipe spills promptly to avoid stains');
  if (/brass|metal/.test(m)) care.push('Polish brass gently with a dry microfibre cloth');
  if (/silk|wool/.test(m)) care.push('Professional dry-clean only', 'Rotate periodically for even wear');
  if (!care.length) care.push('Dust regularly with a soft, dry cloth', 'Avoid harsh chemical cleaners');
  return care;
}

export function boxContentsFor(name: string): string[] {
  return [`1 × ${name}`, 'Assembly hardware & tools (where required)', 'Care guide & warranty card', 'Made Royale certificate of authenticity'];
}

export const bankOffers = [
  { icon: 'bank', text: '10% instant discount on HDFC & ICICI Bank Credit Cards' },
  { icon: 'gift', text: 'Use code ROYALE10 for 10% off (up to ₹15,000)' },
  { icon: 'receipt', text: 'No-Cost EMI from all major banks on orders above ₹15,000' },
] as const;
