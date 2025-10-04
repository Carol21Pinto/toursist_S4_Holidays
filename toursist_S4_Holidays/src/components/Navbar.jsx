import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Original opacity calculation
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
        <Link to="/" className="logo" aria-label="S4 Holidays Home">
          <img
            src={logo}
            alt="S4 Holidays"
            className="logo-img"
          />
        </Link>

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
          <li onClick={() => setMenuOpen(false)}>
            <Link to="/">Home</Link>
          </li>
          {/* <li onClick={() => setMenuOpen(false)}>
            <Link to="/about">About</Link>
          </li> */}
        </ul>
      </div>
    </nav>
  );
}
