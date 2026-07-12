'use client';
import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from './ToastProvider';
import { getProductById } from '@/data/catalog';

const KEY = 'mr_wishlist';

interface WishlistContextType {
  ids: string[]; count: number; has: (id: string) => boolean;
  toggle: (id: string) => void; remove: (id: string) => void; clear: () => void;
}
const WishlistContext = createContext<WishlistContextType>({ ids: [], count: 0, has: () => false, toggle: () => {}, remove: () => {}, clear: () => {} });

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const { toast } = useToast();
  useEffect(() => { try { const r = localStorage.getItem(KEY); if (r) setIds(JSON.parse(r)); } catch { /* ignore */ } }, []);
  const persist = useCallback((next: string[]) => { setIds(next); try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ } }, []);
  const has = useCallback((id: string) => ids.includes(id), [ids]);
  const toggle = useCallback((id: string) => {
    const exists = ids.includes(id);
    persist(exists ? ids.filter((x) => x !== id) : [...ids, id]);
    const p = getProductById(id);
    toast(exists ? 'Removed from wishlist' : `${p?.name ?? 'Item'} added to wishlist`, exists ? 'info' : 'success');
  }, [ids, persist, toast]);
  const remove = useCallback((id: string) => persist(ids.filter((x) => x !== id)), [ids, persist]);
  const clear = useCallback(() => persist([]), [persist]);
  return <WishlistContext.Provider value={{ ids, count: ids.length, has, toggle, remove, clear }}>{children}</WishlistContext.Provider>;
}
export function useWishlist() { return useContext(WishlistContext); }
