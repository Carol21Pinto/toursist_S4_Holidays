import { useEffect, useState } from "react";
import "./ContactIcons.css";

export default function ContactIcons() {
  const [showEmailOptions, setShowEmailOptions] = useState(false);
  const phoneNumber = "918904814416";
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const [isVisible, setIsVisible] = useState(true);

  // WhatsApp and other existing code...
  const whatsappMessage = encodeURIComponent(
    `Hello S4 Holidays! 🌍

I'm interested in your travel packages. I would like to know more about:

✈️ Domestic Tours
🌏 International Tours  
🕉️ Pilgrimage Tours
👥 Group Travel Packages

Could you please share detailed information about destinations, pricing, and availability?`
  );

  // Email options
  const emailSubject = encodeURIComponent("Travel Package Inquiry - S4 Holidays");
  const emailBody = encodeURIComponent(`Dear S4 Holidays Team,

I'm interested in your travel packages:
✈️ Domestic Tours | 🌏 International Tours | 🕉️ Pilgrimage Tours | 👥 Group Travel

Please share details about destinations, pricing, and availability.

Thank you!`);

  // Handle email click with multiple options
  const handleEmailClick = () => {
    if (isMobile) {
      // Mobile - try mailto directly
      window.location.href = `mailto:s4holidaysblr@gmail.com?subject=${emailSubject}&body=${emailBody}`;
    } else {
      // Desktop - show options
      setShowEmailOptions(true);
    }
  };

  // Copy email to clipboard
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("s4holidaysblr@gmail.com");
      alert("Email copied: s4holidaysblr@gmail.com");
    } catch (err) {
      alert("Our email: s4holidaysblr@gmail.com");
    }
    setShowEmailOptions(false);
  };

  // Scroll detection code (keep existing)...
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY < 400);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className={`contact-icons ${isVisible ? 'show' : 'hide'}`}>
        {/* WhatsApp */}
        <a
          href={`https://wa.me/${phoneNumber}?text=${whatsappMessage}`}
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

        {/* Email - Enhanced for desktop */}
        <div className="icon email" onClick={handleEmailClick} title="Email Options">
          <i className="fas fa-envelope"></i>
        </div>

        {/* Phone */}
        <a 
          href={`tel:+${phoneNumber}`} 
          className="icon phone"
          title="Call S4 Holidays"
        >
          <i className="fas fa-phone"></i>
        </a>
      </div>

      {/* Email Options Modal for Desktop */}
      {showEmailOptions && (
        <div className="email-modal-overlay" onClick={() => setShowEmailOptions(false)}>
          <div className="email-modal" onClick={e => e.stopPropagation()}>
            <h3>Contact Us via Email</h3>
            <div className="email-options">
              
              {/* Gmail Web */}
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=s4holidaysblr@gmail.com&su=${emailSubject}&body=${emailBody}`}
                target="_blank"
                rel="noopener noreferrer"
                className="email-option"
                onClick={() => setShowEmailOptions(false)}
              >
                <i className="fab fa-google"></i>
                Open in Gmail
              </a>

              {/* Outlook Web */}
              <a
                href={`https://outlook.live.com/mail/0/deeplink/compose?to=s4holidaysblr@gmail.com&subject=${emailSubject}&body=${emailBody}`}
                target="_blank"
                rel="noopener noreferrer"
                className="email-option"
                onClick={() => setShowEmailOptions(false)}
              >
                <i className="fab fa-microsoft"></i>
                Open in Outlook
              </a>

              {/* Regular Mailto */}
              <a
                href={`mailto:s4holidaysblr@gmail.com?subject=${emailSubject}&body=${emailBody}`}
                className="email-option"
                onClick={() => setShowEmailOptions(false)}
              >
                <i className="fas fa-envelope"></i>
                Open Email App
              </a>

              {/* Copy Email */}
              <button onClick={copyEmail} className="email-option">
                <i className="fas fa-copy"></i>
                Copy Email Address
              </button>
            </div>
            <button onClick={() => setShowEmailOptions(false)} className="close-modal">
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
