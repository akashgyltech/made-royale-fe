"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Email, Location } from "@/components/svg";
import social_data from "@/data/social-data";
import { cmsApi } from "@/lib/store-api";
import { adaptFooterContent } from "@/lib/cms-content";
import SiteLogo from "@/components/ui/site-logo";
const SHOP_LINKS = [
    { title: "Sofas & Seating", link: "/category/sofas" },
    { title: "Beds & Bedroom", link: "/category/beds" },
    { title: "Dining", link: "/category/dining" },
    { title: "Wardrobes", link: "/category/wardrobes" },
    { title: "Tables", link: "/category/tables" },
    { title: "All Furniture", link: "/shop" },
];
const COMPANY_LINKS = [
    { title: "About Us", link: "/about-us" },
    { title: "Contact", link: "/contact" },
    { title: "Bulk & Trade Enquiry", link: "/bulk-enquiry" },
    { title: "Track Order", link: "/track-order" },
    { title: "My Account", link: "/account" },
    { title: "FAQs", link: "/faq" },
];
const LEGAL_LINKS = [
    { title: "Privacy Policy", link: "/privacy-policy" },
    { title: "Terms & Conditions", link: "/terms-conditions" },
    { title: "Refund & Returns", link: "/refund-policy" },
    { title: "Shipping & Delivery", link: "/shipping-policy" },
];
const DEFAULT_DESCRIPTION = "Nature-inspired luxury furniture, handcrafted to become tomorrow’s heirlooms.";
const DEFAULT_COLUMNS = [
    { title: "Shop", links: SHOP_LINKS },
    { title: "Company & Help", links: COMPANY_LINKS },
];
const SOCIAL_PLATFORMS = [
    { key: "facebook", icon: "fa-brands fa-facebook-f" },
    { key: "instagram", icon: "fa-brands fa-instagram" },
    { key: "youtube", icon: "fa-brands fa-youtube" },
    { key: "twitter", icon: "fa-brands fa-twitter" },
    { key: "linkedin", icon: "fa-brands fa-linkedin-in" },
    { key: "pinterest", icon: "fa-brands fa-pinterest-p" },
];
export default function FooterSix() {
    // Static content above is the default/fallback — a CMS `footer` doc (if an admin has
    // configured one) overrides individual fields once the fetch below resolves.
    const [content, setContent] = useState(null);
    useEffect(() => {
        let cancelled = false;
        cmsApi.getByKey("footer").then((raw) => {
            if (cancelled)
                return;
            setContent(adaptFooterContent(raw));
        }).catch(() => { });
        return () => { cancelled = true; };
    }, []);
    const description = content?.description ?? DEFAULT_DESCRIPTION;
    const columns = content?.columns ?? DEFAULT_COLUMNS;
    const copyright = content?.copyright ?? `All rights reserved — ${new Date().getFullYear()} © Shizenta`;
    const gstin = content?.gstin;
    const socialLinks = content?.social
        ? SOCIAL_PLATFORMS
            .filter((p) => content.social?.[p.key])
            .map((p) => ({ id: p.key, icon: p.icon, link: content.social[p.key] }))
        : social_data.map((s) => ({ id: String(s.id), icon: s.icon, link: s.link }));
    return (<footer>
      <div className="tp-footer-6-area black-bg pt-100">
        <div className="container container-1300">
          <div className="tp-footer-6-widget-wrap">
            <div className="row">
              <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-60">
                <div className="tp-footer-6-widget footer-col-6-1">
                  <div className="tp-footer-6-logo">
                    <Link href="/" className="mr-logo mr-logo-light">
                      <SiteLogo variant="light" className="mr-logo-img">
                        Shi<span>zenta</span>
                      </SiteLogo>
                    </Link>
                  </div>
                  <p className="mr-footer-about">{description}</p>
                  <div className="tp-footer-6-talk">
                    <span>Got Questions? Call us</span>
                    <h4>
                      <Link href="tel:+912240001234">+91 22 4000 1234</Link>
                    </h4>
                  </div>
                  <div className="tp-footer-6-contact">
                    <div className="tp-footer-6-contact-item d-flex align-items-start">
                      <div className="tp-footer-6-contact-icon">
                        <span>
                          <Email />
                        </span>
                      </div>
                      <div className="tp-footer-6-contact-content">
                        <Link href="mailto:care@shizenta.com">care@shizenta.com</Link>
                      </div>
                    </div>
                    <div className="tp-footer-6-contact-item d-flex align-items-start">
                      <div className="tp-footer-6-contact-icon">
                        <span>
                          <Location />
                        </span>
                      </div>
                      <div className="tp-footer-6-contact-content">
                        <Link href="https://www.google.com/maps" target="_blank">
                          Design Arcade, Andheri East
                          <br />
                          Mumbai, Maharashtra 400069
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {columns.map((col, i) => (<div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-60" key={col.title + i}>
                  <div className={`tp-footer-6-widget footer-col-6-${i + 2}`}>
                    <h4 className="tp-footer-6-widget-title">{col.title}</h4>
                    <div className="tp-footer-6-list">
                      <ul>
                        {col.links.map((l) => (<li key={l.title}><Link href={l.link}>{l.title}</Link></li>))}
                      </ul>
                    </div>
                  </div>
                </div>))}
            </div>
          </div>
        </div>
        <div className="tp-copyright-2-area tp-copyright-2-bdr-top black-bg py-2">
          <div className="container container-1300">
            <div className="row align-items-center">
              <div className="col-lg-5 col-md-12">
                <div className="tp-copyright-2-left text-center text-lg-start">
                  <p className="mb-0 mr-footer-copyright">
                    {copyright}
                    {gstin && <><em>·</em>GSTIN: {gstin}</>}
                  </p>
                </div>
              </div>
              <div className="col-lg-7 col-md-12">
                <div className="mr-footer-legal">
                  {LEGAL_LINKS.map((l, i) => (<span key={l.title}>
                      <Link href={l.link}>{l.title}</Link>
                      {i < LEGAL_LINKS.length - 1 && <em>·</em>}
                    </span>))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>);
}
