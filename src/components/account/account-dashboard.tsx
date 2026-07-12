'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/provider/AuthProvider';
import { useWishlist } from '@/provider/WishlistProvider';
import { useToast } from '@/provider/ToastProvider';
import { getProductById, formatINR } from '@/data/catalog';
import { getOrders, Order, ORDER_STAGES, computeStageIndex } from '@/lib/orders';
import ShopItem from '@/components/shop/shop-item';
import SmartImage from '@/components/ui/smart-image';

type Tab = 'overview' | 'orders' | 'wishlist' | 'addresses' | 'profile';
const TABS: { id: Tab; label: string; glyph: string }[] = [
  { id: 'overview', label: 'Overview', glyph: '❖' },
  { id: 'orders', label: 'My Orders', glyph: '📦' },
  { id: 'wishlist', label: 'Wishlist', glyph: '♡' },
  { id: 'addresses', label: 'Addresses', glyph: '📍' },
  { id: 'profile', label: 'Profile', glyph: '👤' },
];

interface Address { id: string; name: string; phone: string; line1: string; city: string; state: string; pincode: string; }
const ADDR_KEY = 'mr_addresses';

export default function AccountDashboard() {
  const params = useSearchParams();
  const router = useRouter();
  const { user, isLoggedIn, openAuthModal, logout } = useAuth();
  const { ids: wishIds } = useWishlist();
  const initialTab = (params?.get('tab') as Tab) || 'overview';
  const [tab, setTab] = useState<Tab>(TABS.some((t) => t.id === initialTab) ? initialTab : 'overview');
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => { setOrders(getOrders()); }, []);

  const switchTab = (t: Tab) => { setTab(t); router.replace(`/account?tab=${t}`, { scroll: false }); };
  const wishProducts = wishIds.map((id) => getProductById(id)).filter((p) => !!p);
  const initials = user?.name ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() : 'MR';

  return (
    <section className="mr-account">
      <div className="container container-1300">
        <div className="mr-account-layout">
          <aside className="mr-account-side">
            <div className="mr-account-profile">
              <div className="mr-account-avatar">{initials}</div>
              <div><strong>{user?.name || 'Welcome, Guest'}</strong><span>{user?.email || 'Sign in for a royal experience'}</span></div>
            </div>
            <nav className="mr-account-nav">
              {TABS.map((t) => <button key={t.id} className={tab === t.id ? 'is-active' : ''} onClick={() => switchTab(t.id)}><span className="mr-account-nav-glyph">{t.glyph}</span>{t.label}</button>)}
              {isLoggedIn ? <button className="mr-account-logout" onClick={() => logout()}><span className="mr-account-nav-glyph">⎋</span>Sign Out</button> : <button className="mr-account-logout" onClick={() => openAuthModal('login')}><span className="mr-account-nav-glyph">→</span>Sign In</button>}
            </nav>
          </aside>

          <div className="mr-account-content">
            {!isLoggedIn && (
              <div className="mr-account-banner"><div><strong>You’re browsing as a guest</strong><p>Sign in to sync your orders, wishlist and addresses across devices.</p></div><button className="mr-btn-gold" onClick={() => openAuthModal('login')}>Sign In</button></div>
            )}

            {tab === 'overview' && (
              <div className="mr-account-panel">
                <h2 className="mr-account-h2">Overview</h2>
                <div className="mr-account-stats">
                  <button className="mr-account-stat" onClick={() => switchTab('orders')}><strong>{orders.length}</strong><span>Orders</span></button>
                  <button className="mr-account-stat" onClick={() => switchTab('wishlist')}><strong>{wishProducts.length}</strong><span>Wishlist</span></button>
                  <Link href="/track-order" className="mr-account-stat"><strong>◎</strong><span>Track Order</span></Link>
                </div>
                <h3 className="mr-account-h3">Recent Order</h3>
                {orders.length === 0 ? <EmptyState glyph="📦" title="No orders yet" text="Your future heirlooms will appear here." /> : <OrderRow order={orders[0]} />}
              </div>
            )}

            {tab === 'orders' && (
              <div className="mr-account-panel">
                <h2 className="mr-account-h2">My Orders</h2>
                {orders.length === 0 ? <EmptyState glyph="📦" title="No orders yet" text="Once you place an order, you can track it here." /> : <div className="mr-account-orders">{orders.map((o) => <OrderRow key={o.orderNumber} order={o} />)}</div>}
              </div>
            )}

            {tab === 'wishlist' && (
              <div className="mr-account-panel">
                <h2 className="mr-account-h2">Wishlist</h2>
                {wishProducts.length === 0 ? <EmptyState glyph="♡" title="Your wishlist is empty" text="Save pieces you love to find them here." /> : <div className="mr-grid mr-grid-3">{wishProducts.map((p) => <ShopItem key={p!.id} product={p!} />)}</div>}
              </div>
            )}

            {tab === 'addresses' && <AddressBook />}

            {tab === 'profile' && (
              <div className="mr-account-panel">
                <h2 className="mr-account-h2">Profile</h2>
                {isLoggedIn ? (
                  <div className="mr-account-profile-card"><Row label="Name" value={user?.name || '—'} /><Row label="Email" value={user?.email || '—'} /><Row label="Phone" value={user?.phone || 'Not added'} /></div>
                ) : <EmptyState glyph="👤" title="Sign in to view your profile" text="Access your details, saved cards and preferences." action={<button className="mr-btn-gold" onClick={() => openAuthModal('login')}>Sign In</button>} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function OrderRow({ order }: { order: Order }) {
  const stage = ORDER_STAGES[computeStageIndex(order)];
  return (
    <div className="mr-order-row">
      <div className="mr-order-row-head">
        <div><span className="mr-order-row-num">{order.orderNumber}</span><span className="mr-order-row-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
        <span className={`mr-order-status is-${stage.key}`}>{stage.label}</span>
      </div>
      <div className="mr-order-row-items">
        {order.items.slice(0, 3).map((it, i) => <div className="mr-order-row-thumb" key={i} title={it.name}><SmartImage src={getProductById(it.productId)?.image} alt={it.name} ratio="1 / 1" /></div>)}
        {order.items.length > 3 && <div className="mr-order-row-more">+{order.items.length - 3}</div>}
        <div className="mr-order-row-summary"><span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span><strong>{formatINR(order.total)}</strong></div>
      </div>
      <div className="mr-order-row-foot"><Link href={`/track-order?order=${order.orderNumber}`} className="mr-btn-outline mr-btn-sm">Track Order</Link><Link href={`/order-confirmation/${order.orderNumber}`} className="mr-btn-text">View Details →</Link></div>
    </div>
  );
}

function AddressBook() {
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Address, 'id'>>({ name: '', phone: '', line1: '', city: '', state: '', pincode: '' });
  useEffect(() => { try { const r = localStorage.getItem(ADDR_KEY); if (r) setAddresses(JSON.parse(r)); } catch {} }, []);
  const persist = (n: Address[]) => { setAddresses(n); try { localStorage.setItem(ADDR_KEY, JSON.stringify(n)); } catch {} };
  const save = () => {
    if (!form.name || !/^\d{10}$/.test(form.phone) || !form.line1 || !form.city || !form.state || !/^\d{6}$/.test(form.pincode)) { toast('Please fill all fields correctly', 'error'); return; }
    persist([...addresses, { ...form, id: `addr-${Date.now()}` }]); setForm({ name: '', phone: '', line1: '', city: '', state: '', pincode: '' }); setShowForm(false); toast('Address saved');
  };
  return (
    <div className="mr-account-panel">
      <div className="mr-account-panel-head"><h2 className="mr-account-h2">Saved Addresses</h2><button className="mr-btn-outline mr-btn-sm" onClick={() => setShowForm((s) => !s)}>{showForm ? 'Cancel' : '+ Add Address'}</button></div>
      {showForm && (
        <div className="mr-addr-form">
          <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Mobile (10 digit)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} />
          <input placeholder="Address line" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} className="mr-addr-full" />
          <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <input placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
          <input placeholder="Pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })} />
          <button className="mr-btn-gold" onClick={save}>Save Address</button>
        </div>
      )}
      {addresses.length === 0 && !showForm ? <EmptyState glyph="📍" title="No addresses saved" text="Add an address for faster checkout." /> : (
        <div className="mr-addr-list">{addresses.map((a) => <div className="mr-addr-card" key={a.id}><strong>{a.name}</strong><p>{a.line1}, {a.city}, {a.state} — {a.pincode}</p><span>{a.phone}</span><button className="mr-addr-remove" onClick={() => persist(addresses.filter((x) => x.id !== a.id))}>Remove</button></div>)}</div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) { return <div className="mr-account-profile-row"><span>{label}</span><strong>{value}</strong></div>; }
function EmptyState({ glyph, title, text, action }: { glyph: string; title: string; text: string; action?: React.ReactNode }) {
  return <div className="mr-account-empty"><div className="mr-shop-empty-glyph">{glyph}</div><h4>{title}</h4><p>{text}</p>{action}</div>;
}
