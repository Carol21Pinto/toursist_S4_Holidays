import "./ContactIcons.css";

export default function ContactIcons() {
  const phoneNumber = "916363275937"; // replace later
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Pre-filled WhatsApp message
  const whatsappMessage = encodeURIComponent(
    "Hi, welcome to S4 Holidays, how can I assist you?"
  );

  return (
    <div className="contact-icons">
      {/* WhatsApp */}
      <a
        href={`https://wa.me/916363275937?text=${whatsappMessage}`} // replace with your number
        target="_blank"
        rel="noopener noreferrer"
        className="icon whatsapp"
      >
        <i className="fab fa-whatsapp"></i>
      </a>

      {/* Instagram */}
      <a
        href="https://instagram.com/yourpage" // replace later
        target="_blank"
        rel="noopener noreferrer"
        className="icon instagram"
      >
        <i className="fab fa-instagram"></i>
      </a>

      {/* Email */}
      <a
        href="mailto:company@example.com" // replace later
        className="icon email"
      >
        <i className="fas fa-envelope"></i>
      </a>

      {/* Phone */}
      {isMobile ? (
        <a href={`tel:${phoneNumber}`} className="icon phone">
          <i className="fas fa-phone"></i>
        </a>
      ) : (
        <div className="icon phone" title={phoneNumber}>
          <i className="fas fa-phone"></i>
        </div>
      )}
    </div>
  );
}
