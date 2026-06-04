import React, { useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import "./Hero.css";

const bgImage =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80";

function Hero() {
  const wtRef = useRef(null);
  const s4Ref = useRef(null);
  const tgRef = useRef(null);

  useEffect(() => {
    [wtRef, s4Ref, tgRef].forEach((ref) => {
      if (ref.current) {
        ref.current.style.animation = "none";
        void ref.current.offsetHeight;
      }
    });
    if (wtRef.current)
      wtRef.current.style.animation = "fadeUp 0.9s ease forwards 0.4s";
    if (s4Ref.current)
      s4Ref.current.style.animation = "fadeUp 1s ease forwards 0.8s";
    if (tgRef.current)
      tgRef.current.style.animation = "fadeUp 0.9s ease forwards 1.2s";
  }, []);

  return (
    <>
      <Helmet>
        <link rel="preload" as="image" href={bgImage} fetchpriority="high" />
      </Helmet>

      <section className="hero" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="hero-color-overlay" />
        <div className="hero-content">
          <p className="hero-subtitle" ref={wtRef}>
            Explore • Experience • Enjoy
          </p>
          <h1 className="hero-brand" ref={s4Ref}>
            S4 Holidays
          </h1>
          <p className="hero-tagline" ref={tgRef}>
            Discover breathtaking destinations and unique travel experiences.
          </p>
        </div>
      </section>
    </>
  );
}

export default Hero;