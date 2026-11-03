
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import "./Products.css";

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setErrorMessage("");

      try {
        const [productsResult, categoriesResult] = await Promise.all([
          supabase.from("products").select("*").order("id", { ascending: true }),
          supabase.from("categories").select("id, name").order("id", { ascending: true }),
        ]);

        if (cancelled) return;
        if (productsResult.error) throw productsResult.error;

        setProducts(productsResult.data || []);

        if (categoriesResult.error) {
          console.error("Error loading categories:", categoriesResult.error);
        } else {
          setCategories(
            (categoriesResult.data || [])
              .map((category) => category.name)
              .filter(Boolean)
          );
        }
      } catch (error) {
        console.error("Error loading products:", error);
        if (!cancelled) {
          setErrorMessage("Unable to load products. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) =>
            (product.category || "").toLowerCase().trim() ===
            selectedCategory.toLowerCase().trim()
        );

  function handleAddToCart(product) {
    try {
      const existingCart = JSON.parse(
        localStorage.getItem("ganga-bakery-cart") || "[]"
      );

      const existingProduct = existingCart.find(
        (item) => String(item.id) === String(product.id)
      );

      const updatedCart = existingProduct
        ? existingCart.map((item) =>
            String(item.id) === String(product.id)
              ? { ...item, quantity: (item.quantity || 0) + 1 }
              : item
          )
        : [...existingCart, { ...product, quantity: 1 }];

      localStorage.setItem(
        "ganga-bakery-cart",
        JSON.stringify(updatedCart)
      );

      navigate("/cart");
    } catch (error) {
      console.error("Unable to update cart:", error);
      alert("Unable to add this product to your cart. Please try again.");
    }
  }

  function openProductDetails(product) {
    navigate(`/product/${product.id}`);
  }

  return (
    <section className="products-page">
      <button
        type="button"
        className="products-back-btn"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>

      <div className="products-heading">
        <p>GANGA BAKERY</p>
        <h1>Our Products</h1>
        <div className="products-line">
          <span />
          <strong>✦</strong>
          <span />
        </div>
        <p className="products-description">
          Discover freshly baked favourites, made with care and crafted to
          make every moment special.
        </p>
      </div>

      <div className="products-categories">
        <button
          type="button"
          className={selectedCategory === "All" ? "active" : ""}
          onClick={() => setSelectedCategory("All")}
        >
          All
        </button>

        {categories.map((category) => (
          <button
            type="button"
            key={category}
            className={selectedCategory === category ? "active" : ""}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="products-empty">
          <h2>Loading products...</h2>
        </div>
      ) : errorMessage ? (
        <div className="products-empty">
          <h2>{errorMessage}</h2>
          <button type="button" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="products-empty">
          <h2>No products yet</h2>
          <p>Products added from the Admin panel will appear here.</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div className="products-card" key={product.id}>
              <div className="products-image">
                {product.image ? (
                  
                    <img
  src={product.image}
  alt={product.name}
  loading="lazy"
/>
                ) : (
                  <div className="products-no-image">No Image</div>
                )}

                <button
                  type="button"
                  className="products-image-cart-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>

              <div className="products-info">
                <span className="products-category">
                  {product.category}
                </span>

                <h3
                  onClick={() => openProductDetails(product)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openProductDetails(product);
                    }
                  }}
                  role="link"
                  tabIndex={0}
                  style={{ cursor: "pointer" }}
                >
                  {product.name}
                </h3>

                <p className="products-price">₹{product.price}</p>

                {product.description && <small>{product.description}</small>}

                
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Products;
