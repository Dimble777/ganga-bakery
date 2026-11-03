
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import "./CustomerReviews.css";
import ReviewForm from "./ReviewForm";

function CustomerReviews() {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadReviews = async () => {
      setLoading(true);
      setError("");

      const { data, error: fetchError } = await supabase
        .from("reviews")
        .select("id, name, location, rating, review")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (!active) return;

      if (fetchError) {
        console.error("Error loading reviews:", fetchError);
        setError("Unable to load customer reviews.");
      } else {
        setReviews(data || []);
      }

      setLoading(false);
    };

    loadReviews();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="customer-reviews">

      <div className="reviews-heading">
        <p className="reviews-label">
          WHAT OUR CUSTOMERS SAY
        </p>

        <h2>
          Loved by Our Customers
        </h2>

        <div className="reviews-line">
          <span></span>
          <strong>✦</strong>
          <span></span>
        </div>

        <p className="reviews-intro">
          Every celebration means a little more when our customers
          leave with a smile.
        </p>
      </div>

      {loading && (
        <p>Loading customer reviews...</p>
      )}

      {error && (
        <p role="alert">{error}</p>
      )}

      {!loading && !error && reviews.length === 0 && (
        <p>
          No customer reviews published yet.
        </p>
      )}

      <div className="reviews-grid">
        {reviews.map((item) => (
          <div
            className="review-card"
            key={item.id}
          >
            <div className="review-stars">
              {"★".repeat(item.rating)}
              {"☆".repeat(5 - item.rating)}
            </div>

            <p className="review-text">
              “{item.review}”
            </p>

            <div className="review-author">
              <div className="review-avatar">
                {item.name?.charAt(0) || "G"}
              </div>

              <div>
                <h3>{item.name}</h3>

                <span>
                  {item.location || "Ganga Bakery"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="write-review-section">
        <p>
          Had a great experience with us?
        </p>

        <button
          className="write-review-button"
          onClick={() => setShowReviewForm(true)}
        >
          Write a Review
        </button>
      </div>

      {showReviewForm && (
        <ReviewForm
          onClose={() => setShowReviewForm(false)}
        />
      )}

    </section>
  );
}

export default CustomerReviews;
