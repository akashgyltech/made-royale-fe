'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import HeaderMenus from './header-menus';
import { Menu, Search, User, Wishlist, Zero } from '@/components/svg';
import CartOffcanvas from '@/components/offcanvas/cart-offcanvas';
import MobileOffcanvas from '@/components/offcanvas/mobile-offcanvas';
import useStickyHeader from '@/hooks/use-sticky-header';

type Props = {
  transparent?: boolean;
};

export default function HeaderSix({ transparent = false }: Props) {
  const { isSticky, headerRef, headerFullWidth } = useStickyHeader(20);
  const [openCartMini, setOpenCartMini] = React.useState(false);
  const [openOffCanvas, setOpenOffcanvas] = React.useState(false);

  useEffect(() => {
    headerFullWidth();
  }, []);

  // The element is always position:fixed (via SCSS on .tp-inner-header-2-area).
  // We only swap the visual state class so the background/icons cross-fade smoothly.
  const innerClass =
    transparent && !isSticky ? 'tp-inner-header-white' : 'tp-inner-header-2-bg';

  return (
    <>
      <header className="tp-header-height" ref={headerRef}>
        <div className={`tp-inner-header-2-area tp-shop-mob-space ${innerClass}`}>
          <div className="container container-1800">
            <div className="row align-items-center">
              <div className="col-xl-2 col-lg-4 col-md-4 col-4">
                <div className="tp-header-logo">
                  {/* <Link href="/">
                    <Image priority src={logo} alt="logo" />
                  </Link> */}
                </div>
              </div>
              <div className="col-xl-5 d-none d-xl-block">
                <div className="tp-inner-header-2-menu header-main-menu">
                  <nav className="tp-main-menu-content">
                    <HeaderMenus />
                  </nav>
                </div>
              </div>
              <div className="col-xl-5 col-lg-8 col-md-8 col-8">
                <div className="tp-inner-header-2-right d-flex align-items-center justify-content-end">
                  <div className="tp-inner-header-2-search p-relative d-none d-lg-block">
                    <input type="text" placeholder="Search" />
                    <span>
                      <Search />
                    </span>
                  </div>
                  <button className="tp-shop-mob-search d-lg-none">
                    <span>
                      <Search />
                    </span>
                  </button>
                  <Link className="tp-inner-header-2-login p-relative" href="/login">
                    <span>
                      <User />
                    </span>
                  </Link>
                  <Link className="tp-inner-header-2-wishlist p-relative" href="/wishlist">
                    <i>o</i>
                    <span>
                      <Wishlist />
                    </span>
                  </Link>
                  <button
                    onClick={() => setOpenOffcanvas(true)}
                    className="tp-inner-header-2-bar tp-offcanvas-open-btn"
                  >
                    <span>
                      <Menu />
                    </span>
                  </button>
                  <button
                    onClick={() => setOpenCartMini(true)}
                    className="tp-inner-header-2-cart cartmini-open-btn"
                  >
                    <span>
                      <Zero />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <CartOffcanvas openCartMini={openCartMini} setOpenCartMini={setOpenCartMini} />

      <MobileOffcanvas openOffcanvas={openOffCanvas} setOpenOffcanvas={setOpenOffcanvas} />
    </>
  );
}
