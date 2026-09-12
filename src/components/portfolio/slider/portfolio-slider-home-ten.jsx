import React, { useState } from "react";
import Slider from "react-slick";
import Link from "next/link";
import "slick-carousel/slick/slick.css";
import { SlickNextArrow, SlickPrevArrow } from "../../slick-arrow";
const slider_setting_one = {
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    speed: 1000,
    nextArrow: <SlickNextArrow />,
    prevArrow: <SlickPrevArrow />,
};
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
        { breakpoint: 1600, settings: { slidesToShow: 3 } },
        { breakpoint: 1400, settings: { slidesToShow: 2 } },
        { breakpoint: 1200, settings: { slidesToShow: 2 } },
        { breakpoint: 992, settings: { arrows: false, slidesToShow: 3 } },
        { breakpoint: 768, settings: { arrows: false, slidesToShow: 2 } },
        { breakpoint: 480, settings: { arrows: false, slidesToShow: 1 } },
    ],
};
const TypedSlider = Slider;
export default function PortfolioSliderHomeTen({ rooms = [] }) {
    const [slider1, setSlider1] = useState(null);
    const [slider2, setSlider2] = useState(null);
    const [sliderIndex, setSliderIndex] = useState(1);
    if (rooms.length === 0) return null;
    return (<div className="tp-portfolio-11-area fix">
      <div className="tp-portfolio-11-slider-wrap p-relative">
        <TypedSlider {...slider_setting_one} asNavFor={slider2} ref={(slider) => setSlider1(slider)} className="tp-portfolio-11-slider-active">
          {rooms.map((room) => (<div key={room.id}>
              <div className="tp-portfolio-11-slider-bg pt-170 pb-150 d-flex align-items-end" style={{ backgroundImage: `url(${room.banner || room.image})` }}>
                <div style={{
                position: "absolute",
                inset: 0,
                zIndex: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.05) 100%)",
                pointerEvents: "none",
            }}/>
                <div className="tp-portfolio-11-slider-content" style={{ position: "relative", zIndex: 1 }}>
                  <span className="tp-portfolio-11-slider-subtitle">
                    Shop by Room <br /> {room.tagline}
                  </span>
                  <h3 className="tp-portfolio-11-slider-title">
                    <Link href={`/room/${room.slug}`}>{room.name}</Link>
                  </h3>
                  <Link href={`/room/${room.slug}`} className="tp-portfolio-11-slider-btn" style={{
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
            }}>
                    Shop {room.name}
                  </Link>
                </div>
              </div>
            </div>))}
        </TypedSlider>

        <div className="dddd"></div>

        <div className="tp-portfolio-11-slider-nav-wrap z-index-5">
          <div className="slides-numbers d-none d-lg-flex d-flex align-items-center" style={{ display: "inline-block" }}>
            <div className="slider-line"></div>
            <span className="active">
              {sliderIndex < 10 ? `0${sliderIndex}` : sliderIndex}
            </span>
          </div>
          <TypedSlider {...slider_setting_two} asNavFor={slider1} ref={(slider) => setSlider2(slider)} afterChange={(index) => setSliderIndex(index + 1)} className="tp-portfolio-11-slider-nav-active d-none d-lg-block">
            {rooms.map((room) => (<div key={room.id} className="tp-portfolio-11-slider-nav-item p-relative">
                <div className="tp-portfolio-11-slider-nav-thumb">
                  <img src={room.image || room.banner} alt={room.name} style={{ height: "auto", width: "100%" }}/>
                </div>
                <div className="tp-portfolio-11-slider-nav-content-wrap">
                  <div className="tp-portfolio-11-slider-nav-content d-flex flex-column justify-content-between">
                    <div className="tp-portfolio-11-slider-nav-year">
                      <span>{room.name}</span>
                    </div>
                    <div className="tp-portfolio-11-slider-nav-tittle-box">
                      <span className="tp-portfolio-11-slider-nav-subtittle">
                        {room.tagline}
                      </span>
                      <h4 className="tp-portfolio-11-slider-nav-tittle">
                        <Link href={`/room/${room.slug}`}>{room.name}</Link>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>))}
          </TypedSlider>
        </div>
      </div>
    </div>);
}
