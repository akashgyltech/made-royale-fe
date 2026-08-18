'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '@/provider/AuthProvider';
const loginSchema = yup.object({
    email: yup.string().required('Email is required').email('Enter a valid email'),
    password: yup.string().required('Password is required'),
});
const detailsSchema = yup.object({
    name: yup.string().required('Name is required').min(2, 'Minimum 2 characters'),
    email: yup.string().required('Email is required').email('Enter a valid email'),
    phone: yup.string().optional(),
    password: yup.string().required('Password is required').min(8, 'Minimum 8 characters')
        .matches(/\d/, 'Must contain at least 1 number').matches(/[a-zA-Z]/, 'Must contain at least 1 letter'),
});
const otpSchema = yup.object({ otp: yup.string().required('Enter the code').length(6, 'Code must be 6 digits') });
const emailSchema = yup.object({ email: yup.string().required('Email is required').email('Enter a valid email') });
const resetSchema = yup.object({
    otp: yup.string().required('Enter the code').length(6, 'Code must be 6 digits'),
    newPassword: yup.string().required('Password is required').min(8, 'Minimum 8 characters')
        .matches(/\d/, 'Must contain at least 1 number').matches(/[a-zA-Z]/, 'Must contain at least 1 letter'),
});
export default function AuthModal() {
    const { authModalOpen, authModalTab, closeAuthModal } = useAuth();
    const [view, setView] = useState('login');
    const overlayRef = useRef(null);
    useEffect(() => { setView(authModalTab); }, [authModalTab, authModalOpen]);
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape')
            closeAuthModal(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [closeAuthModal]);
    if (!authModalOpen)
        return null;
    const titles = {
        login: { heading: 'Welcome\nBack', sub: 'Luxury interiors & bespoke furniture, handcrafted for the discerning home.' },
        register: { heading: 'Join the\nShizenta Circle', sub: 'Luxury interiors & bespoke furniture, handcrafted for the discerning home.' },
        forgot: { heading: 'Reset Your\nPassword', sub: 'We will email you a verification code to reset your password.' },
    };
    return (<div ref={overlayRef} className="mr-auth-overlay" onClick={(e) => { if (e.target === overlayRef.current)
        closeAuthModal(); }}>
      <div className="mr-auth-modal">
        <div className="mr-auth-deco">
          <div className="mr-auth-deco-content">
            <div className="mr-auth-brand-mark">SHIZENTA</div>
            <h2 className="mr-auth-deco-title">{titles[view].heading}</h2>
            <p className="mr-auth-deco-sub">{titles[view].sub}</p>
            <div className="mr-auth-deco-divider"/>
            <div className="mr-auth-deco-quote">&ldquo;Every great room begins with a singular piece.&rdquo;</div>
          </div>
          <div className="mr-auth-deco-pattern" aria-hidden="true"/>
        </div>

        <div className="mr-auth-form-panel">
          <button className="mr-auth-close" onClick={closeAuthModal} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
          {view !== 'forgot' && (<div className="mr-auth-tabs">
              <button className={`mr-auth-tab ${view === 'login' ? 'active' : ''}`} onClick={() => setView('login')}>Sign In</button>
              <button className={`mr-auth-tab ${view === 'register' ? 'active' : ''}`} onClick={() => setView('register')}>Create Account</button>
            </div>)}
          <div className="mr-auth-form-scroll">
            {view === 'login' && <LoginView onForgot={() => setView('forgot')}/>}
            {view === 'register' && <RegisterView />}
            {view === 'forgot' && <ForgotPasswordView onDone={() => setView('login')}/>}
          </div>
        </div>
      </div>
    </div>);
}
function LoginView({ onForgot }) {
    const { login } = useAuth();
    const [showPass, setShowPass] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(loginSchema) });
    const onSubmit = handleSubmit(async (data) => {
        setSubmitting(true);
        setError('');
        try {
            await login(data.email, data.password);
        }
        catch (e) {
            setError(e instanceof Error ? e.message : 'Login failed');
        }
        finally {
            setSubmitting(false);
        }
    });
    return (<form onSubmit={onSubmit} className="mr-auth-form" noValidate>
      <div className="mr-auth-welcome"><h3>Sign In</h3><p>Access your exclusive Shizenta account</p></div>
      <div className="mr-field-group">
        <label>Email Address</label>
        <div className="mr-field-wrap"><input {...register('email')} type="email" placeholder="your@email.com" autoComplete="email"/></div>
        {errors.email && <span className="mr-field-error">{errors.email.message}</span>}
      </div>
      <div className="mr-field-group">
        <label>Password</label>
        <div className="mr-field-wrap">
          <input {...register('password')} type={showPass ? 'text' : 'password'} placeholder="••••••••" autoComplete="current-password"/>
          <button type="button" className="mr-eye-toggle" onClick={() => setShowPass(!showPass)}>{showPass ? 'Hide' : 'Show'}</button>
        </div>
        {errors.password && <span className="mr-field-error">{errors.password.message}</span>}
      </div>
      <button type="button" className="mr-auth-link" onClick={onForgot}>Forgot Password?</button>
      {error && <div className="mr-submit-error">{error}</div>}
      <button type="submit" className="mr-auth-submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign In'}</button>
    </form>);
}
function RegisterView() {
    const { sendOtp, register: registerFn } = useAuth();
    const [showPass, setShowPass] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [stage, setStage] = useState('details');
    const [details, setDetails] = useState(null);
    const [devOtp, setDevOtp] = useState();
    const detailsForm = useForm({ resolver: yupResolver(detailsSchema) });
    const otpForm = useForm({ resolver: yupResolver(otpSchema) });
    const onSendOtp = detailsForm.handleSubmit(async (data) => {
        setSubmitting(true);
        setError('');
        try {
            const res = await sendOtp(data.email, 'registration');
            setDetails(data);
            setDevOtp(res.devOtp);
            setStage('otp');
            otpForm.reset({ otp: res.devOtp || '' });
        }
        catch (e) {
            setError(e instanceof Error ? e.message : 'Could not send verification code');
        }
        finally {
            setSubmitting(false);
        }
    });
    const onVerifyAndRegister = otpForm.handleSubmit(async (data) => {
        if (!details)
            return;
        setSubmitting(true);
        setError('');
        try {
            await registerFn({ ...details, otp: data.otp });
        }
        catch (e) {
            setError(e instanceof Error ? e.message : 'Registration failed');
        }
        finally {
            setSubmitting(false);
        }
    });
    if (stage === 'otp') {
        return (<form onSubmit={onVerifyAndRegister} className="mr-auth-form" noValidate>
        <div className="mr-auth-welcome"><h3>Verify Your Email</h3><p>Enter the 6-digit code sent to {details?.email}</p></div>
        <div className="mr-field-group">
          <label>Verification Code</label>
          <div className="mr-field-wrap"><input {...otpForm.register('otp')} type="text" inputMode="numeric" maxLength={6} placeholder="123456" autoComplete="one-time-code"/></div>
          {otpForm.formState.errors.otp && <span className="mr-field-error">{otpForm.formState.errors.otp.message}</span>}
          {devOtp && <span className="mr-auth-hint">Dev mode — no email service configured, code auto-filled: {devOtp}</span>}
        </div>
        {error && <div className="mr-submit-error">{error}</div>}
        <button type="submit" className="mr-auth-submit" disabled={submitting}>{submitting ? 'Creating…' : 'Verify & Create Account'}</button>
        <button type="button" className="mr-auth-link" onClick={() => { setStage('details'); setError(''); }}>Edit details</button>
      </form>);
    }
    return (<form onSubmit={onSendOtp} className="mr-auth-form" noValidate>
      <div className="mr-auth-welcome"><h3>Create Account</h3><p>Join the Shizenta family today</p></div>
      <div className="mr-field-group">
        <label>Full Name</label>
        <div className="mr-field-wrap"><input {...detailsForm.register('name')} type="text" placeholder="Your full name" autoComplete="name"/></div>
        {detailsForm.formState.errors.name && <span className="mr-field-error">{detailsForm.formState.errors.name.message}</span>}
      </div>
      <div className="mr-field-group">
        <label>Email Address</label>
        <div className="mr-field-wrap"><input {...detailsForm.register('email')} type="email" placeholder="your@email.com" autoComplete="email"/></div>
        {detailsForm.formState.errors.email && <span className="mr-field-error">{detailsForm.formState.errors.email.message}</span>}
      </div>
      <div className="mr-field-group">
        <label>Phone <span className="mr-optional">(optional)</span></label>
        <div className="mr-field-wrap"><input {...detailsForm.register('phone')} type="tel" placeholder="+91 98765 43210" autoComplete="tel"/></div>
      </div>
      <div className="mr-field-group">
        <label>Password</label>
        <div className="mr-field-wrap">
          <input {...detailsForm.register('password')} type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters" autoComplete="new-password"/>
          <button type="button" className="mr-eye-toggle" onClick={() => setShowPass(!showPass)}>{showPass ? 'Hide' : 'Show'}</button>
        </div>
        {detailsForm.formState.errors.password && <span className="mr-field-error">{detailsForm.formState.errors.password.message}</span>}
      </div>
      {error && <div className="mr-submit-error">{error}</div>}
      <button type="submit" className="mr-auth-submit" disabled={submitting}>{submitting ? 'Sending code…' : 'Send Verification Code'}</button>
    </form>);
}
function ForgotPasswordView({ onDone }) {
    const { sendOtp, resetPassword } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [stage, setStage] = useState('email');
    const [email, setEmail] = useState('');
    const [devOtp, setDevOtp] = useState();
    const [showPass, setShowPass] = useState(false);
    const emailForm = useForm({ resolver: yupResolver(emailSchema) });
    const resetForm = useForm({ resolver: yupResolver(resetSchema) });
    const onSendCode = emailForm.handleSubmit(async (data) => {
        setSubmitting(true);
        setError('');
        try {
            const res = await sendOtp(data.email, 'password_reset');
            setEmail(data.email);
            setDevOtp(res.devOtp);
            setStage('reset');
            resetForm.reset({ otp: res.devOtp || '', newPassword: '' });
        }
        catch (e) {
            setError(e instanceof Error ? e.message : 'Could not send reset code');
        }
        finally {
            setSubmitting(false);
        }
    });
    const onReset = resetForm.handleSubmit(async (data) => {
        setSubmitting(true);
        setError('');
        try {
            await resetPassword(email, data.otp, data.newPassword);
            setStage('done');
        }
        catch (e) {
            setError(e instanceof Error ? e.message : 'Password reset failed');
        }
        finally {
            setSubmitting(false);
        }
    });
    if (stage === 'done') {
        return (<div className="mr-auth-form">
        <div className="mr-auth-welcome"><h3>Password Updated</h3><p>Your password has been reset successfully.</p></div>
        <button type="button" className="mr-auth-submit" onClick={onDone}>Back to Sign In</button>
      </div>);
    }
    if (stage === 'reset') {
        return (<form onSubmit={onReset} className="mr-auth-form" noValidate>
        <div className="mr-auth-welcome"><h3>Enter Reset Code</h3><p>Sent to {email}</p></div>
        <div className="mr-field-group">
          <label>Verification Code</label>
          <div className="mr-field-wrap"><input {...resetForm.register('otp')} type="text" inputMode="numeric" maxLength={6} placeholder="123456" autoComplete="one-time-code"/></div>
          {resetForm.formState.errors.otp && <span className="mr-field-error">{resetForm.formState.errors.otp.message}</span>}
          {devOtp && <span className="mr-auth-hint">Dev mode — no email service configured, code auto-filled: {devOtp}</span>}
        </div>
        <div className="mr-field-group">
          <label>New Password</label>
          <div className="mr-field-wrap">
            <input {...resetForm.register('newPassword')} type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters" autoComplete="new-password"/>
            <button type="button" className="mr-eye-toggle" onClick={() => setShowPass(!showPass)}>{showPass ? 'Hide' : 'Show'}</button>
          </div>
          {resetForm.formState.errors.newPassword && <span className="mr-field-error">{resetForm.formState.errors.newPassword.message}</span>}
        </div>
        {error && <div className="mr-submit-error">{error}</div>}
        <button type="submit" className="mr-auth-submit" disabled={submitting}>{submitting ? 'Resetting…' : 'Reset Password'}</button>
        <button type="button" className="mr-auth-link" onClick={onDone}>Back to Sign In</button>
      </form>);
    }
    return (<form onSubmit={onSendCode} className="mr-auth-form" noValidate>
      <div className="mr-auth-welcome"><h3>Forgot Password</h3><p>Enter your email to receive a reset code</p></div>
      <div className="mr-field-group">
        <label>Email Address</label>
        <div className="mr-field-wrap"><input {...emailForm.register('email')} type="email" placeholder="your@email.com" autoComplete="email"/></div>
        {emailForm.formState.errors.email && <span className="mr-field-error">{emailForm.formState.errors.email.message}</span>}
      </div>
      {error && <div className="mr-submit-error">{error}</div>}
      <button type="submit" className="mr-auth-submit" disabled={submitting}>{submitting ? 'Sending…' : 'Send Reset Code'}</button>
      <button type="button" className="mr-auth-link" onClick={onDone}>Back to Sign In</button>
    </form>);
}
