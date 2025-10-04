import { useEffect, useState } from "react";
import "./ContactIcons.css";

export default function ContactIcons() {
  const phoneNumber = "916363275937";
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  // State for visibility - hide after scrolling 400px
  const [isVisible, setIsVisible] = useState(true);

  // Pre-filled WhatsApp message
  const whatsappMessage = encodeURIComponent(
    "Hi, welcome to S4 Holidays, how can I assist you?"
  );

  // Simple scroll detection - hide after 400px scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // Hide icons after scrolling down 400px
      // Adjust this number based on your hero section height
      const hideAfterPixels = 400;
      
      setIsVisible(scrollY < hideAfterPixels);
      
      // Debug log - remove after testing
      console.log(`Scroll: ${scrollY}px, Visible: ${scrollY < hideAfterPixels}`);
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Check initial position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`contact-icons ${isVisible ? 'show' : 'hide'}`}>
      {/* WhatsApp */}
      <a
        href={`https://wa.me/+919448790769?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="icon whatsapp"
        title="Chat on WhatsApp"
      >
        <i className="fab fa-whatsapp"></i>
      </a>

      {/* Instagram */}
      <a
        href="https://www.instagram.com/s4_holidays/?igsh=aHVyZDI3cDNiZ2o4#"
        target="_blank"
        rel="noopener noreferrer"
        className="icon instagram"
        title="Follow on Instagram"
      >
        <i className="fab fa-instagram"></i>
      </a>

      {/* Email */}
      <a
        href="mailto:company@example.com"
        className="icon email"
        title="Send Email"
      >
        <i className="fas fa-envelope"></i>
      </a>

      {/* Phone - FIXED: Always redirect to phone dialer */}
      <a 
        href={`tel:${phoneNumber}`} 
        className="icon phone"
        title={isMobile ? "Call Now" : `Call: ${phoneNumber}`}
      >
        <i className="fas fa-phone"></i>
      </a>
    </div>
  );
}
