
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductsByCategory } from "../../utils/productStorage";
import "./CategoryPage.css";

function normalize(value = "") {
  return String(value)
    .replace(/&/g, " and ")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function CategoryPage() {
  const { category = "" } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
  let cancelled = false;
  const pageStartTime = performance.now();

  async function loadProducts() {
    setLoading(true);
    setError(false);

    try {
      const categoryNames = {
        "biscuits-and-cookies": "Biscuits & Cookies",
      };

      const categoryName =
        categoryNames[category] ||
        category
          .split("-")
          .map(
            (word) =>
              word.charAt(0).toUpperCase() + word.slice(1)
          )
          .join(" ");

      const startTime = performance.now();

      const result = await getProductsByCategory(categoryName);

      console.log(
        "Category products loading:",
        Math.round(performance.now() - startTime),
        "ms"
      );

      if (!cancelled) {
        setProducts(Array.isArray(result) ? result : []);
      }
    } catch (err) {
      console.error("Unable to load products:", err);

      if (!cancelled) {
        setError(true);
      }
    } finally {
      if (!cancelled) {
        console.log(
          "Category loading duration:",
          Math.round(performance.now() - pageStartTime),
          "ms"
        );

        setLoading(false);
      }
    }
  }

  loadProducts();

  return () => {
    cancelled = true;
  };
}, [category]);

  function handleAddToCart(product) {
    try {
      const existingCart = JSON.parse(
        localStorage.getItem("ganga-bakery-cart") || "[]"
      );

      const existingItem = existingCart.find(
        (item) => String(item.id) === String(product.id)
      );

      const updatedCart = existingItem
        ? existingCart.map((item) =>
            String(item.id) === String(product.id)
              ? {
                  ...item,
                  quantity: (item.quantity || 0) + 1,
                }
              : item
          )
        : [
            ...existingCart,
            {
              ...product,
              quantity: 1,
            },
          ];

      localStorage.setItem(
        "ganga-bakery-cart",
        JSON.stringify(updatedCart)
      );

      navigate("/cart");
    } catch (err) {
      console.error("Unable to update cart:", err);
      alert("Unable to add this product to your cart. Please try again.");
    }
  }

  const selectedCategory = normalize(category);

  const filteredProducts = products.filter(
    (product) => normalize(product.category) === selectedCategory
  );

  const heading = category
    ? category.replace(/[-_]+/g, " ")
    : "All Products";

  return (
    <main className="category-page">
      <header className="category-page-header">
        <h1>{heading}</h1>
        <p>Discover freshly made favourites from Ganga Bakery.</p>
      </header>

      {loading ? (
        <div className="category-empty">
          <p>Loading products...</p>
        </div>
      ) : error ? (
        <div className="category-empty">
          <h2>Unable to load products</h2>
          <p>Please try again.</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="category-empty">
          <h2>No products found in this category</h2>
          <p>Browse all our bakery products instead.</p>

          <button
            type="button"
            onClick={() => navigate("/products")}
          >
            Browse All Products
          </button>
        </div>
      ) : (
        <div className="category-products-grid">
          {filteredProducts.map((product) => (
            <article
              className="category-product-card"
              key={product.id}
            >
              <div className="category-product-image-wrapper">
                {product.image ? (
                  <img
                    className="category-product-image"
                    src={product.image}
                    alt={product.name || "Bakery product"}
                    loading="lazy"
                  />
                ) : (
                  <div className="category-product-placeholder">
                    Ganga Bakery
                  </div>
                )}

                <button
                  type="button"
                  className="category-image-cart-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>

              <div className="category-product-info">
                <h2>{product.name}</h2>

                {product.description && (
                  <p>{product.description}</p>
                )}

                <strong>
                  ₹
                  {Number(product.price || 0).toLocaleString("en-IN")}
                </strong>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default CategoryPage;
