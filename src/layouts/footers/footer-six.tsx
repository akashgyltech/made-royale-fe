import Image from "next/image";
import Link from "next/link";
import { Email, Location } from "@/components/svg";
import payment from "@/assets/img/inner-shop/payment.png";
import social_data from "@/data/social-data";

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

export default function FooterSix() {
  return (
    <footer>
      <div className="tp-footer-6-area black-bg pt-100">
        <div className="container container-1300">
          <div className="tp-footer-6-widget-wrap">
            <div className="row">
              <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-60">
                <div className="tp-footer-6-widget footer-col-6-1">
                  <div className="tp-footer-6-logo">
                    <Link href="/" className="mr-logo mr-logo-light">Shi<span>zenta</span></Link>
                  </div>
                  <p className="mr-footer-about">Nature-inspired luxury furniture, handcrafted to become tomorrow&rsquo;s heirlooms.</p>
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
              <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-60">
                <div className="tp-footer-6-widget footer-col-6-2">
                  <h4 className="tp-footer-6-widget-title">Shop</h4>
                  <div className="tp-footer-6-list">
                    <ul>
                      {SHOP_LINKS.map((l) => (
                        <li key={l.title}><Link href={l.link}>{l.title}</Link></li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-lg-4 col-md-6 col-sm-4 mb-60">
                <div className="tp-footer-6-widget footer-col-6-3">
                  <h4 className="tp-footer-6-widget-title">Company &amp; Help</h4>
                  <div className="tp-footer-6-list">
                    <ul>
                      {COMPANY_LINKS.map((l) => (
                        <li key={l.title}><Link href={l.link}>{l.title}</Link></li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-5 col-md-6 col-sm-8 mb-60">
                <div className="tp-footer-6-widget footer-col-6-4">
                  <h4 className="tp-footer-6-widget-title">Newsletter</h4>
                  <div className="tp-footer-6-input-box">
                    <form action="#" onSubmit={(e) => e.preventDefault()}>
                      <label>Be the first to see new collections &amp; private offers.</label>
                      <div className="tp-footer-6-input p-relative">
                        <input type="email" placeholder="Enter Your Email" />
                        <button className="tp-btn-subscribe" type="submit">
                          Subscribe
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="tp-footer-6-social-box">
                    <h4 className="tp-footer-6-social-title">Follow Us On</h4>
                    <div className="tp-footer-6-social">
                      {social_data.map((item) => (
                        <Link key={item.id} href={item.link} target="_blank">
                          <i className={item.icon}></i>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tp-copyright-2-area tp-copyright-2-bdr-top black-bg">
          <div className="container container-1300">
            <div className="row align-items-center">
              <div className="col-lg-5 col-md-12">
                <div className="tp-copyright-2-left text-center text-lg-start">
                  <p className="mb-0">
                    All rights reserved — {new Date().getFullYear()} © Shizenta
                  </p>
                </div>
              </div>
              <div className="col-lg-7 col-md-12">
                <div className="mr-footer-legal">
                  {LEGAL_LINKS.map((l, i) => (
                    <span key={l.title}>
                      <Link href={l.link}>{l.title}</Link>
                      {i < LEGAL_LINKS.length - 1 && <em>·</em>}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mr-footer-payment text-center">
              <Image src={payment} alt="Accepted payment methods" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
