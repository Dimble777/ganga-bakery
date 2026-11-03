
import { useState } from "react";
import { supabase } from "../../utils/supabase";
import "./ReviewForm.css";

function ReviewForm({ onClose }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    const cleanName = name.trim();
    const cleanLocation = location.trim();
    const cleanReview = review.trim();

    if (
      cleanName.length < 2 ||
      cleanName.length > 100
    ) {
      setErrorMessage(
        "Please enter a name between 2 and 100 characters."
      );
      return;
    }

    if (cleanLocation.length > 100) {
      setErrorMessage(
        "Location must be 100 characters or fewer."
      );
      return;
    }

    if (
      cleanReview.length < 10 ||
      cleanReview.length > 2000
    ) {
      setErrorMessage(
        "Your review must be between 10 and 2000 characters."
      );
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const { error } = await supabase
        .from("reviews")
        .insert({
          name: cleanName,
          location: cleanLocation || null,
          rating,
          review: cleanReview,
          status: "pending",
        });

      if (error) throw error;

      alert(
        "Thank you for your review! ❤️\n\n" +
        "Your review has been submitted and is awaiting approval."
      );

      onClose();
    } catch (error) {
      console.error("Review submission failed:", error);

      setErrorMessage(
        "Unable to submit your review. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-form-overlay">
      <div className="review-form-card">
        <button
          className="review-form-close"
          onClick={onClose}
          type="button"
          disabled={submitting}
        >
          ×
        </button>

        <div className="review-form-heading">
          <p>GANGA BAKERY</p>
          <h2>Share Your Experience</h2>
          <span>We would love to hear from you.</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="review-form-input">
            <label htmlFor="review-name">
              Your Name
            </label>

            <input
              id="review-name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              minLength={2}
              maxLength={100}
              required
            />
          </div>

          <div className="review-form-input">
            <label htmlFor="review-location">
              Location
            </label>

            <input
              id="review-location"
              type="text"
              placeholder="Example: Jakkur"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              maxLength={100}
            />
          </div>

          <div className="review-form-input">
            <label>Your Rating</label>

            <div className="rating-select">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`${star} star${star > 1 ? "s" : ""}`}
                  aria-pressed={rating === star}
                  className={
                    star <= rating
                      ? "star active"
                      : "star"
                  }
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="review-form-input">
            <label htmlFor="review-text">
              Your Review
            </label>

            <textarea
              id="review-text"
              placeholder="Tell us about your experience..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={5}
              minLength={10}
              maxLength={2000}
              required
            />
          </div>

          {errorMessage && (
            <p role="alert" className="review-form-error">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            className="submit-review-button"
            disabled={submitting}
          >
            {submitting
              ? "Submitting..."
              : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReviewForm;
