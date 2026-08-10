// Typed calls against made-royale-be's /api/v1/store/* surface. Thin wrappers over
// apiFetch — see src/lib/api.ts for auth/refresh/error-envelope handling.
import { apiFetch, setTokens, clearTokens } from './api';
import type {
  BackendPage, BackendCategory, BackendProduct, BackendCustomer, BackendAuthTokens,
  BackendOrder, BackendQuote, BackendReview, BackendBlog, BackendCartItemInput, BackendAddress,
} from '@/types/backend';

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  sendOtp: (identifier: string, purpose: string, identifierType: 'email' | 'phone' = 'email') =>
    apiFetch<{ delivered: boolean; channel: string | null; devOtp?: string }>('/store/auth/send-otp', {
      method: 'POST',
      body: { identifier, identifierType, purpose },
    }),

  register: async (payload: { name: string; email?: string; phone?: string; password: string; otp: string }) => {
    const data = await apiFetch<{ user: BackendCustomer; tokens: BackendAuthTokens }>('/store/auth/register', {
      method: 'POST',
      body: payload,
    });
    setTokens(data.tokens);
    return data.user;
  },

  login: async (payload: { email?: string; phone?: string; password: string }) => {
    const data = await apiFetch<{ user: BackendCustomer; tokens: BackendAuthTokens }>('/store/auth/login', {
      method: 'POST',
      body: payload,
    });
    setTokens(data.tokens);
    return data.user;
  },

  loginWithOtp: async (identifier: string, otp: string, identifierType: 'email' | 'phone' = 'email') => {
    const data = await apiFetch<{ user: BackendCustomer; tokens: BackendAuthTokens }>('/store/auth/login/otp', {
      method: 'POST',
      body: { identifier, identifierType, otp },
    });
    setTokens(data.tokens);
    return data.user;
  },

  forgotPassword: (email: string) =>
    apiFetch<string>('/store/auth/forgot-password', { method: 'POST', body: { email } }),

  resetPassword: (email: string, otp: string, newPassword: string) =>
    apiFetch<string>('/store/auth/reset-password', { method: 'POST', body: { email, otp, newPassword } }),

  logout: async () => {
    try {
      await apiFetch<string>('/store/auth/logout', { method: 'POST', auth: true });
    } finally {
      clearTokens();
    }
  },
};

// ── Profile ──────────────────────────────────────────────────────────────────
export const profileApi = {
  getProfile: () => apiFetch<BackendCustomer>('/store/profile', { auth: true }),

  updateProfile: (body: { name?: string; gstInfo?: BackendCustomer['gstInfo'] }) =>
    apiFetch<BackendCustomer>('/store/profile', { method: 'PUT', body, auth: true }),

  updateAvatar: (file: File) => {
    const fd = new FormData();
    fd.append('avatar', file);
    return apiFetch<BackendCustomer>('/store/profile', { method: 'PUT', formData: fd, auth: true });
  },

  changePassword: (currentPassword: string, newPassword: string) =>
    apiFetch<string>('/store/profile/change-password', { method: 'PUT', body: { currentPassword, newPassword }, auth: true }),

  getAddresses: () => apiFetch<BackendAddress[]>('/store/profile/addresses', { auth: true }),
  addAddress: (address: Omit<BackendAddress, 'id'>) =>
    apiFetch<BackendAddress[]>('/store/profile/addresses', { method: 'POST', body: address, auth: true }),
  updateAddress: (addressId: string, address: Partial<Omit<BackendAddress, 'id'>>) =>
    apiFetch<BackendAddress[]>(`/store/profile/addresses/${addressId}`, { method: 'PUT', body: address, auth: true }),
  deleteAddress: (addressId: string) =>
    apiFetch<BackendAddress[]>(`/store/profile/addresses/${addressId}`, { method: 'DELETE', auth: true }),
  setDefaultAddress: (addressId: string) =>
    apiFetch<BackendAddress[]>(`/store/profile/addresses/${addressId}/default`, { method: 'PUT', auth: true }),

  getWishlist: () => apiFetch<BackendProduct[]>('/store/profile/wishlist', { auth: true }),
  addToWishlist: (productId: string) =>
    apiFetch<string[]>(`/store/profile/wishlist/${productId}`, { method: 'POST', auth: true }),
  removeFromWishlist: (productId: string) =>
    apiFetch<string[]>(`/store/profile/wishlist/${productId}`, { method: 'DELETE', auth: true }),
};

// ── Products & Categories ────────────────────────────────────────────────────
export interface ProductQuery {
  category?: string; subcategory?: string; brand?: string; tag?: string; isFeatured?: boolean;
  minPrice?: number; maxPrice?: number; search?: string;
  limit?: number; page?: number; sortBy?: string;
}

export const productApi = {
  getProducts: (query: ProductQuery = {}) =>
    apiFetch<BackendPage<BackendProduct>>('/store/products', { params: query as Record<string, string | number | boolean | undefined> }),

  getProductBySlug: (slug: string) => apiFetch<BackendProduct>(`/store/products/slug/${slug}`),
  getProductById: (id: string) => apiFetch<BackendProduct>(`/store/products/${id}`),

  getCategories: (parent?: string | null) =>
    apiFetch<BackendCategory[]>('/store/products/categories', {
      params: parent === null ? { parent: 'null' } : parent ? { parent } : undefined,
    }),
  getCategoryBySlug: (slug: string) => apiFetch<BackendCategory & { subcategories: BackendCategory[] }>(`/store/products/categories/${slug}`),
};

// ── Shipping ─────────────────────────────────────────────────────────────────
export const shippingApi = {
  getMethods: (subtotal = 0) =>
    apiFetch<{ key: string; label: string; etaDays: string; charge: number }[]>('/store/shipping/methods', {
      params: { subtotal },
    }),
};

// ── Orders ───────────────────────────────────────────────────────────────────
export interface OrderInput {
  items: BackendCartItemInput[];
  billingAddress: Omit<BackendAddress, 'id' | 'label' | 'isDefault'>;
  shippingAddress: Omit<BackendAddress, 'id' | 'label' | 'isDefault'>;
  couponCode?: string;
  shippingMethod?: string;
  gstin?: string;
  businessName?: string;
  paymentMethod?: 'cod' | 'razorpay';
  notes?: string;
}

export const orderApi = {
  getQuote: (body: Pick<OrderInput, 'items' | 'shippingAddress' | 'couponCode' | 'shippingMethod'>) =>
    apiFetch<BackendQuote>('/store/orders/quote', { method: 'POST', body, auth: true }),

  placeOrder: (body: OrderInput) => apiFetch<BackendOrder>('/store/orders', { method: 'POST', body, auth: true }),

  getMyOrders: (page = 1, limit = 10, status?: string) =>
    apiFetch<BackendPage<BackendOrder>>('/store/orders', { auth: true, params: { page, limit, status } }),

  getOrderById: (orderId: string) => apiFetch<BackendOrder>(`/store/orders/${orderId}`, { auth: true }),
  getOrderByNumber: (orderNumber: string) => apiFetch<BackendOrder>(`/store/orders/number/${orderNumber}`, { auth: true }),

  cancelOrder: (orderId: string, reason?: string) =>
    apiFetch<BackendOrder>(`/store/orders/${orderId}/cancel`, { method: 'PUT', body: { reason }, auth: true }),

  validateCoupon: (couponCode: string, orderAmount: number) =>
    apiFetch<{ code: string; type: string; value: number; discount: number; description: string }>('/store/orders/validate-coupon', {
      method: 'POST',
      body: { couponCode, orderAmount },
      auth: true,
    }),
};

// ── Payment (Razorpay) ───────────────────────────────────────────────────────
export const paymentApi = {
  createRazorpayOrder: (orderId: string) =>
    apiFetch<{ razorpayOrderId: string; amount: number; currency: string; keyId: string; orderNumber: string }>(
      '/store/payment/razorpay/create-order',
      { method: 'POST', body: { orderId }, auth: true }
    ),

  verifyPayment: (payload: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string; orderId: string }) =>
    apiFetch<{ message: string; orderId: string }>('/store/payment/razorpay/verify', { method: 'POST', body: payload, auth: true }),
};

// ── Reviews ──────────────────────────────────────────────────────────────────
export const reviewApi = {
  getProductReviews: (productId: string, page = 1, limit = 10) =>
    apiFetch<BackendPage<BackendReview>>(`/store/reviews/product/${productId}`, { params: { page, limit } }),

  createReview: (body: { productId: string; orderId?: string; rating: number; title?: string; comment: string; images?: File[] }) => {
    const fd = new FormData();
    fd.append('productId', body.productId);
    if (body.orderId) fd.append('orderId', body.orderId);
    fd.append('rating', String(body.rating));
    if (body.title) fd.append('title', body.title);
    fd.append('comment', body.comment);
    (body.images || []).forEach((f) => fd.append('images', f));
    return apiFetch<BackendReview>('/store/reviews', { method: 'POST', formData: fd, auth: true });
  },

  updateReview: (reviewId: string, body: { rating?: number; title?: string; comment?: string }) =>
    apiFetch<BackendReview>(`/store/reviews/${reviewId}`, { method: 'PUT', body, auth: true }),

  deleteReview: (reviewId: string) => apiFetch<string>(`/store/reviews/${reviewId}`, { method: 'DELETE', auth: true }),
};

// ── CMS & Blog ───────────────────────────────────────────────────────────────
export const cmsApi = {
  getByKey: <T = unknown>(key: string) => apiFetch<T>(`/store/cms/${key}`),
  getByType: (type: string) => apiFetch<{ key: string; type: string; label?: string; content: unknown }[]>(`/store/cms/type/${type}`),

  getBlogs: (query: { page?: number; limit?: number; category?: string; tag?: string; search?: string } = {}) =>
    apiFetch<BackendPage<BackendBlog>>('/store/cms/blogs', { params: query }),
  getBlogBySlug: (slug: string) => apiFetch<BackendBlog>(`/store/cms/blogs/${slug}`),
};
