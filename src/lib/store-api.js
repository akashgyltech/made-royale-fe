// Typed calls against made-royale-be's /api/v1/store/* surface. Thin wrappers over
// apiFetch — see src/lib/api.ts for auth/refresh/error-envelope handling.
import { apiFetch, setTokens, clearTokens } from './api';
// ── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
    sendOtp: (identifier, purpose, identifierType = 'email') => apiFetch('/store/auth/send-otp', {
        method: 'POST',
        body: { identifier, identifierType, purpose },
    }),
    register: async (payload) => {
        const data = await apiFetch('/store/auth/register', {
            method: 'POST',
            body: payload,
        });
        setTokens(data.tokens);
        return data.user;
    },
    login: async (payload) => {
        const data = await apiFetch('/store/auth/login', {
            method: 'POST',
            body: payload,
        });
        setTokens(data.tokens);
        return data.user;
    },
    loginWithOtp: async (identifier, otp, identifierType = 'email') => {
        const data = await apiFetch('/store/auth/login/otp', {
            method: 'POST',
            body: { identifier, identifierType, otp },
        });
        setTokens(data.tokens);
        return data.user;
    },
    forgotPassword: (email) => apiFetch('/store/auth/forgot-password', { method: 'POST', body: { email } }),
    resetPassword: (email, otp, newPassword) => apiFetch('/store/auth/reset-password', { method: 'POST', body: { email, otp, newPassword } }),
    logout: async () => {
        try {
            await apiFetch('/store/auth/logout', { method: 'POST', auth: true });
        }
        finally {
            clearTokens();
        }
    },
};
// ── Profile ──────────────────────────────────────────────────────────────────
export const profileApi = {
    getProfile: () => apiFetch('/store/profile', { auth: true }),
    updateProfile: (body) => apiFetch('/store/profile', { method: 'PUT', body, auth: true }),
    updateAvatar: (file) => {
        const fd = new FormData();
        fd.append('avatar', file);
        return apiFetch('/store/profile', { method: 'PUT', formData: fd, auth: true });
    },
    changePassword: (currentPassword, newPassword) => apiFetch('/store/profile/change-password', { method: 'PUT', body: { currentPassword, newPassword }, auth: true }),
    getAddresses: () => apiFetch('/store/profile/addresses', { auth: true }),
    addAddress: (address) => apiFetch('/store/profile/addresses', { method: 'POST', body: address, auth: true }),
    updateAddress: (addressId, address) => apiFetch(`/store/profile/addresses/${addressId}`, { method: 'PUT', body: address, auth: true }),
    deleteAddress: (addressId) => apiFetch(`/store/profile/addresses/${addressId}`, { method: 'DELETE', auth: true }),
    setDefaultAddress: (addressId) => apiFetch(`/store/profile/addresses/${addressId}/default`, { method: 'PUT', auth: true }),
    getWishlist: () => apiFetch('/store/profile/wishlist', { auth: true }),
    addToWishlist: (productId) => apiFetch(`/store/profile/wishlist/${productId}`, { method: 'POST', auth: true }),
    removeFromWishlist: (productId) => apiFetch(`/store/profile/wishlist/${productId}`, { method: 'DELETE', auth: true }),
};
export const productApi = {
    getProducts: (query = {}) => apiFetch('/store/products', { params: query }),
    getProductBySlug: (slug) => apiFetch(`/store/products/slug/${slug}`),
    getProductById: (id) => apiFetch(`/store/products/${id}`),
    getCategories: (parent) => apiFetch('/store/products/categories', {
        params: parent === null ? { parent: 'null' } : parent ? { parent } : undefined,
    }),
    getShopCategories: () => apiFetch('/store/products/categories', { params: { showInShop: 'true' } }),
    getRoomCategories: () => apiFetch('/store/products/categories', { params: { showInRoom: 'true' } }),
    getCategoryBySlug: (slug) => apiFetch(`/store/products/categories/${slug}`),
};
// ── Shipping ─────────────────────────────────────────────────────────────────
export const shippingApi = {
    getMethods: (subtotal = 0) => apiFetch('/store/shipping/methods', {
        params: { subtotal },
    }),
};
export const orderApi = {
    getQuote: (body) => apiFetch('/store/orders/quote', { method: 'POST', body, auth: true }),
    placeOrder: (body) => apiFetch('/store/orders', { method: 'POST', body, auth: true }),
    getMyOrders: (page = 1, limit = 10, status) => apiFetch('/store/orders', { auth: true, params: { page, limit, status } }),
    getOrderById: (orderId) => apiFetch(`/store/orders/${orderId}`, { auth: true }),
    getOrderByNumber: (orderNumber) => apiFetch(`/store/orders/number/${orderNumber}`, { auth: true }),
    cancelOrder: (orderId, reason) => apiFetch(`/store/orders/${orderId}/cancel`, { method: 'PUT', body: { reason }, auth: true }),
    validateCoupon: (couponCode, orderAmount) => apiFetch('/store/orders/validate-coupon', {
        method: 'POST',
        body: { couponCode, orderAmount },
        auth: true,
    }),
};
// ── Payment (Razorpay) ───────────────────────────────────────────────────────
export const paymentApi = {
    createRazorpayOrder: (orderId) => apiFetch('/store/payment/razorpay/create-order', { method: 'POST', body: { orderId }, auth: true }),
    verifyPayment: (payload) => apiFetch('/store/payment/razorpay/verify', { method: 'POST', body: payload, auth: true }),
};
// ── Reviews ──────────────────────────────────────────────────────────────────
export const reviewApi = {
    getProductReviews: (productId, page = 1, limit = 10) => apiFetch(`/store/reviews/product/${productId}`, { params: { page, limit } }),
    createReview: (body) => {
        const fd = new FormData();
        fd.append('productId', body.productId);
        if (body.orderId)
            fd.append('orderId', body.orderId);
        fd.append('rating', String(body.rating));
        if (body.title)
            fd.append('title', body.title);
        fd.append('comment', body.comment);
        (body.images || []).forEach((f) => fd.append('images', f));
        return apiFetch('/store/reviews', { method: 'POST', formData: fd, auth: true });
    },
    updateReview: (reviewId, body) => apiFetch(`/store/reviews/${reviewId}`, { method: 'PUT', body, auth: true }),
    deleteReview: (reviewId) => apiFetch(`/store/reviews/${reviewId}`, { method: 'DELETE', auth: true }),
};
// ── CMS & Blog ───────────────────────────────────────────────────────────────
export const cmsApi = {
    getByKey: (key) => apiFetch(`/store/cms/${key}`),
    getByType: (type) => apiFetch(`/store/cms/type/${type}`),
    getBlogs: (query = {}) => apiFetch('/store/cms/blogs', { params: query }),
    getBlogBySlug: (slug) => apiFetch(`/store/cms/blogs/${slug}`),
};
