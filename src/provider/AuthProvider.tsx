'use client';
import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi, profileApi } from '@/lib/store-api';
import { getAccessToken, clearTokens } from '@/lib/api';
import type { BackendCustomer } from '@/types/backend';

export type User = BackendCustomer;
type AuthTab = 'login' | 'register' | 'forgot';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isInitializing: boolean;
  authModalOpen: boolean;
  authModalTab: AuthTab;
  openAuthModal: (tab?: AuthTab) => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<void>;
  sendOtp: (identifier: string, purpose: 'registration' | 'password_reset') => Promise<{ devOtp?: string; delivered: boolean }>;
  register: (payload: { name: string; email: string; phone?: string; password: string; otp: string }) => Promise<void>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const noop = async () => { /* no-op default */ };
const AuthContext = createContext<AuthContextType>({
  user: null, isLoggedIn: false, isInitializing: true, authModalOpen: false, authModalTab: 'login',
  openAuthModal: () => {}, closeAuthModal: () => {},
  login: noop, sendOtp: async () => ({ delivered: false }), register: noop, resetPassword: noop, logout: noop, refreshUser: noop,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<AuthTab>('login');

  const refreshUser = useCallback(async () => {
    if (!getAccessToken()) { setUser(null); return; }
    try {
      const me = await profileApi.getProfile();
      setUser(me);
    } catch {
      clearTokens();
      setUser(null);
    }
  }, []);

  useEffect(() => { refreshUser().finally(() => setIsInitializing(false)); }, [refreshUser]);

  const openAuthModal = useCallback((tab: AuthTab = 'login') => {
    setAuthModalTab(tab); setAuthModalOpen(true);
    if (typeof document !== 'undefined') document.body.style.overflow = 'hidden';
  }, []);
  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
    if (typeof document !== 'undefined') document.body.style.overflow = '';
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const u = await authApi.login({ email, password });
    setUser(u);
    closeAuthModal();
  }, [closeAuthModal]);

  const sendOtp = useCallback(async (identifier: string, purpose: 'registration' | 'password_reset') => {
    return authApi.sendOtp(identifier, purpose, 'email');
  }, []);

  const register = useCallback(async (payload: { name: string; email: string; phone?: string; password: string; otp: string }) => {
    const u = await authApi.register(payload);
    setUser(u);
    closeAuthModal();
  }, [closeAuthModal]);

  const resetPassword = useCallback(async (email: string, otp: string, newPassword: string) => {
    await authApi.resetPassword(email, otp, newPassword);
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, isLoggedIn: !!user, isInitializing, authModalOpen, authModalTab,
      openAuthModal, closeAuthModal, login, sendOtp, register, resetPassword, logout, refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() { return useContext(AuthContext); }
