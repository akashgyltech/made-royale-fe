'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authApi, profileApi } from '@/lib/store-api';
import { getAccessToken, clearTokens } from '@/lib/api';
const noop = async () => { };
const AuthContext = createContext({
    user: null, isLoggedIn: false, isInitializing: true, authModalOpen: false, authModalTab: 'login',
    openAuthModal: () => { }, closeAuthModal: () => { },
    login: noop, sendOtp: async () => ({ delivered: false }), register: noop, resetPassword: noop, logout: noop, refreshUser: noop,
});
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isInitializing, setIsInitializing] = useState(true);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authModalTab, setAuthModalTab] = useState('login');
    const refreshUser = useCallback(async () => {
        if (!getAccessToken()) {
            setUser(null);
            return;
        }
        try {
            const me = await profileApi.getProfile();
            setUser(me);
        }
        catch {
            clearTokens();
            setUser(null);
        }
    }, []);
    useEffect(() => { refreshUser().finally(() => setIsInitializing(false)); }, [refreshUser]);
    const openAuthModal = useCallback((tab = 'login') => {
        setAuthModalTab(tab);
        setAuthModalOpen(true);
        if (typeof document !== 'undefined')
            document.body.style.overflow = 'hidden';
    }, []);
    const closeAuthModal = useCallback(() => {
        setAuthModalOpen(false);
        if (typeof document !== 'undefined')
            document.body.style.overflow = '';
    }, []);
    const login = useCallback(async (email, password) => {
        const u = await authApi.login({ email, password });
        setUser(u);
        closeAuthModal();
    }, [closeAuthModal]);
    const sendOtp = useCallback(async (identifier, purpose) => {
        return authApi.sendOtp(identifier, purpose, 'email');
    }, []);
    const register = useCallback(async (payload) => {
        const u = await authApi.register(payload);
        setUser(u);
        closeAuthModal();
    }, [closeAuthModal]);
    const resetPassword = useCallback(async (email, otp, newPassword) => {
        await authApi.resetPassword(email, otp, newPassword);
    }, []);
    const logout = useCallback(async () => {
        await authApi.logout();
        setUser(null);
    }, []);
    return (<AuthContext.Provider value={{
            user, isLoggedIn: !!user, isInitializing, authModalOpen, authModalTab,
            openAuthModal, closeAuthModal, login, sendOtp, register, resetPassword, logout, refreshUser,
        }}>
      {children}
    </AuthContext.Provider>);
}
export function useAuth() { return useContext(AuthContext); }
