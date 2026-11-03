
import "./BestSellers.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFeaturedProducts } from "../../utils/productStorage";

function BestSellers() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load featured products from Supabase
  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
       const featuredProducts = await getFeaturedProducts();




if (!cancelled) {
  setProducts(featuredProducts);
}
      } catch (error) {
        console.error("Products loading error:", error);

        if (!cancelled) {
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  // Add product to cart
  const handleAddToCart = (product) => {
    try {
      const existingCart = JSON.parse(
        localStorage.getItem("ganga-bakery-cart") || "[]"
      );

      const existingItem = existingCart.find(
        (item) => String(item.id) === String(product.id)
      );

      let updatedCart;

      if (existingItem) {
        updatedCart = existingCart.map((item) =>
          String(item.id) === String(product.id)
            ? {
                ...item,
                quantity: (item.quantity || 0) + 1,
              }
            : item
        );
      } else {
        updatedCart = [
          ...existingCart,
          {
            ...product,
            quantity: 1,
          },
        ];
      }

      localStorage.setItem(
        "ganga-bakery-cart",
        JSON.stringify(updatedCart)
      );

      navigate("/cart");
    } catch (error) {
      console.error("Unable to update cart:", error);
      alert(
        "Unable to add this product to your cart. Please try again."
      );
    }
  };

  return (
    <section className="best-sellers">
      <div className="best-sellers-heading">
        <p>OUR CUSTOMER FAVOURITES</p>

        <h2>Best Sellers</h2>

        <div className="best-sellers-line">
          <span></span>
          <strong>✦</strong>
          <span></span>
        </div>

        <p className="best-sellers-description">
          Some of the favourites our customers keep coming back for.
        </p>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No featured products available right now.</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div
              className="product-card"
              key={product.id}
              onClick={() => handleAddToCart(product)}
              style={{ cursor: "pointer" }}
            >
              <div className="product-image">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                />
              </div>

              <div className="product-info">
                <span className="product-category">
                  {product.category}
                </span>

                <h3>{product.name}</h3>

                <p className="product-price">
                  ₹{product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        className="view-products-btn"
        onClick={() => navigate("/products")}
      >
        View All Products
      </button>
    </section>
  );
}

export default BestSellers;
