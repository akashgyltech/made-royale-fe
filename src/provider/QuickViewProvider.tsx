'use client';
import { createContext, useCallback, useContext, useState, ReactNode } from 'react';
import { Product } from '@/data/catalog';
import ProductModal from '@/components/modal/product-modal';

interface QuickViewContextType { open: (product: Product) => void; close: () => void; }
const QuickViewContext = createContext<QuickViewContextType>({ open: () => {}, close: () => {} });

export function QuickViewProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [show, setShow] = useState(false);
  const open = useCallback((p: Product) => { setProduct(p); setShow(true); }, []);
  const close = useCallback(() => setShow(false), []);
  return (
    <QuickViewContext.Provider value={{ open, close }}>
      {children}
      <ProductModal show={show} onClose={close} product={product} />
    </QuickViewContext.Provider>
  );
}
export function useQuickView() { return useContext(QuickViewContext); }
