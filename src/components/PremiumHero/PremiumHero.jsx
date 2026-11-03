import "./PremiumHero.css";

import { useEffect, useState } from "react";

import hero from "../../assets/hero.webp";

import bg1 from "../../assets/backgrounds/bg1.webp";
import bg2 from "../../assets/backgrounds/bg2.webp";
import bg3 from "../../assets/backgrounds/bg3.webp";
import bg4 from "../../assets/backgrounds/bg4.webp";
import bg5 from "../../assets/backgrounds/bg5.webp";
import bg6 from "../../assets/backgrounds/bg6.webp";

import logo from "../../assets/logo/ganga-logo.svg";
import { FaWhatsapp } from "react-icons/fa";

function PremiumHero() {
  const slides = [
    {
      title: "Freshly Baked Happiness",
      subtitle: "Every Morning",
      background: bg1,
    },
    {
      title: "Sweet Moments",
      subtitle: "Deserve Something Special",
      background: bg2,
    },
    {
      title: "Premium Ingredients",
      subtitle: "Authentic Taste",
      background: bg3,
    },
    {
      title: "Crafted With Love",
      subtitle: "Baked With Passion",
      background: bg4,
    },
    {
      title: "Fresh Bakes",
      subtitle: "Delivered With Care",
      background: bg5,
    },
    {
      title: "Made Fresh",
      subtitle: "Made For You",
      background: bg6,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);
return (
  <section className="premium-hero">

    <a
  href="https://wa.me/919747253996"
  className="whatsapp-btn"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Chat with Ganga Bakery on WhatsApp"
>
  <FaWhatsapp />
</a>

    {/* your existing Premium Hero code */}
   

      {/* Decorative page elements */}
      <div className="page-design">
        <div className="gold-ring ring-one"></div>
        <div className="gold-ring ring-two"></div>

        <div className="gold-dot dot-one"></div>
        <div className="gold-dot dot-two"></div>

        <div className="decor-leaf leaf-one">❧</div>
        <div className="decor-leaf leaf-two">❧</div>
      </div>

      {/* Logo */}
      <img
        src={logo}
        alt="Ganga Bakery"
        className="premium-logo"
      />

      {/* Main Hero */}
      <div className="premium-container">

        {/* Text Section */}
        <div className="premium-text">

          <div
            className="premium-left"
            style={{
              backgroundImage: `url(${slides[currentSlide].background})`,
            }}
          >

            <div className="hero-content">

              <h3>
                Since 1988 • Fresh • Delicious • Handmade
              </h3>

              <div className="decorative-line">
                <span></span>
                <strong>✦</strong>
                <span></span>
              </div>

              <h1>
                {slides[currentSlide].title}
                <br />
                <span>
                  {slides[currentSlide].subtitle}
                </span>
              </h1>

              <p>
                Welcome to
                <span className="brand-name">
                  {" "}Ganga Bakery
                </span>
                , where every cake, pastry and loaf is crafted
                with passion using premium ingredients.
              </p>

            </div>

          </div>

        </div>

        {/* Cake Section */}
        <div className="premium-right">

          <img
            src={hero}
            alt="Hero Cake"
            className="premium-cake"
          />

        </div>

      </div>

    </section>
  );
}

export default PremiumHero;