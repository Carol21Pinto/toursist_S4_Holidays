import React from "react";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="overlay">
        <p className="welcome-text">Welcome to Pacific</p>
        <h1>Discover Your Favorite Place with Us</h1>
        <p className="tagline">
          Travel to any corner of the world, without going around in circles
        </p>
        <button className="play-btn">▶</button>
      </div>
    </section>
  );
}

export default Hero;
