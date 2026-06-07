'use client';
import Link from "next/link";
import Image from "next/image";
import { Leaf } from "../svg";

const HeroBannerTwo = ({imageSrc,imageAlt,title,subtitle,buttonText,buttonLink}) => {
  return (
    <div className="tp-hero-2-area">
      <div className="container container-1870">
        <div className="row">
          <div className="col-xl-12">
            <div className="tp-hero-2-wrapper-main">
              <div className="tp-hero-2-wrapper d-flex align-items-center p-relative">
                <div className="tp-hero-2-bg tp-gsap-bg tp-hero-bg-single" style={{ overflow: 'hidden' }}>
                  <img width={"100%"} height={"auto"} src={imageSrc} alt={imageAlt} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 1 }} />
                </div>
                <div className="tp-hero-2-content-wrap p-relative">
                  <div className="tp-hero-2-title-box">
                    <h2 className="tp-hero-2-title text-1 z-index-5">
                      {title}
                    </h2>
                    <p>
                      {subtitle}
                    </p>
                    <Link
                      className="tp-btn-white"
                      href={buttonLink}
                    >
                      {buttonText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBannerTwo;
