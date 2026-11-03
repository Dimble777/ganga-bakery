import "./Footer.css";

import logo from "../../assets/logo/ganga-logo.svg";

function Footer() {
  return (
    <footer className="site-footer">

      <div className="footer-container">

        {/* Brand */}

        <div className="footer-brand">

          <div className="footer-logo-circle">
  <img
    src={logo}
    alt="Ganga Bakery"
    className="footer-logo"
  />
</div>
          <p>
            Freshly baked happiness, every day.
            Since 1988, we have been creating
            delicious moments for every occasion.
          </p>

          <div className="footer-socials">

            <a href="#" aria-label="Instagram">
              Instagram
            </a>

            <a href="#" aria-label="Facebook">
              Facebook
            </a>

            <a href="#" aria-label="WhatsApp">
              WhatsApp
            </a>

          </div>

        </div>


        {/* Quick Links */}

        <div className="footer-column">

          <h3>Quick Links</h3>

          <a href="#">Home</a>
          <a href="#">Birthday Cakes</a>
          <a href="#">Theme Cakes</a>
          <a href="#">Wedding Cakes</a>
          <a href="#">Special Moments</a>

        </div>


        {/* Products */}

        <div className="footer-column">

          <h3>Explore</h3>

          <a href="#">Pastries</a>
          <a href="#">Bread</a>
          <a href="#">Biscuits & Cookies</a>
          <a href="#">Savory</a>
          <a href="#">Desserts</a>
          <a href="#">Delicacies</a>

        </div>


        {/* Contact */}

        <div className="footer-column footer-contact">

          <h3>Contact Us</h3>

          <p>
            Bangalore, Karnataka
          </p>

          <a href="tel:+919000000000">
            +91 90000 00000
          </a>

          <a href="mailto:info@gangabakery.com">
            info@gangabakery.com
          </a>

          <p className="footer-hours">
            Mon – Sun<br />
            7:00 AM – 10:00 PM
          </p>

        </div>

      </div>


      {/* Bottom */}

      <div className="footer-bottom">

        <p>
          © 2026 Ganga Bakery. All rights reserved.
        </p>

        <div className="footer-bottom-links">

          <a href="#">
            Privacy Policy
          </a>

          <a href="#">
            Terms & Conditions
          </a>

        </div>

      </div>

    </footer>
  );
}

export default Footer;