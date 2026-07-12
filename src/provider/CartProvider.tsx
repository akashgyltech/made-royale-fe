'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { useToast } from './ToastProvider';
import { getProductById, Product } from '@/data/catalog';

const KEY = 'mr_cart';

export interface CartLine { productId: string; qty: number; color?: string; }
export interface ResolvedCartLine extends CartLine { key: string; product: Product; lineTotal: number; }

interface CartContextType {
  lines: CartLine[]; resolved: ResolvedCartLine[]; count: number; subtotal: number; savings: number;
  addToCart: (id: string, qty?: number, color?: string) => void;
  updateQty: (key: string, qty: number) => void; removeLine: (key: string) => void; clearCart: () => void;
  isDrawerOpen: boolean; openDrawer: () => void; closeDrawer: () => void;
}
const CartContext = createContext<CartContextType>({
  lines: [], resolved: [], count: 0, subtotal: 0, savings: 0,
  addToCart: () => {}, updateQty: () => {}, removeLine: () => {}, clearCart: () => {},
  isDrawerOpen: false, openDrawer: () => {}, closeDrawer: () => {},
});

const lineKey = (id: string, color?: string) => `${id}|${color ?? ''}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => { try { const r = localStorage.getItem(KEY); if (r) setLines(JSON.parse(r)); } catch { /* ignore */ } }, []);
  const persist = useCallback((next: CartLine[]) => { setLines(next); try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ } }, []);

  const addToCart = useCallback((id: string, qty = 1, color?: string) => {
    const k = lineKey(id, color);
    const existing = lines.find((l) => lineKey(l.productId, l.color) === k);
    persist(existing ? lines.map((l) => (lineKey(l.productId, l.color) === k ? { ...l, qty: l.qty + qty } : l)) : [...lines, { productId: id, qty, color }]);
    const p = getProductById(id);
    toast(`${p?.name ?? 'Item'} added to cart`);
    setDrawerOpen(true);
  }, [lines, persist, toast]);

  const updateQty = useCallback((key: string, qty: number) => { if (qty < 1) return; persist(lines.map((l) => (lineKey(l.productId, l.color) === key ? { ...l, qty } : l))); }, [lines, persist]);
  const removeLine = useCallback((key: string) => persist(lines.filter((l) => lineKey(l.productId, l.color) !== key)), [lines, persist]);
  const clearCart = useCallback(() => persist([]), [persist]);

  const resolved = useMemo<ResolvedCartLine[]>(() => lines.map((l) => {
    const product = getProductById(l.productId);
    if (!product) return null;
    return { ...l, key: lineKey(l.productId, l.color), product, lineTotal: product.price * l.qty };
  }).filter((l): l is ResolvedCartLine => l !== null), [lines]);

  const count = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);
  const subtotal = useMemo(() => resolved.reduce((s, l) => s + l.lineTotal, 0), [resolved]);
  const savings = useMemo(() => resolved.reduce((s, l) => s + (l.product.comparePrice - l.product.price) * l.qty, 0), [resolved]);

  return (
    <CartContext.Provider value={{ lines, resolved, count, subtotal, savings, addToCart, updateQty, removeLine, clearCart, isDrawerOpen, openDrawer: () => setDrawerOpen(true), closeDrawer: () => setDrawerOpen(false) }}>
      {children}
    </CartContext.Provider>
  );
}
export function useCart() { return useContext(CartContext); }
