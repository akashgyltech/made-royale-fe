'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import HeaderMenus from './header-menus';
import { Menu, Search, User, Wishlist, Zero } from '@/components/svg';
import CartOffcanvas from '@/components/offcanvas/cart-offcanvas';
import MobileOffcanvas from '@/components/offcanvas/mobile-offcanvas';
import useStickyHeader from '@/hooks/use-sticky-header';
import { useAuth } from '@/provider/AuthProvider';
import { useCart } from '@/provider/CartProvider';
import { useWishlist } from '@/provider/WishlistProvider';
import menu_data from '@/data/menu-data';
import type { IMenuDT } from '@/types/menu-d-t';
import { cmsApi } from '@/lib/store-api';
import { adaptHeaderMenu } from '@/lib/cms-content';
import SiteLogo from '@/components/ui/site-logo';

type Props = { transparent?: boolean };

export default function HeaderSix({ transparent = false }: Props) {
  const { isSticky, headerRef, headerFullWidth } = useStickyHeader(20);
  const [openOffCanvas, setOpenOffcanvas] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [term, setTerm] = useState('');
  // Static menu_data is the default/fallback — CMS content (if an admin has configured a
  // `header` doc) overwrites it once the fetch below resolves. Never leaves nav empty.
  const [menu, setMenu] = useState<IMenuDT[]>(menu_data);
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);
  const { user, isLoggedIn, openAuthModal, logout } = useAuth();
  const { count: cartCount, openDrawer } = useCart();
  const { count: wishCount } = useWishlist();

  useEffect(() => { headerFullWidth(); }, []);
  useEffect(() => {
    const onClick = (e: MouseEvent) => { if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);
  useEffect(() => {
    let cancelled = false;
    cmsApi.getByKey('header').then((content) => {
      if (cancelled) return;
      const adapted = adaptHeaderMenu(content);
      if (adapted) setMenu(adapted);
    }).catch(() => { /* no `header` CMS doc configured yet (or request failed) — keep the static fallback */ });
    return () => { cancelled = true; };
  }, []);

  const innerClass = transparent && !isSticky ? 'tp-inner-header-white' : 'tp-inner-header-2-bg';
  const submitSearch = () => { const q = term.trim(); router.push(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop'); };
  const initials = user?.name ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() : 'SZ';

  return (
    <>
      <header className="tp-header-height" ref={headerRef}>
        <div className={`tp-inner-header-2-area tp-shop-mob-space ${innerClass}`}>
          <div className="container container-1800">
            <div className="row align-items-center">
              <div className="col-xl-2 col-lg-4 col-md-4 col-4">
                <Link href="/" className="mr-logo">
                  <SiteLogo variant={transparent && !isSticky ? 'light' : 'dark'} className="mr-logo-img">
                    Shi<span>zenta</span>
                  </SiteLogo>
                </Link>
              </div>
              <div className="col-xl-5 d-none d-xl-block">
                <div className="tp-inner-header-2-menu header-main-menu">
                  <nav className="tp-main-menu-content"><HeaderMenus menu={menu} /></nav>
                </div>
              </div>
              <div className="col-xl-5 col-lg-8 col-md-8 col-8">
                <div className="tp-inner-header-2-right d-flex align-items-center justify-content-end">
                  <div className="tp-inner-header-2-search p-relative d-none d-lg-block">
                    <input type="text" placeholder="Search luxury furniture" value={term} onChange={(e) => setTerm(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') submitSearch(); }} />
                    <span onClick={submitSearch} style={{ cursor: 'pointer' }}><Search /></span>
                  </div>
                  <button className="tp-shop-mob-search d-lg-none" onClick={submitSearch} aria-label="Search"><span><Search /></span></button>

                  {isLoggedIn ? (
                    <div className="mr-profile-wrap" ref={profileRef}>
                      <button className="mr-profile-trigger" onClick={() => setProfileOpen((p) => !p)} aria-label="Profile">
                        <span className="mr-avatar-initials">{initials}</span>
                        <svg className={`mr-chevron ${profileOpen ? 'open' : ''}`} width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                      </button>
                      {profileOpen && (
                        <div className="mr-profile-dropdown">
                          <div className="mr-profile-dropdown-header">
                            <div className="mr-dropdown-avatar"><span>{initials}</span></div>
                            <div><div className="mr-dropdown-name">{user?.name}</div><div className="mr-dropdown-email">{user?.email}</div></div>
                          </div>
                          <div className="mr-dropdown-divider" />
                          <Link href="/account" className="mr-dropdown-item" onClick={() => setProfileOpen(false)}>My Account</Link>
                          <Link href="/account?tab=orders" className="mr-dropdown-item" onClick={() => setProfileOpen(false)}>My Orders</Link>
                          <Link href="/wishlist" className="mr-dropdown-item" onClick={() => setProfileOpen(false)}>Wishlist</Link>
                          <Link href="/track-order" className="mr-dropdown-item" onClick={() => setProfileOpen(false)}>Track Order</Link>
                          <div className="mr-dropdown-divider" />
                          <button className="mr-dropdown-item mr-dropdown-logout" onClick={() => { logout(); setProfileOpen(false); }}>Sign Out</button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button className="tp-inner-header-2-login p-relative mr-icon-btn" onClick={() => openAuthModal('login')} aria-label="Sign in"><span><User /></span></button>
                  )}

                  <Link className="tp-inner-header-2-wishlist p-relative mr-icon-btn" href="/wishlist" aria-label="Wishlist">
                    <span><Wishlist /></span>{wishCount > 0 && <span className="mr-icon-badge">{wishCount}</span>}
                  </Link>
                  <button onClick={() => setOpenOffcanvas(true)} className="tp-inner-header-2-bar tp-offcanvas-open-btn" aria-label="Menu"><span><Menu /></span></button>
                  <button onClick={openDrawer} className="tp-inner-header-2-cart cartmini-open-btn mr-icon-btn" aria-label="Cart">
                    <span><Zero /></span>{cartCount > 0 && <span className="mr-icon-badge">{cartCount}</span>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <CartOffcanvas />
      <MobileOffcanvas openOffcanvas={openOffCanvas} setOpenOffcanvas={setOpenOffcanvas} menu={menu} />
    </>
  );
}
