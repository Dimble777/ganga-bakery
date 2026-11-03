import "./Hero.css";
import hero from "../../assets/hero.png";
import logo from "../../assets/logo/ganga-logo.svg";
import birthday from "../../assets/categories/birthday.jpg";
import theme from "../../assets/categories/theme.jpg";
import pastries from "../../assets/categories/pastries.jpg";
import bread from "../../assets/categories/bread.jpg";
import cookies from "../../assets/categories/cookies.jpg";
import desserts from "../../assets/categories/desserts.jpg";
import savory from "../../assets/categories/savory.jpg";
import delicacies from "../../assets/categories/delicacies.jpg";
import {
  FaHandSparkles,
  FaLeaf,
  FaBirthdayCake,
  FaStore,
  FaTruck,
  FaAward
} from "react-icons/fa";
function Hero() {
  return (
    <>
    
      <section className="hero">
  <div className="hero-left">
    <h3>Since 1988 • Fresh • Delicious • Handmade</h3>

    <h1>Freshly Baked Happiness, Every Day.</h1>

    <p>
      Welcome to <span className="brand-name">Ganga Bakery</span>, where every cake,
      pastry and loaf is crafted with passion.
    </p>
  </div> {/* <-- This closing div is missing */}

  <div className="hero-right">
    <img src={hero} alt="Cake" className="hero-image" />
  </div>
</section>

      
<div className="category-section">

  <h2>Shop by Category</h2>

  <div className="category-slider">

    <div className="category-item">
      <img src={birthday} alt="Birthday Cake" />
      <p>Birthday Cake</p>
    </div>

    <div className="category-item">
      <img src={theme} alt="Theme Cake" />
      <p>Theme Cake</p>
    </div>

    <div className="category-item">
      <img src={pastries} alt="Pastries" />
      <p>Pastries</p>
    </div>

    <div className="category-item">
      <img src={bread} alt="Bread" />
      <p>Bread</p>
    </div>

    <div className="category-item">
      <img src={cookies} alt="Cookies" />
      <p>Cookies</p>
    </div>

    <div className="category-item">
      <img src={desserts} alt="Desserts" />
      <p>Desserts</p>
    </div>

    <div className="category-item">
      <img src={savory} alt="Savory" />
      <p>Savory</p>
    </div>

    <div className="category-item">
      <img src={delicacies} alt="Delicacies" />
      <p>Delicacies</p>
    </div>

  </div>

</div>

<div className="feature-bar">

  <div className="feature-item">
    <FaHandSparkles className="feature-icon" />
    <h4>Handcrafted</h4>
    <p>With Love</p>
  </div>

  <div className="feature-item">
    <FaLeaf className="feature-icon" />
    <h4>Fresh Ingredients</h4>
    <p>Premium Quality</p>
  </div>

  <div className="feature-item">
    <FaBirthdayCake className="feature-icon" />
    <h4>Custom Designs</h4>
    <p>Made Just for You</p>
  </div>

  <div className="feature-item">
    <FaStore className="feature-icon" />
    <h4>9 Locations</h4>
    <p>Across Bangalore</p>
  </div>

  <div className="feature-item">
    <FaTruck className="feature-icon" />
    <h4>Express Delivery</h4>
    <p>Fresh to Your Door</p>
  </div>

  <div className="feature-item">
    <FaAward className="feature-icon" />
    <h4>Trusted Since 1988</h4>
    <p>36+ Years of Excellence</p>
  </div>

</div>

      {/* Outlets Bar */}
      <div className="outlets-bar">
        <span>📍 Ganga Nagar</span>
        <span>📍 R.T. Nagar</span>
        <span>📍 Sultanpalya</span>
        <span>📍 Kempapura</span>
        <span>📍 Jakkur</span>
        <span>📍 Banaswadi</span>
        <span>📍 T.C. Palya</span>
        <span>📍 Vasanth Nagar</span>
        <span>📍 Nagavara</span>

        <button>View All →</button>
      </div>
    </>
  );
}

export default Hero;