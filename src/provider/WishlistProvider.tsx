'use client';
import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from './ToastProvider';
import { useAuth } from './AuthProvider';
import { profileApi } from '@/lib/store-api';
import { adaptProduct } from '@/lib/adapters';
import type { Product } from '@/data/catalog';

// The backend wishlist is server-side and tied to the authenticated customer (there is
// no guest-wishlist endpoint) — so unlike the cart, this can't work client-only while
// logged out. Toggling while logged out opens the auth modal instead of silently
// keeping a separate local-only list that would never match the real account.
interface WishlistContextType {
  ids: string[]; products: Product[]; count: number; has: (id: string) => boolean;
  toggle: (id: string) => void; remove: (id: string) => void; clear: () => void;
}
const WishlistContext = createContext<WishlistContextType>({
  ids: [], products: [], count: 0, has: () => false, toggle: () => {}, remove: () => {}, clear: () => {},
});

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();
  const { isLoggedIn, openAuthModal } = useAuth();

  const refresh = useCallback(async () => {
    if (!isLoggedIn) { setProducts([]); return; }
    try {
      const list = await profileApi.getWishlist();
      setProducts(list.map(adaptProduct));
    } catch { /* ignore */ }
  }, [isLoggedIn]);

  useEffect(() => { void refresh(); }, [refresh]);

  const ids = products.map((p) => p.id);
  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback(async (id: string) => {
    if (!isLoggedIn) { openAuthModal('login'); return; }
    const exists = ids.includes(id);
    try {
      if (exists) {
        await profileApi.removeFromWishlist(id);
        setProducts((p) => p.filter((x) => x.id !== id));
        toast('Removed from wishlist', 'info');
      } else {
        await profileApi.addToWishlist(id);
        toast('Added to wishlist', 'success');
        void refresh();
      }
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Something went wrong', 'error');
    }
  }, [ids, isLoggedIn, openAuthModal, refresh, toast]);

  const remove = useCallback((id: string) => { void toggle(id); }, [toggle]);

  const clear = useCallback(async () => {
    if (!isLoggedIn || ids.length === 0) return;
    try {
      await Promise.all(ids.map((id) => profileApi.removeFromWishlist(id)));
      setProducts([]);
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Something went wrong', 'error');
    }
  }, [ids, isLoggedIn, toast]);

  return <WishlistContext.Provider value={{ ids, products, count: ids.length, has, toggle, remove, clear: () => void clear() }}>{children}</WishlistContext.Provider>;
}
export function useWishlist() { return useContext(WishlistContext); }
