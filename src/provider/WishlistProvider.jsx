'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useToast } from './ToastProvider';
import { useAuth } from './AuthProvider';
import { profileApi } from '@/lib/store-api';
import { adaptProduct } from '@/lib/adapters';
const WishlistContext = createContext({
    ids: [], products: [], count: 0, has: () => false, toggle: () => { }, remove: () => { }, clear: () => { },
});
export function WishlistProvider({ children }) {
    const [products, setProducts] = useState([]);
    const { toast } = useToast();
    const { isLoggedIn, openAuthModal } = useAuth();
    const refresh = useCallback(async () => {
        if (!isLoggedIn) {
            setProducts([]);
            return;
        }
        try {
            const list = await profileApi.getWishlist();
            setProducts(list.map(adaptProduct));
        }
        catch { /* ignore */ }
    }, [isLoggedIn]);
    useEffect(() => { void refresh(); }, [refresh]);
    const ids = products.map((p) => p.id);
    const has = useCallback((id) => ids.includes(id), [ids]);
    const toggle = useCallback(async (id) => {
        if (!isLoggedIn) {
            openAuthModal('login');
            return;
        }
        const exists = ids.includes(id);
        try {
            if (exists) {
                await profileApi.removeFromWishlist(id);
                setProducts((p) => p.filter((x) => x.id !== id));
                toast('Removed from wishlist', 'info');
            }
            else {
                await profileApi.addToWishlist(id);
                toast('Added to wishlist', 'success');
                void refresh();
            }
        }
        catch (e) {
            toast(e instanceof Error ? e.message : 'Something went wrong', 'error');
        }
    }, [ids, isLoggedIn, openAuthModal, refresh, toast]);
    const remove = useCallback((id) => { void toggle(id); }, [toggle]);
    const clear = useCallback(async () => {
        if (!isLoggedIn || ids.length === 0)
            return;
        try {
            await Promise.all(ids.map((id) => profileApi.removeFromWishlist(id)));
            setProducts([]);
        }
        catch (e) {
            toast(e instanceof Error ? e.message : 'Something went wrong', 'error');
        }
    }, [ids, isLoggedIn, toast]);
    return <WishlistContext.Provider value={{ ids, products, count: ids.length, has, toggle, remove, clear: () => void clear() }}>{children}</WishlistContext.Provider>;
}
export function useWishlist() { return useContext(WishlistContext); }
