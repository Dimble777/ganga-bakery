
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import "./AdminReviews.css";

function AdminReviews({ onBack }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    let active = true;

    const loadReviews = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        console.error("Failed to load reviews:", error);
        setError("Unable to load reviews.");
      } else {
        setReviews(data || []);
        setError("");
      }

      setLoading(false);
    };

    loadReviews();

    return () => {
      active = false;
    };
  }, []);

  const updateReviewStatus = async (id, status) => {
    setUpdatingId(id);
    setError("");

    const { data, error } = await supabase
      .from("reviews")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Failed to update review:", error);
      setError("Unable to update review status.");
    } else {
      setReviews((current) =>
        current.map((review) =>
          review.id === id ? data : review
        )
      );
    }

    setUpdatingId(null);
  };

  return (
    <div className="admin-reviews">
      <header className="admin-reviews-header">
        <div>
          <p>GANGA BAKERY</p>
          <h1>Customer Reviews</h1>
        </div>

        <button
          className="admin-reviews-back"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>
      </header>

      <main className="admin-reviews-content">
        {loading && <p>Loading reviews...</p>}

        {error && <p role="alert">{error}</p>}

        {!loading && reviews.length === 0 && !error && (
          <div className="reviews-empty">
            <h2>No Reviews Yet</h2>
            <p>
              Customer reviews submitted through the website
              will appear here.
            </p>
          </div>
        )}

        {!loading && reviews.length > 0 && (
          <div className="admin-reviews-list">
            {reviews.map((item) => (
              <div className="admin-review-card" key={item.id}>
                <div className="admin-review-top">
                  <div>
                    <h2>{item.name}</h2>
                    <span>
                      {item.location || "Location not provided"}
                    </span>
                  </div>

                  <div className="admin-review-rating">
                    {"★".repeat(item.rating)}
                    {"☆".repeat(5 - item.rating)}
                  </div>
                </div>

                <p className="admin-review-text">
                  “{item.review}”
                </p>

                <div className="admin-review-status">
                  Status: <strong>{item.status}</strong>
                </div>

                <div className="admin-review-actions">
                  <button
                    className="approve-review"
                    disabled={updatingId !== null}
                    onClick={() =>
                      updateReviewStatus(item.id, "approved")
                    }
                  >
                    {updatingId === item.id
                      ? "Saving..."
                      : "Approve"}
                  </button>

                  <button
                    className="reject-review"
                    disabled={updatingId !== null}
                    onClick={() =>
                      updateReviewStatus(item.id, "rejected")
                    }
                  >
                    {updatingId === item.id
                      ? "Saving..."
                      : "Reject"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminReviews;
