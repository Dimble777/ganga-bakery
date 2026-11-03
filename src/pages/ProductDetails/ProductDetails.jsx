
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProducts } from "../../utils/productStorage";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      setLoading(true);
      setError("");

      try {
        const products = await getProducts();

        const foundProduct = products.find(
          (item) => String(item.id) === String(id)
        );

        if (isMounted) {
          setProduct(foundProduct || null);
        }
      } catch (err) {
        console.error("Could not load product details:", err);

        if (isMounted) {
          setError("Unable to load this product. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <section className="product-not-found">
        <p>Loading product details...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="product-not-found">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>← Go Back</button>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="product-not-found">
        <h2>Product Not Found</h2>
        <button onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </section>
    );
  }

  const categorySlug = product.category
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-");

  return (
    <section className="product-details-page">
      <button
        className="product-back-btn"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="product-details-container">
        <div className="product-details-image">
          {product.image ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <div className="product-details-no-image">
              No Image
            </div>
          )}
        </div>

        <div className="product-details-content">
          <p className="product-details-label">
            {product.category}
          </p>

          <h1>{product.name}</h1>

          <div className="product-details-line">
            <span></span>
            <strong>✦</strong>
            <span></span>
          </div>

          <p className="product-details-price">
            ₹{product.price}
          </p>

          <p className="product-details-description">
            {product.description}
          </p>

          <button
            className="product-order-btn"
            onClick={() => {
              const message = `Hi Ganga Bakery, I would like to order ${product.name}.`;
              window.open(
                `https://wa.me/919999999999?text=${encodeURIComponent(message)}`,
                "_blank",
                "noopener,noreferrer"
              );
            }}
          >
            Order Now
          </button>

          <button
            className="product-category-btn"
            onClick={() => navigate(`/category/${categorySlug}`)}
          >
            View More {product.category}
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
