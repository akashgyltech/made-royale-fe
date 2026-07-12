'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '@/provider/AuthProvider';

const loginSchema = yup.object({
  email: yup.string().required('Email is required').email('Enter a valid email'),
  password: yup.string().required('Password is required').min(6, 'Minimum 6 characters'),
});
const registerSchema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Minimum 2 characters'),
  email: yup.string().required('Email is required').email('Enter a valid email'),
  phone: yup.string().optional(),
  password: yup.string().required('Password is required').min(6, 'Minimum 6 characters'),
});

type LoginData = { email: string; password: string };
type RegisterData = { name: string; email: string; phone?: string; password: string };
type View = 'login' | 'register';

export default function AuthModal() {
  const { authModalOpen, authModalTab, closeAuthModal, login, register } = useAuth();
  const [view, setView] = useState<View>('login');
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setView(authModalTab); setError(''); setShowPass(false); }, [authModalTab, authModalOpen]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeAuthModal(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeAuthModal]);

  if (!authModalOpen) return null;

  return (
    <div ref={overlayRef} className="mr-auth-overlay" onClick={(e) => { if (e.target === overlayRef.current) closeAuthModal(); }}>
      <div className="mr-auth-modal">
        <div className="mr-auth-deco">
          <div className="mr-auth-deco-content">
            <div className="mr-auth-brand-mark">SHIZENTA</div>
            <h2 className="mr-auth-deco-title">{view === 'register' ? 'Join the\nShizenta Circle' : 'Welcome\nBack'}</h2>
            <p className="mr-auth-deco-sub">Luxury interiors & bespoke furniture, handcrafted for the discerning home.</p>
            <div className="mr-auth-deco-divider" />
            <div className="mr-auth-deco-quote">&ldquo;Every great room begins with a singular piece.&rdquo;</div>
          </div>
          <div className="mr-auth-deco-pattern" aria-hidden="true" />
        </div>

        <div className="mr-auth-form-panel">
          <button className="mr-auth-close" onClick={closeAuthModal} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
          <div className="mr-auth-tabs">
            <button className={`mr-auth-tab ${view === 'login' ? 'active' : ''}`} onClick={() => { setView('login'); setError(''); }}>Sign In</button>
            <button className={`mr-auth-tab ${view === 'register' ? 'active' : ''}`} onClick={() => { setView('register'); setError(''); }}>Create Account</button>
          </div>
          <div className="mr-auth-form-scroll">
            {view === 'login' ? (
              <LoginView showPass={showPass} setShowPass={setShowPass} submitting={submitting} setSubmitting={setSubmitting} error={error} setError={setError} login={login} />
            ) : (
              <RegisterView showPass={showPass} setShowPass={setShowPass} submitting={submitting} setSubmitting={setSubmitting} error={error} setError={setError} register={register} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginView({ showPass, setShowPass, submitting, setSubmitting, error, setError, login }: {
  showPass: boolean; setShowPass: (v: boolean) => void; submitting: boolean; setSubmitting: (v: boolean) => void;
  error: string; setError: (v: string) => void; login: (email: string, password: string) => Promise<void>;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({ resolver: yupResolver(loginSchema) });
  const onSubmit = handleSubmit(async (data) => {
    setSubmitting(true); setError('');
    try { await login(data.email, data.password); } catch (e) { setError(e instanceof Error ? e.message : 'Login failed'); } finally { setSubmitting(false); }
  });
  return (
    <form onSubmit={onSubmit} className="mr-auth-form" noValidate>
      <div className="mr-auth-welcome"><h3>Sign In</h3><p>Access your exclusive Shizenta account</p></div>
      <div className="mr-field-group">
        <label>Email Address</label>
        <div className="mr-field-wrap"><input {...register('email')} type="email" placeholder="your@email.com" autoComplete="email" /></div>
        {errors.email && <span className="mr-field-error">{errors.email.message}</span>}
      </div>
      <div className="mr-field-group">
        <label>Password</label>
        <div className="mr-field-wrap">
          <input {...register('password')} type={showPass ? 'text' : 'password'} placeholder="••••••••" autoComplete="current-password" />
          <button type="button" className="mr-eye-toggle" onClick={() => setShowPass(!showPass)}>{showPass ? 'Hide' : 'Show'}</button>
        </div>
        {errors.password && <span className="mr-field-error">{errors.password.message}</span>}
      </div>
      {error && <div className="mr-submit-error">{error}</div>}
      <button type="submit" className="mr-auth-submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign In'}</button>
      <p className="mr-auth-hint">Demo mode — any valid email &amp; 6+ char password signs you in.</p>
    </form>
  );
}

function RegisterView({ showPass, setShowPass, submitting, setSubmitting, error, setError, register: registerFn }: {
  showPass: boolean; setShowPass: (v: boolean) => void; submitting: boolean; setSubmitting: (v: boolean) => void;
  error: string; setError: (v: string) => void; register: (p: RegisterData) => Promise<void>;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterData>({ resolver: yupResolver(registerSchema) });
  const onSubmit = handleSubmit(async (data) => {
    setSubmitting(true); setError('');
    try { await registerFn(data); } catch (e) { setError(e instanceof Error ? e.message : 'Registration failed'); } finally { setSubmitting(false); }
  });
  return (
    <form onSubmit={onSubmit} className="mr-auth-form" noValidate>
      <div className="mr-auth-welcome"><h3>Create Account</h3><p>Join the Shizenta family today</p></div>
      <div className="mr-field-group">
        <label>Full Name</label>
        <div className="mr-field-wrap"><input {...register('name')} type="text" placeholder="Your full name" autoComplete="name" /></div>
        {errors.name && <span className="mr-field-error">{errors.name.message}</span>}
      </div>
      <div className="mr-field-group">
        <label>Email Address</label>
        <div className="mr-field-wrap"><input {...register('email')} type="email" placeholder="your@email.com" autoComplete="email" /></div>
        {errors.email && <span className="mr-field-error">{errors.email.message}</span>}
      </div>
      <div className="mr-field-group">
        <label>Phone <span className="mr-optional">(optional)</span></label>
        <div className="mr-field-wrap"><input {...register('phone')} type="tel" placeholder="+91 98765 43210" autoComplete="tel" /></div>
      </div>
      <div className="mr-field-group">
        <label>Password</label>
        <div className="mr-field-wrap">
          <input {...register('password')} type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters" autoComplete="new-password" />
          <button type="button" className="mr-eye-toggle" onClick={() => setShowPass(!showPass)}>{showPass ? 'Hide' : 'Show'}</button>
        </div>
        {errors.password && <span className="mr-field-error">{errors.password.message}</span>}
      </div>
      {error && <div className="mr-submit-error">{error}</div>}
      <button type="submit" className="mr-auth-submit" disabled={submitting}>{submitting ? 'Creating…' : 'Create Account'}</button>
    </form>
  );
}
