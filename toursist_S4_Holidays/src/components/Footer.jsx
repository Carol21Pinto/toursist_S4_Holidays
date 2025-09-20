import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Company Info Column */}
        <div className="footer-column">
          <h3>S4 Holidays</h3>
          <ul>
            <li>Your trusted travel partner</li>
            <li>Domestic Tours</li>
            <li>International Tours</li>
            <li>Pilgrimage Tours</li>
            <li>Group Travel</li>
          </ul>
        </div>

        {/* Our Offices Column */}
        <div className="footer-column">
          <h3>Our Offices</h3>
          <ul>
            <li>Main Office - Bangalore</li>
            <li>130, 6th Cross, Teachers Colony</li>
            <li>Bangalore, Karnataka, India</li>
            <li>Branch Office - Devanahalli</li>
            <li>Karnataka 562110, India</li>
          </ul>
        </div>

        {/* Contact Information Column */}
        <div className="footer-column">
          <h3>Contact Information</h3>
          <ul>
            <li>+91 8904814416</li>
            <li>+91 7349473023</li>
            <li>+91 9972401136</li>
            <li>+91 7406332300</li>
            <li>+91 7019533081</li>
            <li>+91 9513130336</li>
            <li>Email: Coming Soon...</li>
          </ul>
        </div>

        {/* Connect With Us Column */}
        <div className="footer-column connect-column">
          <h3>Connect With Us</h3>
          <div className="social-icons">
            <span className="social-icon instagram">📷</span>
            <span className="social-icon whatsapp">💬</span>
            <span className="social-icon email">✉️</span>
            <span className="social-icon phone">📞</span>
          </div>
          <p>Follow us @s4_holidays</p>
          <p>Quick Booking & Support</p>
        </div>
        
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; 2024 S4 Holidays. All Rights Reserved. | Made in India 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
