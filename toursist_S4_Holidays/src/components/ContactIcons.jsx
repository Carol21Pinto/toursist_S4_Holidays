import { useEffect, useState } from "react";
import "./ContactIcons.css";

export default function ContactIcons() {
  const [showEmailOptions, setShowEmailOptions] = useState(false);
  const [showWhatsAppOptions, setShowWhatsAppOptions] = useState(false);
  const phoneNumber = "918904814416";
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const [isVisible, setIsVisible] = useState(true);

  // WhatsApp message
  const message = "Hello S4 Holidays! I'm interested in your travel packages. Could you please share details about destinations, pricing, and availability?";
  const encodedMessage = encodeURIComponent(message);

  // WhatsApp URLs
  const whatsAppWeb = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
  const whatsAppDesktop = `whatsapp://send?phone=${phoneNumber}`;
  const whatsAppMobile = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

  // Email options
  const emailSubject = encodeURIComponent("Travel Package Inquiry - S4 Holidays");
  const emailBody = encodeURIComponent(
    `Dear S4 Holidays Team,

I'm interested in your travel packages:
✈️ Domestic Tours | 🌏 International Tours | 🕉️ Pilgrimage Tours | 👥 Group Travel

Please share details about destinations, pricing, and availability.

Thank you!`
  );

  // Handle WhatsApp click
  const handleWhatsAppClick = (e) => {
    if (isMobile) {
      // Mobile: directly open WhatsApp app
      window.open(whatsAppMobile, '_blank');
    } else {
      // Desktop: show options (Web or Desktop app)
      e.preventDefault();
      setShowWhatsAppOptions(true);
    }
  };

  // Handle email click
  const handleEmailClick = () => {
    if (isMobile) {
      window.location.href = `mailto:s4holidaysblr@gmail.com?subject=${emailSubject}&body=${emailBody}`;
    } else {
      setShowEmailOptions(true);
    }
  };

  // Copy email
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("s4holidaysblr@gmail.com");
      alert("✅ Email copied: s4holidaysblr@gmail.com");
    } catch (err) {
      alert("Our email: s4holidaysblr@gmail.com");
    }
    setShowEmailOptions(false);
  };

  // Scroll detection
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
          href={isMobile ? whatsAppMobile : "#"}
          onClick={handleWhatsAppClick}
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

      {/* WhatsApp Options Modal for Desktop */}
      {showWhatsAppOptions && (
        <div className="email-modal-overlay" onClick={() => setShowWhatsAppOptions(false)}>
          <div className="email-modal" onClick={e => e.stopPropagation()}>
            <h3>💬 Open WhatsApp</h3>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>
              Choose how you want to contact us
            </p>
            <div className="email-options">
              
              {/* WhatsApp Web - PRIMARY (with message support) */}
              <a
                href={whatsAppWeb}
                target="_blank"
                rel="noopener noreferrer"
                className="email-option"
                style={{ 
                  border: '2px solid #25D366',
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
                }}
                onClick={() => setShowWhatsAppOptions(false)}
              >
                <i className="fas fa-globe" style={{ color: '#128C7E', fontSize: '1.3rem' }}></i>
                <div>
                  <strong style={{ color: '#25D366' }}>WhatsApp Web ⭐ Recommended</strong>
                  <small style={{ display: 'block', color: '#15803d' }}>
                    ✅ Opens with pre-filled message
                  </small>
                </div>
              </a>

              {/* WhatsApp Desktop App - SECONDARY (no message support) */}
              <a
                href={whatsAppDesktop}
                className="email-option"
                onClick={() => setShowWhatsAppOptions(false)}
              >
                <i className="fab fa-whatsapp" style={{ color: '#25D366' }}></i>
                <div>
                  <strong>WhatsApp Desktop App</strong>
                  <small style={{ display: 'block', color: '#666' }}>
                    Opens desktop app (if installed)
                  </small>
                </div>
              </a>

              {/* Copy Number */}
              <button 
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText('+918904814416');
                    alert('✅ Phone number copied: +91 8904814416');
                  } catch (err) {
                    alert('Phone: +91 8904814416');
                  }
                  setShowWhatsAppOptions(false);
                }}
                className="email-option"
              >
                <i className="fas fa-copy"></i>
                <div>
                  <strong>Copy Number</strong>
                  <small style={{ display: 'block', color: '#666' }}>+91 8904814416</small>
                </div>
              </button>
            </div>
            <button onClick={() => setShowWhatsAppOptions(false)} className="close-modal">
              ✕ Close
            </button>
          </div>
        </div>
      )}

      {/* Email Options Modal */}
      {showEmailOptions && (
        <div className="email-modal-overlay" onClick={() => setShowEmailOptions(false)}>
          <div className="email-modal" onClick={e => e.stopPropagation()}>
            <h3>📧 Contact Us via Email</h3>
            <div className="email-options">
              
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

              <a
                href={`mailto:s4holidaysblr@gmail.com?subject=${emailSubject}&body=${emailBody}`}
                className="email-option"
                onClick={() => setShowEmailOptions(false)}
              >
                <i className="fas fa-envelope"></i>
                Open Email App
              </a>

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
