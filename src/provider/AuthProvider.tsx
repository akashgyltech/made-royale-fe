'use client';
import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';

// Self-contained mock auth for the demo (no backend). Persists a user in
// localStorage so login/profile/checkout prefill all work. Replace the mock
// login/register bodies with real API calls when the backend is ready.

export interface User { name: string; email: string; phone?: string; }

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  authModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; phone?: string; password: string }) => Promise<void>;
  logout: () => void;
}

const KEY = 'mr_user';
const AuthContext = createContext<AuthContextType>({
  user: null, isLoggedIn: false, authModalOpen: false, authModalTab: 'login',
  openAuthModal: () => {}, closeAuthModal: () => {}, login: async () => {}, register: async () => {}, logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  useEffect(() => { try { const r = localStorage.getItem(KEY); if (r) setUser(JSON.parse(r)); } catch { /* ignore */ } }, []);

  const openAuthModal = useCallback((tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab); setAuthModalOpen(true); document.body.style.overflow = 'hidden';
  }, []);
  const closeAuthModal = useCallback(() => { setAuthModalOpen(false); document.body.style.overflow = ''; }, []);

  const persist = (u: User) => { setUser(u); try { localStorage.setItem(KEY, JSON.stringify(u)); } catch { /* ignore */ } };

  const login = useCallback(async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 600));
    persist({ name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), email });
    closeAuthModal();
  }, [closeAuthModal]);

  const register = useCallback(async (payload: { name: string; email: string; phone?: string; password: string }) => {
    await new Promise((r) => setTimeout(r, 700));
    persist({ name: payload.name, email: payload.email, phone: payload.phone });
    closeAuthModal();
  }, [closeAuthModal]);

  const logout = useCallback(() => { setUser(null); try { localStorage.removeItem(KEY); } catch { /* ignore */ } }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, authModalOpen, authModalTab, openAuthModal, closeAuthModal, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() { return useContext(AuthContext); }
