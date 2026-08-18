'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useToast } from './ToastProvider';
import { productApi } from '@/lib/store-api';
import { adaptProduct } from '@/lib/adapters';
const KEY = 'mr_cart';
const CartContext = createContext({
    lines: [], resolved: [], count: 0, subtotal: 0, savings: 0, isLoading: false,
    addToCart: () => { }, updateQty: () => { }, removeLine: () => { }, clearCart: () => { },
    isDrawerOpen: false, openDrawer: () => { }, closeDrawer: () => { },
});
const lineKey = (id, color) => `${id}|${color ?? ''}`;
export function CartProvider({ children }) {
    const [lines, setLines] = useState([]);
    const [productCache, setProductCache] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const { toast } = useToast();
    const inFlight = useRef(new Set());
    useEffect(() => { try {
        const r = localStorage.getItem(KEY);
        if (r)
            setLines(JSON.parse(r));
    }
    catch { /* ignore */ } }, []);
    const persist = useCallback((next) => { setLines(next); try {
        localStorage.setItem(KEY, JSON.stringify(next));
    }
    catch { /* ignore */ } }, []);
    const fetchProduct = useCallback(async (id) => {
        if (inFlight.current.has(id))
            return null;
        inFlight.current.add(id);
        setIsLoading(true);
        try {
            const bp = await productApi.getProductById(id);
            const product = adaptProduct(bp);
            setProductCache((c) => ({ ...c, [id]: product }));
            return product;
        }
        catch {
            setProductCache((c) => ({ ...c, [id]: null })); // null = fetched but unavailable (deleted/inactive)
            return null;
        }
        finally {
            inFlight.current.delete(id);
            setIsLoading(inFlight.current.size > 0);
        }
    }, []);
    // Resolve product data for any cart line not yet in the cache.
    useEffect(() => {
        const missing = [...new Set(lines.map((l) => l.productId))].filter((id) => !(id in productCache));
        missing.forEach((id) => { void fetchProduct(id); });
    }, [lines, productCache, fetchProduct]);
    const addToCart = useCallback((id, qty = 1, color) => {
        const k = lineKey(id, color);
        const existing = lines.find((l) => lineKey(l.productId, l.color) === k);
        persist(existing ? lines.map((l) => (lineKey(l.productId, l.color) === k ? { ...l, qty: l.qty + qty } : l)) : [...lines, { productId: id, qty, color }]);
        const cached = productCache[id];
        toast(cached ? `${cached.name} added to cart` : 'Item added to cart');
        setDrawerOpen(true);
    }, [lines, persist, productCache, toast]);
    const updateQty = useCallback((key, qty) => { if (qty < 1)
        return; persist(lines.map((l) => (lineKey(l.productId, l.color) === key ? { ...l, qty } : l))); }, [lines, persist]);
    const removeLine = useCallback((key) => persist(lines.filter((l) => lineKey(l.productId, l.color) !== key)), [lines, persist]);
    const clearCart = useCallback(() => persist([]), [persist]);
    const resolved = useMemo(() => lines.map((l) => {
        const product = productCache[l.productId];
        if (!product)
            return null;
        return { ...l, key: lineKey(l.productId, l.color), product, lineTotal: product.price * l.qty };
    }).filter((l) => l !== null), [lines, productCache]);
    const count = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);
    const subtotal = useMemo(() => resolved.reduce((s, l) => s + l.lineTotal, 0), [resolved]);
    const savings = useMemo(() => resolved.reduce((s, l) => s + (l.product.comparePrice - l.product.price) * l.qty, 0), [resolved]);
    return (<CartContext.Provider value={{ lines, resolved, count, subtotal, savings, isLoading, addToCart, updateQty, removeLine, clearCart, isDrawerOpen, openDrawer: () => setDrawerOpen(true), closeDrawer: () => setDrawerOpen(false) }}>
      {children}
    </CartContext.Provider>);
}
export function useCart() { return useContext(CartContext); }
