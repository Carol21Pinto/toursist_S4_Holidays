import { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const opacity = Math.min(scrollY / 200, 1);

  return (
    <nav
      className="navbar"
      style={{
        backgroundColor: `rgba(0, 0, 0, ${opacity * 0.7})`,
        backdropFilter: opacity > 0 ? "blur(8px)" : "none",
      }}
    >
      <div className="navbar-container">
        <div className="logo">Pacific TRAVEL AGENCY</div>

        {/* Hamburger menu icon */}
        <div
          className={`menu-icon ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Nav links */}
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li onClick={() => setMenuOpen(false)}>Home</li>
          <li onClick={() => setMenuOpen(false)}>About</li>
          <li onClick={() => setMenuOpen(false)}>Destination</li>
          <li onClick={() => setMenuOpen(false)}>Hotel</li>
          <li onClick={() => setMenuOpen(false)}>Blog</li>
          <li onClick={() => setMenuOpen(false)}>Contact</li>
        </ul>
      </div>
    </nav>
  );
}
