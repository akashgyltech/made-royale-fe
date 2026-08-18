'use client';
import { createContext, useCallback, useContext, useRef, useState } from 'react';
const ToastContext = createContext({ toast: () => { } });
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const idRef = useRef(0);
    const toast = useCallback((message, variant = 'success') => {
        const id = ++idRef.current;
        setToasts((p) => [...p, { id, message, variant }]);
        setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 2600);
    }, []);
    return (<ToastContext.Provider value={{ toast }}>
      {children}
      <div className="mr-toast-stack" aria-live="polite">
        {toasts.map((t) => (<div key={t.id} className={`mr-toast mr-toast--${t.variant}`}>
            <span className="mr-toast-glyph">{t.variant === 'error' ? '!' : t.variant === 'info' ? 'i' : '✓'}</span>
            <span>{t.message}</span>
          </div>))}
      </div>
    </ToastContext.Provider>);
}
export function useToast() { return useContext(ToastContext); }
