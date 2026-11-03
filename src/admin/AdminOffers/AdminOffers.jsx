
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import "./AdminOffers.css";

const FUNCTION_URL =
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-offers`;

async function manageOffers(payload) {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) throw sessionError;

  if (!session?.access_token) {
    throw new Error("Please log in again to manage offers.");
  }

  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Offer operation failed.");
  }

  return result;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Could not read the image."));
        return;
      }

      resolve(reader.result.split(",")[1]);
    };

    reader.onerror = () =>
      reject(new Error("Could not read the image."));

    reader.readAsDataURL(file);
  });
}

function normalizeOffer(offer) {
  return {
    ...offer,
    image: offer.image ?? offer.image_url ?? "",
    startDate: offer.startDate ?? offer.start_date ?? "",
    endDate: offer.endDate ?? offer.end_date ?? "",
  };
}

function AdminOffers({ onBack }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [active, setActive] = useState(true);

  const loadOffers = async () => {
    setLoading(true);

    try {
      const result = await manageOffers({ action: "list" });
      setOffers((result.offers || []).map(normalizeOffer));
    } catch (error) {
      console.error("Could not load offers:", error);
      alert(error.message || "Could not load offers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      alert("Please choose a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 700 * 1024) {
      alert("Please choose an image smaller than 700 KB.");
      event.target.value = "";
      return;
    }

    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview((oldPreview) => {
      if (oldPreview.startsWith("blob:")) {
        URL.revokeObjectURL(oldPreview);
      }
      return previewUrl;
    });
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDiscount("");
    setStartDate("");
    setEndDate("");
    setActive(true);
    setImageFile(null);

    setImagePreview((oldPreview) => {
      if (oldPreview.startsWith("blob:")) {
        URL.revokeObjectURL(oldPreview);
      }
      return "";
    });

    const input = document.getElementById("offer-image-input");
    if (input) input.value = "";
  };

  const handleAddOffer = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();
    const cleanDiscount = discount.trim();

    if (!cleanTitle || !cleanDescription || !cleanDiscount ||
        !startDate || !endDate) {
      alert("Please fill in all required fields.");
      return;
    }

    if (endDate < startDate) {
      alert("End date cannot be earlier than start date.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        action: "create",
        title: cleanTitle,
        description: cleanDescription,
        discount: cleanDiscount,
        startDate,
        endDate,
        active,
      };

      if (imageFile) {
        payload.imageBase64 = await fileToBase64(imageFile);
        payload.imageContentType = imageFile.type;
      }

      await manageOffers(payload);
      await loadOffers();
      resetForm();
      alert("Offer added successfully.");
    } catch (error) {
      console.error("Could not add offer:", error);
      alert(error.message || "Could not add the offer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (offer) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await manageOffers({
        action: "toggle",
        id: offer.id,
        active: !offer.active,
      });

      await loadOffers();

      alert(
        offer.active
          ? "Offer deactivated successfully."
          : "Offer activated successfully."
      );
    } catch (error) {
      console.error("Could not update offer:", error);
      alert(error.message || "Could not update the offer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (offer) => {
    if (isSubmitting) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${offer.title}"?`
    );

    if (!confirmed) return;

    setIsSubmitting(true);

    try {
      await manageOffers({ action: "delete", id: offer.id });
      await loadOffers();
      alert("Offer deleted successfully.");
    } catch (error) {
      console.error("Could not delete offer:", error);
      alert(error.message || "Could not delete the offer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-offers">
      <header className="admin-offers-header">
        <div>
          <h1>Ganga Bakery</h1>
          <p>Offer Management</p>
        </div>

        <button
          type="button"
          className="admin-offers-back"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>
      </header>

      <main className="admin-offers-content">
        <section className="add-offer-section">
          <h2>Add New Offer</h2>

          <form onSubmit={handleAddOffer}>
            <div className="offer-input">
              <label htmlFor="offer-title">Offer Title</label>
              <input
                id="offer-title"
                type="text"
                maxLength={150}
                placeholder="Example: Birthday Special"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
            </div>

            <div className="offer-input">
              <label htmlFor="offer-description">Description</label>
              <textarea
                id="offer-description"
                maxLength={2000}
                placeholder="Example: Get 20% off on birthday cakes"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
              />
            </div>

            <div className="offer-input">
              <label htmlFor="offer-discount">Discount</label>
              <input
                id="offer-discount"
                type="text"
                maxLength={100}
                placeholder="Example: 20% OFF"
                value={discount}
                onChange={(event) => setDiscount(event.target.value)}
                required
              />
            </div>

            <div className="offer-input">
              <label htmlFor="offer-image-input">Offer Image</label>
              <input
                id="offer-image-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
              />

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Offer preview"
                  className="offer-image-preview"
                />
              )}
            </div>

            <div className="offer-date-row">
              <div className="offer-input">
                <label htmlFor="offer-start-date">Start Date</label>
                <input
                  id="offer-start-date"
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  required
                />
              </div>

              <div className="offer-input">
                <label htmlFor="offer-end-date">End Date</label>
                <input
                  id="offer-end-date"
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(event) => setEndDate(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="offer-active">
              <label>
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(event) => setActive(event.target.checked)}
                />
                {" "}Offer is Active
              </label>
            </div>

            <button
              type="submit"
              className="add-offer-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Add Offer"}
            </button>
          </form>
        </section>

        <section className="offer-list-section">
          <h2>Offers ({offers.length})</h2>

          {loading ? (
            <p className="no-offers">Loading offers...</p>
          ) : offers.length === 0 ? (
            <p className="no-offers">No offers found in Supabase.</p>
          ) : (
            <div className="offer-list">
              {offers.map((offer) => (
                <div className="offer-card" key={offer.id}>
                  {offer.image && (
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="offer-list-image"
                    />
                  )}

                  <div className="offer-info">
                    <h3>{offer.title}</h3>
                    <p>{offer.description}</p>
                    <strong>{offer.discount}</strong>

                    <small>
                      {offer.startDate} → {offer.endDate}
                    </small>

                    <span
                      className={
                        offer.active
                          ? "offer-active-status"
                          : "offer-inactive-status"
                      }
                    >
                      {offer.active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="offer-actions">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleToggleActive(offer)}
                    >
                      {offer.active ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      type="button"
                      className="delete-offer-button"
                      disabled={isSubmitting}
                      onClick={() => handleDelete(offer)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminOffers;
