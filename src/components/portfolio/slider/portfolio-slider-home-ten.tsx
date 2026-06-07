import React, { useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import Link from "next/link";
import "slick-carousel/slick/slick.css";

// images
import port_sm_1 from "@/assets/img/home-11/living-room-port-sm-1.webp";
import port_sm_2 from "@/assets/img/home-11/berdoom-port-sm-2.webp";
import port_sm_3 from "@/assets/img/home-11/port-sm-3.jpg";
import port_sm_4 from "@/assets/img/home-11/port-sm-4.jpg";
import port_sm_5 from "@/assets/img/home-11/port-sm-5.jpg";
import { SlickNextArrow, SlickPrevArrow } from "../../slick-arrow";

// slider data
const slider_data = [
  {
    id: 1,
    bg: "/assets/img/home-11/living-room-port-1.webp",
    subtitle: "Signature Collection",
    year: "Living Room",
    title: "Grand <br> Living",
    shopLink: "/shop?room=living-room",
  },
  {
    id: 2,
    bg: "/assets/img/home-11/bedroom-port-2.webp",
    subtitle: "Bespoke Interiors",
    year: "Bedroom",
    title: "Serene <br> Retreat",
    shopLink: "/shop?room=bedroom",
  },
  {
    id: 3,
    bg: "/assets/img/home-11/port-3.jpg",
    subtitle: "Artisan Craft",
    year: "Kitchen",
    title: "Culinary <br> Elegance",
    shopLink: "/shop?room=kitchen",
  },
  {
    id: 4,
    bg: "/assets/img/home-11/port-4.jpg",
    subtitle: "Fine Dining",
    year: "Dining Room",
    title: "Table <br> Royale",
    shopLink: "/shop?room=dining-room",
  },
  {
    id: 5,
    bg: "/assets/img/home-11/port-5.jpg",
    subtitle: "Executive Series",
    year: "Study Room",
    title: "Scholar's <br> Sanctum",
    shopLink: "/shop?room=study-room",
  },
];

// slider thumbs
const slider_thumbs = [
  {
    id: 1,
    img: port_sm_1,
    subtitle: "Signature Collection",
    year: "Living Room",
    title: "Grand Living",
    shopLink: "/shop?room=living-room",
  },
  {
    id: 2,
    img: port_sm_2,
    subtitle: "Bespoke Interiors",
    year: "Bedroom",
    title: "Serene Retreat",
    shopLink: "/shop?room=bedroom",
  },
  {
    id: 3,
    img: port_sm_3,
    subtitle: "Artisan Craft",
    year: "Kitchen",
    title: "Culinary Elegance",
    shopLink: "/shop?room=kitchen",
  },
  {
    id: 4,
    img: port_sm_4,
    subtitle: "Fine Dining",
    year: "Dining Room",
    title: "Table Royale",
    shopLink: "/shop?room=dining-room",
  },
  {
    id: 5,
    img: port_sm_5,
    subtitle: "Executive Series",
    year: "Study Room",
    title: "Scholar's Sanctum",
    shopLink: "/shop?room=study-room",
  },
];

// slider setting one
const slider_setting_one = {
  slidesToShow: 1,
  slidesToScroll: 1,
  fade: true,
  speed: 1000,
  nextArrow: <SlickNextArrow />,
  prevArrow: <SlickPrevArrow />,
};

// slider setting two
const slider_setting_two = {
  slidesToShow: 4,
  slidesToScroll: 1,
  dots: false,
  arrows: true,
  focusOnSelect: true,
  centerPadding: "0",
  speed: 600,
  nextArrow: <SlickNextArrow />,
  prevArrow: <SlickPrevArrow />,
  responsive: [
    {
      breakpoint: 1600,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 1400,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 992,
      settings: {
        arrows: false,
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 768,
      settings: {
        arrows: false,
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 480,
      settings: {
        arrows: false,
        slidesToShow: 4,
      },
    },
  ],
};

// Slider component with proper typing
const TypedSlider = Slider as React.ComponentType<any>;

export default function PortfolioSliderHomeTen() {
  const [slider1, setSlider1] = useState<any>(null);
  const [slider2, setSlider2] = useState<any>(null);
  const [sliderIndex, setSliderIndex] = useState<number>(1);

  return (
    <div className="tp-portfolio-11-area fix">
      <div className="tp-portfolio-11-slider-wrap p-relative">
        <TypedSlider
          {...slider_setting_one}
          asNavFor={slider2}
          ref={(slider: any) => setSlider1(slider)}
          className="tp-portfolio-11-slider-active"
        >
          {slider_data.map((item) => (
            <div key={item.id}>
              <div
                className="tp-portfolio-11-slider-bg pt-170 pb-150 d-flex align-items-end"
                style={{ backgroundImage: `url(${item.bg})` }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.05) 100%)",
                    pointerEvents: "none",
                  }}
                />
                <div className="tp-portfolio-11-slider-content" style={{ position: "relative", zIndex: 1 }}>
                  <span className="tp-portfolio-11-slider-subtitle">
                    {item.year} <br /> {item.subtitle}
                  </span>
                  <h3 className="tp-portfolio-11-slider-title">
                    <Link
                      href={item.shopLink}
                      dangerouslySetInnerHTML={{ __html: item.title }}
                    ></Link>
                  </h3>
                  <Link
                    href={item.shopLink}
                    className="tp-portfolio-11-slider-btn"
                    style={{
                      display: "inline-block",
                      marginTop: "20px",
                      padding: "12px 32px",
                      backgroundColor: "#ffffff",
                      color: "#000000",
                      borderRadius: "50px",
                      fontWeight: 600,
                      fontSize: "14px",
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      textDecoration: "none",
                    }}
                  >
                    Shop {item.year}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </TypedSlider>

        <div className="dddd"></div>

        <div className="tp-portfolio-11-slider-nav-wrap z-index-5">
          <div
            className="slides-numbers d-none d-lg-flex d-flex align-items-center"
            style={{ display: "inline-block" }}
          >
            <div className="slider-line"></div>
            <span className="active">
              {sliderIndex < 10 ? `0${sliderIndex}` : sliderIndex}
            </span>
          </div>
          <TypedSlider
            {...slider_setting_two}
            asNavFor={slider1}
            ref={(slider: any) => setSlider2(slider)}
            afterChange={(index: number) => setSliderIndex(index + 1)}
            className="tp-portfolio-11-slider-nav-active d-none d-lg-block"
          >
            {slider_thumbs.map((item) => (
              <div
                key={item.id}
                className="tp-portfolio-11-slider-nav-item p-relative"
              >
                <div className="tp-portfolio-11-slider-nav-thumb">
                  <Image
                    src={item.img}
                    alt="thumb-img"
                    style={{ height: "auto" }}
                  />
                </div>
                <div className="tp-portfolio-11-slider-nav-content-wrap">
                  <div className="tp-portfolio-11-slider-nav-content d-flex flex-column justify-content-between">
                    <div className="tp-portfolio-11-slider-nav-year">
                      <span>{item.year}</span>
                    </div>
                    <div className="tp-portfolio-11-slider-nav-tittle-box">
                      <span className="tp-portfolio-11-slider-nav-subtittle">
                        {item.subtitle}
                      </span>
                      <h4 className="tp-portfolio-11-slider-nav-tittle">
                        <Link href={item.shopLink}>{item.title}</Link>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TypedSlider>
        </div>
      </div>
    </div>
  );
}