'use client';
import { createContext, useCallback, useContext, useState } from 'react';
import ProductModal from '@/components/modal/product-modal';
const QuickViewContext = createContext({ open: () => { }, close: () => { } });
export function QuickViewProvider({ children }) {
    const [product, setProduct] = useState(null);
    const [show, setShow] = useState(false);
    const open = useCallback((p) => { setProduct(p); setShow(true); }, []);
    const close = useCallback(() => setShow(false), []);
    return (<QuickViewContext.Provider value={{ open, close }}>
      {children}
      <ProductModal show={show} onClose={close} product={product}/>
    </QuickViewContext.Provider>);
}
export function useQuickView() { return useContext(QuickViewContext); }
