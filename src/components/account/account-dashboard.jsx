'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/provider/AuthProvider';
import { useWishlist } from '@/provider/WishlistProvider';
import { useToast } from '@/provider/ToastProvider';
import { formatINR } from '@/data/catalog';
import { orderApi, profileApi } from '@/lib/store-api';
import { STATUS_LABELS } from '@/lib/order-status';
import { INDIAN_STATES } from '@/lib/indian-states';
import ShopItem from '@/components/shop/shop-item';
import SmartImage from '@/components/ui/smart-image';
const TABS = [
    { id: 'overview', label: 'Overview', glyph: '❖' },
    { id: 'orders', label: 'My Orders', glyph: '📦' },
    { id: 'wishlist', label: 'Wishlist', glyph: '♡' },
    { id: 'addresses', label: 'Addresses', glyph: '📍' },
    { id: 'profile', label: 'Profile', glyph: '👤' },
];
export default function AccountDashboard() {
    const params = useSearchParams();
    const router = useRouter();
    const { user, isLoggedIn, openAuthModal, logout } = useAuth();
    const { products: wishProducts, count: wishCount } = useWishlist();
    const initialTab = params?.get('tab') || 'overview';
    const [tab, setTab] = useState(TABS.some((t) => t.id === initialTab) ? initialTab : 'overview');
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const loadOrders = useCallback(async () => {
        if (!isLoggedIn) {
            setOrders([]);
            return;
        }
        setOrdersLoading(true);
        try {
            const page = await orderApi.getMyOrders(1, 20);
            setOrders(page.results);
        }
        catch { /* keep previous list on transient failure */ }
        finally {
            setOrdersLoading(false);
        }
    }, [isLoggedIn]);
    useEffect(() => { void loadOrders(); }, [loadOrders]);
    const switchTab = (t) => { setTab(t); router.replace(`/account?tab=${t}`, { scroll: false }); };
    const initials = user?.name ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() : 'MR';
    return (<section className="mr-account">
      <div className="container container-1300">
        <div className="mr-account-layout">
          <aside className="mr-account-side">
            <div className="mr-account-profile">
              <div className="mr-account-avatar">
                {user?.avatar ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}/> : initials}
              </div>
              <div><strong>{user?.name || 'Welcome, Guest'}</strong><span>{user?.email || 'Sign in for a royal experience'}</span></div>
            </div>
            <nav className="mr-account-nav">
              {TABS.map((t) => <button key={t.id} className={tab === t.id ? 'is-active' : ''} onClick={() => switchTab(t.id)}><span className="mr-account-nav-glyph">{t.glyph}</span>{t.label}</button>)}
              {isLoggedIn ? <button className="mr-account-logout" onClick={() => logout()}><span className="mr-account-nav-glyph">⎋</span>Sign Out</button> : <button className="mr-account-logout" onClick={() => openAuthModal('login')}><span className="mr-account-nav-glyph">→</span>Sign In</button>}
            </nav>
          </aside>

          <div className="mr-account-content">
            {!isLoggedIn && (<div className="mr-account-banner"><div><strong>You’re browsing as a guest</strong><p>Sign in to view your orders, wishlist and addresses.</p></div><button className="mr-btn-gold" onClick={() => openAuthModal('login')}>Sign In</button></div>)}

            {tab === 'overview' && (<div className="mr-account-panel">
                <h2 className="mr-account-h2">Overview</h2>
                <div className="mr-account-stats">
                  <button className="mr-account-stat" onClick={() => switchTab('orders')}><strong>{user?.totalOrders ?? orders.length}</strong><span>Orders</span></button>
                  <button className="mr-account-stat" onClick={() => switchTab('wishlist')}><strong>{wishCount}</strong><span>Wishlist</span></button>
                  <Link href="/track-order" className="mr-account-stat"><strong>◎</strong><span>Track Order</span></Link>
                </div>
                <h3 className="mr-account-h3">Recent Order</h3>
                {!isLoggedIn ? (<EmptyState glyph="📦" title="Sign in to view your orders" text="Your order history will appear here." action={<button className="mr-btn-gold" onClick={() => openAuthModal('login')}>Sign In</button>}/>) : ordersLoading ? (<p className="mr-cart-summary-tax">Loading…</p>) : orders.length === 0 ? (<EmptyState glyph="📦" title="No orders yet" text="Your future heirlooms will appear here." action={<Link href="/shop" className="mr-btn-gold">Start Shopping</Link>}/>) : <OrderRow order={orders[0]}/>}

                <h3 className="mr-account-h3">Quick Links</h3>
                <div className="mr-account-quick">
                  <Link href="/shop" className="mr-account-quick-card"><span>🛍️</span><strong>Continue Shopping</strong><small>Explore new arrivals</small></Link>
                  <Link href="/track-order" className="mr-account-quick-card"><span>📦</span><strong>Track an Order</strong><small>Real-time updates</small></Link>
                  <Link href="/bulk-enquiry" className="mr-account-quick-card"><span>🏢</span><strong>Bulk & Trade</strong><small>Volume pricing</small></Link>
                  <Link href="/contact" className="mr-account-quick-card"><span>💬</span><strong>Help & Support</strong><small>We&rsquo;re here for you</small></Link>
                </div>
              </div>)}

            {tab === 'orders' && (<div className="mr-account-panel">
                <h2 className="mr-account-h2">My Orders</h2>
                {!isLoggedIn ? (<EmptyState glyph="📦" title="Sign in to view your orders" text="Your order history will appear here." action={<button className="mr-btn-gold" onClick={() => openAuthModal('login')}>Sign In</button>}/>) : ordersLoading ? (<p className="mr-cart-summary-tax">Loading your orders…</p>) : orders.length === 0 ? (<EmptyState glyph="📦" title="No orders yet" text="Once you place an order, you can track it here."/>) : <div className="mr-account-orders">{orders.map((o) => <OrderRow key={o.id} order={o}/>)}</div>}
              </div>)}

            {tab === 'wishlist' && (<div className="mr-account-panel">
                <h2 className="mr-account-h2">Wishlist</h2>
                {!isLoggedIn ? (<EmptyState glyph="♡" title="Sign in to view your wishlist" text="Save pieces you love to find them here." action={<button className="mr-btn-gold" onClick={() => openAuthModal('login')}>Sign In</button>}/>) : wishProducts.length === 0 ? (<EmptyState glyph="♡" title="Your wishlist is empty" text="Save pieces you love to find them here."/>) : <div className="mr-grid mr-grid-3">{wishProducts.map((p) => <ShopItem key={p.id} product={p}/>)}</div>}
              </div>)}

            {tab === 'addresses' && <AddressBook />}

            {tab === 'profile' && <ProfileTab />}
          </div>
        </div>
      </div>
    </section>);
}
function OrderRow({ order }) {
    return (<div className="mr-order-row">
      <div className="mr-order-row-head">
        <div>
          <span className="mr-order-row-num">{order.orderNumber}</span>
          {order.createdAt && <span className="mr-order-row-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
        </div>
        <span className={`mr-order-status is-${order.status.replace(/_/g, '-')}`}>{STATUS_LABELS[order.status]}</span>
      </div>
      <div className="mr-order-row-items">
        {order.items.slice(0, 3).map((it) => <div className="mr-order-row-thumb" key={it.id} title={it.name}><SmartImage src={it.image} alt={it.name} ratio="1 / 1"/></div>)}
        {order.items.length > 3 && <div className="mr-order-row-more">+{order.items.length - 3}</div>}
        <div className="mr-order-row-summary"><span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span><strong>{formatINR(order.pricing.grandTotal)}</strong></div>
      </div>
      <div className="mr-order-row-foot">
        <div className="mr-order-row-actions">
          <Link href={`/track-order?order=${order.orderNumber}`} className="mr-btn-outline mr-btn-sm">Track Order</Link>
          <Link href={`/invoice/${order.orderNumber}`} className="mr-btn-outline mr-btn-sm">Invoice</Link>
        </div>
        <Link href={`/order-confirmation/${order.orderNumber}`} className="mr-btn-text">View Details →</Link>
      </div>
    </div>);
}
const emptyAddressForm = { label: 'home', name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' };
function AddressBook() {
    const { toast } = useToast();
    const { isLoggedIn, openAuthModal } = useAuth();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyAddressForm);
    const [saving, setSaving] = useState(false);
    const load = useCallback(async () => {
        if (!isLoggedIn) {
            setAddresses([]);
            return;
        }
        setLoading(true);
        try {
            setAddresses(await profileApi.getAddresses());
        }
        catch { /* ignore */ }
        finally {
            setLoading(false);
        }
    }, [isLoggedIn]);
    useEffect(() => { void load(); }, [load]);
    if (!isLoggedIn) {
        return (<div className="mr-account-panel">
        <h2 className="mr-account-h2">Saved Addresses</h2>
        <EmptyState glyph="📍" title="Sign in to manage addresses" text="Save addresses for faster checkout." action={<button className="mr-btn-gold" onClick={() => openAuthModal('login')}>Sign In</button>}/>
      </div>);
    }
    const startAdd = () => { setForm(emptyAddressForm); setEditingId(null); setShowForm(true); };
    const startEdit = (a) => {
        setForm({ label: a.label || 'home', name: a.name, phone: a.phone, line1: a.line1, line2: a.line2 || '', city: a.city, state: a.state, pincode: a.pincode });
        setEditingId(a.id);
        setShowForm(true);
    };
    const cancel = () => { setShowForm(false); setEditingId(null); };
    const valid = () => !!(form.name.trim() && /^\d{10}$/.test(form.phone) && form.line1.trim() && form.city.trim() && form.state && /^\d{6}$/.test(form.pincode));
    const save = async () => {
        if (!valid()) {
            toast('Please fill all fields correctly', 'error');
            return;
        }
        setSaving(true);
        try {
            const body = { label: form.label, name: form.name.trim(), phone: form.phone.trim(), line1: form.line1.trim(), line2: form.line2.trim() || undefined, city: form.city.trim(), state: form.state, pincode: form.pincode.trim(), country: 'India' };
            if (editingId) {
                setAddresses(await profileApi.updateAddress(editingId, body));
                toast('Address updated');
            }
            else {
                setAddresses(await profileApi.addAddress({ ...body, isDefault: addresses.length === 0 }));
                toast('Address saved');
            }
            cancel();
        }
        catch (e) {
            toast(e instanceof Error ? e.message : 'Could not save address', 'error');
        }
        finally {
            setSaving(false);
        }
    };
    const remove = async (id) => {
        try {
            setAddresses(await profileApi.deleteAddress(id));
            toast('Address removed');
        }
        catch (e) {
            toast(e instanceof Error ? e.message : 'Could not remove address', 'error');
        }
    };
    const makeDefault = async (id) => {
        try {
            setAddresses(await profileApi.setDefaultAddress(id));
            toast('Default address updated');
        }
        catch (e) {
            toast(e instanceof Error ? e.message : 'Could not update default address', 'error');
        }
    };
    return (<div className="mr-account-panel">
      <div className="mr-account-panel-head"><h2 className="mr-account-h2">Saved Addresses</h2><button className="mr-btn-outline mr-btn-sm" onClick={() => (showForm ? cancel() : startAdd())}>{showForm ? 'Cancel' : '+ Add Address'}</button></div>

      {showForm && (<div className="mr-form-grid" style={{ marginBottom: 24 }}>
          <Field label="Label"><select value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })}><option value="home">Home</option><option value="work">Work</option><option value="other">Other</option></select></Field>
          <Field label="Full Name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}/></Field>
          <Field label="Mobile Number"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} placeholder="10-digit mobile" inputMode="numeric"/></Field>
          <Field label="Pincode"><input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })} placeholder="6-digit pincode" inputMode="numeric"/></Field>
          <Field label="Address Line 1" full><input value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })}/></Field>
          <Field label="Address Line 2 (optional)" full><input value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })}/></Field>
          <Field label="City"><input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}/></Field>
          <Field label="State"><select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}><option value="">Select state</option>{INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}</select></Field>
          <div className="mr-field-full" style={{ gridColumn: '1 / -1' }}>
            <button className="mr-btn-gold" onClick={() => void save()} disabled={saving}>{saving ? 'Saving…' : editingId ? 'Update Address' : 'Save Address'}</button>
          </div>
        </div>)}

      {loading ? <p className="mr-cart-summary-tax">Loading addresses…</p> : addresses.length === 0 && !showForm ? (<EmptyState glyph="📍" title="No addresses saved" text="Add an address for faster checkout."/>) : (<div className="mr-addr-list">
          {addresses.map((a) => (<div className="mr-addr-card" key={a.id}>
              <strong>{a.name}{a.isDefault ? ' • Default' : ''}</strong>
              <p>{a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city}, {a.state} — {a.pincode}</p>
              <span>{a.phone}</span>
              <div style={{ display: 'flex', gap: 14, marginTop: 12 }}>
                <button className="mr-btn-text" onClick={() => startEdit(a)}>Edit</button>
                {!a.isDefault && <button className="mr-btn-text" onClick={() => void makeDefault(a.id)}>Set as Default</button>}
              </div>
              <button className="mr-addr-remove" onClick={() => void remove(a.id)}>Remove</button>
            </div>))}
        </div>)}
    </div>);
}
function ProfileTab() {
    const { user, isLoggedIn, isInitializing, openAuthModal, refreshUser } = useAuth();
    const { toast } = useToast();
    const [name, setName] = useState(user?.name || '');
    const [gstin, setGstin] = useState(user?.gstInfo?.gstin || '');
    const [businessName, setBusinessName] = useState(user?.gstInfo?.businessName || '');
    const [businessAddress, setBusinessAddress] = useState(user?.gstInfo?.businessAddress || '');
    const [savingProfile, setSavingProfile] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [savingAvatar, setSavingAvatar] = useState(false);
    const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
    const [savingPw, setSavingPw] = useState(false);
    useEffect(() => {
        setName(user?.name || '');
        setGstin(user?.gstInfo?.gstin || '');
        setBusinessName(user?.gstInfo?.businessName || '');
        setBusinessAddress(user?.gstInfo?.businessAddress || '');
    }, [user]);
    if (isInitializing)
        return <div className="mr-account-panel"><h2 className="mr-account-h2">Profile</h2><p className="mr-cart-summary-tax">Loading…</p></div>;
    if (!isLoggedIn) {
        return (<div className="mr-account-panel">
        <h2 className="mr-account-h2">Profile</h2>
        <EmptyState glyph="👤" title="Sign in to view your profile" text="Access your details, saved cards and preferences." action={<button className="mr-btn-gold" onClick={() => openAuthModal('login')}>Sign In</button>}/>
      </div>);
    }
    const saveProfile = async () => {
        if (!name.trim()) {
            toast('Name is required', 'error');
            return;
        }
        setSavingProfile(true);
        try {
            const hasGst = !!(gstin.trim() || businessName.trim() || businessAddress.trim());
            await profileApi.updateProfile({
                name: name.trim(),
                gstInfo: hasGst ? { gstin: gstin.trim().toUpperCase() || undefined, businessName: businessName.trim() || undefined, businessAddress: businessAddress.trim() || undefined } : undefined,
            });
            await refreshUser();
            toast('Profile updated');
        }
        catch (e) {
            toast(e instanceof Error ? e.message : 'Could not update profile', 'error');
        }
        finally {
            setSavingProfile(false);
        }
    };
    const onAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };
    const saveAvatar = async () => {
        if (!avatarFile)
            return;
        setSavingAvatar(true);
        try {
            await profileApi.updateAvatar(avatarFile);
            await refreshUser();
            setAvatarFile(null);
            setAvatarPreview(null);
            toast('Photo updated');
        }
        catch (e) {
            toast(e instanceof Error ? e.message : 'Could not update photo', 'error');
        }
        finally {
            setSavingAvatar(false);
        }
    };
    const savePassword = async () => {
        if (!pw.current || pw.next.length < 8) {
            toast('Enter your current password and a new password (min 8 characters)', 'error');
            return;
        }
        if (pw.next !== pw.confirm) {
            toast('New passwords do not match', 'error');
            return;
        }
        setSavingPw(true);
        try {
            await profileApi.changePassword(pw.current, pw.next);
            setPw({ current: '', next: '', confirm: '' });
            toast('Password changed');
        }
        catch (e) {
            toast(e instanceof Error ? e.message : 'Could not change password', 'error');
        }
        finally {
            setSavingPw(false);
        }
    };
    const displayAvatar = avatarPreview || user?.avatar;
    return (<div className="mr-account-panel">
      <h2 className="mr-account-h2">Profile</h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 26 }}>
        <div className="mr-account-avatar" style={{ width: 64, height: 64, fontSize: 20 }}>
          {displayAvatar ? <img src={displayAvatar} alt={user?.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}/> : (user?.name || 'MR').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
        </div>
        <div>
          <input type="file" accept="image/*" onChange={onAvatarChange}/>
          {avatarFile && <button className="mr-btn-outline mr-btn-sm" style={{ marginLeft: 8 }} onClick={() => void saveAvatar()} disabled={savingAvatar}>{savingAvatar ? 'Uploading…' : 'Save Photo'}</button>}
        </div>
      </div>

      <div className="mr-form-grid">
        <Field label="Name" full><input value={name} onChange={(e) => setName(e.target.value)}/></Field>
        <Field label="Email"><input value={user?.email || ''} disabled/></Field>
        <Field label="Phone"><input value={user?.phone || 'Not added'} disabled/></Field>
      </div>

      <h3 className="mr-account-h3">GST / Business Details (optional)</h3>
      <div className="mr-form-grid">
        <Field label="GSTIN"><input value={gstin} onChange={(e) => setGstin(e.target.value.toUpperCase().slice(0, 15))} placeholder="15-character GSTIN"/></Field>
        <Field label="Business Name"><input value={businessName} onChange={(e) => setBusinessName(e.target.value)}/></Field>
        <Field label="Business Address" full><input value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)}/></Field>
      </div>
      <button className="mr-btn-gold mr-btn-sm" style={{ marginTop: 16 }} onClick={() => void saveProfile()} disabled={savingProfile}>{savingProfile ? 'Saving…' : 'Save Profile'}</button>

      <h3 className="mr-account-h3">Change Password</h3>
      <div className="mr-form-grid">
        <Field label="Current Password"><input type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })}/></Field>
        <Field label="New Password"><input type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })}/></Field>
        <Field label="Confirm New Password"><input type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })}/></Field>
      </div>
      <button className="mr-btn-gold mr-btn-sm" style={{ marginTop: 16 }} onClick={() => void savePassword()} disabled={savingPw}>{savingPw ? 'Updating…' : 'Change Password'}</button>
    </div>);
}
function Field({ label, children, full }) {
    return (<div className={`mr-field ${full ? 'mr-field-full' : ''}`}>
      <label>{label}</label>{children}
    </div>);
}
function EmptyState({ glyph, title, text, action }) {
    return <div className="mr-account-empty"><div className="mr-shop-empty-glyph">{glyph}</div><h4>{title}</h4><p>{text}</p>{action}</div>;
}
