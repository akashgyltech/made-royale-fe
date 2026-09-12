import React from "react";
import { CloseTwo, Facebook, Linkdin, Twitter } from "../svg";
import MobileMenus from "./mobile-menus";
import Link from "next/link";
import SiteLogo from "@/components/ui/site-logo";
import social_data from "@/data/social-data";
const SOCIAL_ICONS = { "fa-brands fa-facebook-f": Facebook, "fa-brands fa-twitter": Twitter, "fa-brands fa-linkedin-in": Linkdin };
export default function MobileOffcanvas({ openOffcanvas, setOpenOffcanvas, menu }) {
    return (<>
      <div className={`tp-offcanvas-area ${openOffcanvas ? "opened" : ""}`}>
        <div className="tp-offcanvas-wrapper">
          <div className="tp-offcanvas-top d-flex align-items-center justify-content-between">
            <div className="tp-offcanvas-logo">
              <Link href="/" onClick={() => setOpenOffcanvas(false)}>
                <SiteLogo variant="dark">
                  Shi<span>zenta</span>
                </SiteLogo>
              </Link>
            </div>
            <div className="tp-offcanvas-close">
              <button className="tp-offcanvas-close-btn" onClick={() => setOpenOffcanvas(false)}>
                <CloseTwo />
              </button>
            </div>
          </div>
          <div className="tp-offcanvas-main">
            <div className="tp-offcanvas-content">
              <h3 className="tp-offcanvas-title">Welcome to Shizenta</h3>
              <p>Nature-inspired luxury furniture, handcrafted to become tomorrow&rsquo;s heirlooms.</p>
            </div>
            <div className="tp-main-menu-mobile d-xl-none">
              <MobileMenus menu={menu}/>
            </div>
            <div className="tp-offcanvas-contact">
              <h3 className="tp-offcanvas-title sm">Information</h3>

              <ul>
                <li>
                  <Link href="tel:+912240001234">+91 22 4000 1234</Link>
                </li>
                <li>
                  <Link href="mailto:care@shizenta.com">care@shizenta.com</Link>
                </li>
                <li>
                  <Link href="https://www.google.com/maps" target="_blank">Design Arcade, Andheri East, Mumbai, Maharashtra 400069</Link>
                </li>
              </ul>
            </div>
            <div className="tp-offcanvas-social">
              <h3 className="tp-offcanvas-title sm">Follow Us</h3>
              <ul>
                {social_data.map((s) => {
                    const Icon = SOCIAL_ICONS[s.icon];
                    return Icon ? <li key={s.id}><Link href={s.link} target="_blank"><Icon /></Link></li> : null;
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div onClick={() => setOpenOffcanvas(false)} className={`body-overlay ${openOffcanvas ? "opened" : ""}`}></div>
    </>);
}
