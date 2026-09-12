'use client';
import Link from "next/link";
import Image from "next/image";
import { Leaf } from "../svg";
const HeroBannerTwo = ({ imageSrc, imageAlt, title, subtitle, buttonText, buttonLink }) => {
    return (<div className="tp-hero-2-area">
      <div className="container container-1870">
        <div className="row">
          <div className="col-xl-12">
            <div className="tp-hero-2-wrapper-main">
              <div className="tp-hero-2-wrapper d-flex align-items-center p-relative">
                <div className="tp-hero-2-bg tp-gsap-bg tp-hero-bg-single" style={{ overflow: 'hidden' }}>
                  <img width={"100%"} height={"auto"} src={imageSrc} alt={imageAlt}/>
                  <div className="mr-hero2-overlay"/>
                </div>
                <div className="tp-hero-2-content-wrap p-relative mr-hero2-content-wrap">
                  <div className="tp-hero-2-title-box mr-hero2-glass">
                    <h2 className="tp-hero-2-title text-1 z-index-5 mr-hero2-title">
                      {title}
                    </h2>
                    <p className="mr-hero2-subtitle">
                      {subtitle}
                    </p>
                    <Link className="tp-btn-white" href={buttonLink}>
                      {buttonText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
export default HeroBannerTwo;
