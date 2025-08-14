import React, { useState, useEffect } from "react";
import "./Hero.css";

 const images = [
   "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=1600&q=80",
 ];

function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide every 6 seconds
  // useEffect(() => {
  //   const slideInterval = setInterval(nextSlide, 6000);
  //   return () => clearInterval(slideInterval);
  // }, []);

  // const prevSlide = () => {
  //   setCurrentIndex(
  //     (prevIndex) => (prevIndex - 1 + images.length) % images.length
  //   );
  // };

  // const nextSlide = () => {
  //   setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  // };

  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${images[currentIndex] || images[0]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh" // Ensures it always fills the screen
      }}
    >
      <div className="overlay">
        <p className="welcome-text">Explore • Experience • Enjoy</p>
        <h1>S4 HOLIDAYS</h1> 
        <p className="tagline">
          Discover breathtaking destinations and unique travel experiences.
        </p>
        
        <button className="play-btn">▶</button>
      </div>

      {/* Arrows */}
      {/* <button className="arrow left" onClick={prevSlide}>
        ❮
      </button>
      <button className="arrow right" onClick={nextSlide}>
        ❯
      </button> */}
    </section>
  );
}

export default Hero;
