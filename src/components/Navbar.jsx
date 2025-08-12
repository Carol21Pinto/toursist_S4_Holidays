import { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate background opacity based on scroll position (0 to 1)
  const opacity = Math.min(scrollY / 200, 1);

  return (
    <nav
      className={`navbar`}
      style={{
        backgroundColor: `rgba(0, 0, 0, ${opacity * 0.7})`,
        backdropFilter: opacity > 0 ? "blur(8px)" : "none",
      }}
    >
      <div className="navbar-container">
        <div className="logo">Pacific TRAVEL AGENCY</div>
        <ul className="nav-links">
          <li>Home</li>
          <li>About</li>
          <li>Destination</li>
          <li>Hotel</li>
          <li>Blog</li>
          <li>Contact</li>
        </ul>
      </div>
    </nav>
  );
}
