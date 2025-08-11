import React, { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <span className="logo-main">Pacific</span>
        <span className="logo-sub">TRAVEL AGENCY</span>
      </div>

      {/* Desktop Menu */}
      <ul className="nav-links">
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Destination</a></li>
        <li><a href="#">Hotel</a></li>
        <li><a href="#">Blog</a></li>
        <li><a href="#">Contact</a></li>
      </ul>

      {/* Hamburger Icon */}
      <div className="hamburger" onClick={toggleMenu}>
        ☰
      </div>

      {/* Mobile Overlay Menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <span className="close-btn" onClick={toggleMenu}>×</span>
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Destination</a>
        <a href="#">Hotel</a>
        <a href="#">Blog</a>
        <a href="#">Contact</a>
      </div>
    </nav>
  );
}

export default Navbar;
