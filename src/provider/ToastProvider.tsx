'use client';
import { createContext, useCallback, useContext, useRef, useState, ReactNode } from 'react';

interface Toast { id: number; message: string; variant: 'success' | 'info' | 'error'; }
interface ToastContextType { toast: (message: string, variant?: Toast['variant']) => void; }

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);
  const toast = useCallback((message: string, variant: Toast['variant'] = 'success') => {
    const id = ++idRef.current;
    setToasts((p) => [...p, { id, message, variant }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 2600);
  }, []);
  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="mr-toast-stack" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`mr-toast mr-toast--${t.variant}`}>
            <span className="mr-toast-glyph">{t.variant === 'error' ? '!' : t.variant === 'info' ? 'i' : '✓'}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
export function useToast() { return useContext(ToastContext); }
