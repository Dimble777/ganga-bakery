
import "./Navbar.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { supabase } from "../../utils/supabase";
import gangaLogo from "../../assets/logo/ganga-logo.svg";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState([
    "Cakes" ,
  "Theme Cake",
  "Wedding Cake",
  "Special Moments",
  "Pastries",
  "Bread",
  "Biscuits & Cookies",
  "Savory",
  "Desserts",
  "Snacks",
]);

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error loading navbar categories:", error);
        return;
      }

      if (isMounted) {
        setCategories(
          (data || [])
            .map((category) => category.name)
            .filter(Boolean)
        );
      }
    }

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const navLinks = ["Home", ...categories];

  const handleNavigation = (item) => {
    setMenuOpen(false);

    if (item === "Home") {
      navigate("/");
      return;
    }

    const slug = item
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/\s+/g, "-");

    navigate(`/category/${slug}`);
  };

  return (
    <nav className="navbar">
      <button
        className="mobile-menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <div
        className="mobile-navbar-logo"
        onClick={() => navigate("/")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            navigate("/");
          }
        }}
      >
        <img src={gangaLogo} alt="Ganga Bakery" />
      </div>

      <ul className={`nav-links ${menuOpen ? "mobile-open" : ""}`}>
        {navLinks.map((item) => (
          <li key={item} onClick={() => handleNavigation(item)}>
            {item}
          </li>
        ))}
      </ul>

      <div className="mobile-actions">
        <div className="mobile-icons">
          <button
            className="mobile-icon-btn"
            aria-label="Shopping cart"
            onClick={() => navigate("/cart")}
          >
            <FaShoppingCart />
          </button>
        </div>

        <button
          className="navbar-order-btn"
          onClick={() => navigate("/cart")}
        >
          Order Now
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
