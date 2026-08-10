// Mirrors made-royale-be response shapes exactly (see its Mongoose models + the
// toJSON plugin, which maps _id -> id and strips __v/createdAt/updatedAt/private fields).

export interface BackendPage<T> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface BackendImage {
  id: string;
  url: string;
  key?: string;
  alt?: string;
  isPrimary?: boolean;
  displayOrder?: number;
}

export interface BackendCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  tagline?: string;
  story?: { title?: string; body?: string };
  parent?: string | BackendCategory | null;
  image?: string;
  banner?: string;
  isActive: boolean;
  displayOrder: number;
  seo?: { metaTitle?: string; metaDescription?: string; keywords?: string[] };
  subcategories?: BackendCategory[];
}

export interface BackendCustomizationOption {
  id: string;
  label: string;
  value: string;
  image?: string;
  priceModifier: number;
  isActive: boolean;
  displayOrder: number;
}

export interface BackendCustomization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type: 'select' | 'multiselect' | 'text' | 'number' | 'boolean' | 'color';
  unit?: string;
  options: BackendCustomizationOption[];
  isRequired: boolean;
  isActive: boolean;
  displayOrder: number;
}

export interface BackendProduct {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  images: BackendImage[];
  category: BackendCategory | string;
  subcategory?: BackendCategory | string;
  sku?: string;
  barcode?: string;
  price: number;
  comparePrice?: number;
  stock: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  weight?: number;
  dimensions?: { length?: number; width?: number; height?: number; unit?: string };
  customizations?: BackendCustomization[];
  gst?: { hsnCode?: string; rate: number };
  tags: string[];
  brand?: string;
  vendor?: string;
  isFeatured: boolean;
  isActive: boolean;
  isDeleted: boolean;
  seo?: { metaTitle?: string; metaDescription?: string; keywords?: string[] };
  ratings: { average: number; count: number };
}

export interface BackendAddress {
  id: string;
  label?: 'home' | 'work' | 'other';
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface BackendCustomer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  addresses: BackendAddress[];
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  isBanned: boolean;
  gstInfo?: { gstin?: string; businessName?: string; businessAddress?: string };
  wishlist: string[] | BackendProduct[];
  totalOrders: number;
  totalSpent: number;
}

export interface BackendAuthTokens {
  access: { token: string; expires: string };
  refresh: { token: string; expires: string };
}

export interface BackendOrderItemCustomization {
  groupId: string;
  groupName: string;
  groupSlug: string;
  optionLabel: string;
  optionValue: string;
  priceModifier: number;
}

export interface BackendOrderItem {
  id: string;
  product: string;
  name: string;
  sku?: string;
  image?: string;
  quantity: number;
  price: number;
  comparePrice?: number;
  customizations: BackendOrderItemCustomization[];
  gst: { hsnCode?: string; rate: number; amount: number };
  subtotal: number;
  total: number;
}

export interface BackendAddressSnapshot {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export type BackendOrderStatus =
  | 'pending' | 'confirmed' | 'processing' | 'ready_to_ship' | 'shipped'
  | 'out_for_delivery' | 'delivered' | 'cancelled' | 'return_requested' | 'returned' | 'refunded';

export interface BackendOrder {
  id: string;
  orderNumber: string;
  customer: string;
  items: BackendOrderItem[];
  billingAddress: BackendAddressSnapshot;
  shippingAddress: BackendAddressSnapshot;
  pricing: {
    subtotal: number;
    discount: number;
    couponCode?: string;
    couponDiscount: number;
    shippingMethod?: string;
    shippingCharge: number;
    taxableAmount: number;
    cgst: number;
    sgst: number;
    igst: number;
    totalGst: number;
    grandTotal: number;
  };
  gstDetails: { buyerGstin?: string; buyerBusinessName?: string; invoiceNumber: string; invoiceDate: string; isInterState: boolean };
  payment: {
    method: 'cod' | 'stripe' | 'razorpay';
    status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partial_refund';
    razorpayOrderId?: string;
    transactionId?: string;
    paidAt?: string;
    amount: number;
  };
  status: BackendOrderStatus;
  shipment: { carrier?: string; trackingNumber?: string; trackingUrl?: string; estimatedDelivery?: string; shippedAt?: string; deliveredAt?: string };
  statusHistory: { status: string; note?: string; updatedByType: string; updatedAt: string }[];
  notes: { customer?: string; admin?: string };
  cancellation?: { reason?: string; requestedAt?: string; processedAt?: string };
  createdAt?: string;
}

export interface BackendQuote {
  items: BackendOrderItem[];
  subtotal: number;
  couponCode?: string;
  couponDiscount: number;
  shippingMethod: string;
  shippingCharge: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalGst: number;
  isInterState: boolean;
  grandTotal: number;
  shippingMethods: { key: string; label: string; etaDays: string; charge: number }[];
}

export interface BackendReview {
  id: string;
  product: string;
  customer: { id: string; name: string } | string;
  order?: string;
  rating: number;
  title?: string;
  comment: string;
  images: { url: string; key?: string }[];
  isApproved: boolean;
  adminReply?: { message: string; repliedAt: string };
}

export interface BackendBlog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  thumbnail?: string;
  author?: { id: string; name: string } | string;
  category?: string;
  tags: string[];
  seo?: { metaTitle?: string; metaDescription?: string };
  isPublished: boolean;
  publishedAt?: string;
  views: number;
}

export interface BackendCartItemInput {
  productId: string;
  quantity: number;
  customizations?: { groupId: string; optionId: string }[];
}
