import { useNavigate } from "react-router-dom";
import "./OrderCTA.css";

function OrderCTA() {
  const navigate = useNavigate();

  const handleWhatsApp = () => {
    const phoneNumber = "91XXXXXXXXXX";

    const message = encodeURIComponent(
      "Hi Ganga Bakery! I would like to know more about your products."
    );

    window.open(
      `https://wa.me/${phoneNumber}?text=${message}`,
      "_blank"
    );
  };

  return (
    <section className="order-cta">

      <div className="order-cta-content">

        <p className="order-cta-label">
          MADE FRESH FOR YOU
        </p>

        <h2>
          Something Sweet
          <br />
          Is Waiting For You
        </h2>

        <div className="order-cta-line">
          <span></span>
          <strong>✦</strong>
          <span></span>
        </div>

        <p className="order-cta-text">
          From everyday treats to unforgettable celebrations,
          discover something delicious at Ganga Bakery.
        </p>

        <div className="order-cta-buttons">

          <button
            className="cta-order-btn"
            onClick={() => navigate("/cart")}
          >
            Order Online
          </button>

          <button
            className="cta-contact-btn"
            onClick={handleWhatsApp}
          >
            Contact Us
          </button>

        </div>

      </div>

    </section>
  );
}

export default OrderCTA;