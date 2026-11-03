
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import "./Offers.css";

function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadOffers() {
      try {
        const { data, error } = await supabase
          .from("offers")
          .select("*")
          .eq("active", true)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error loading offers:", error);
          return;
        }

        if (mounted) {
          setOffers(data || []);
        }
      } catch (error) {
        console.error("Unexpected error loading offers:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadOffers();

    return () => {
      mounted = false;
    };
  }, []);

  // Use local calendar dates to check offer validity.
  const now = new Date();
  const todayKey = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  const activeOffers = offers.filter((offer) => {
    // Supabase column names are startDate and endDate.
    const startDate = offer.startDate;
    const endDate = offer.endDate;

    if (!startDate || !endDate) return false;

    return startDate <= todayKey && todayKey <= endDate;
  });

  if (loading || activeOffers.length === 0) {
    return null;
  }

  return (
    <section className="offers-section">
      <div className="offers-heading">
        <p>SEASONAL SPECIALS</p>
        <h2>Special Offers</h2>

        <div className="offers-line">
          <span></span>
          <strong>✦</strong>
          <span></span>
        </div>

        <p className="offers-description">
          Enjoy something extra special, while the offer lasts.
        </p>
      </div>

      <div className="offers-grid">
        {activeOffers.map((offer) => (
          <article className="offer-card" key={offer.id}>
            {offer.image && (
              <div className="offer-image">
                <img
                  src={offer.image}
                  alt={offer.title || "Special offer"}
                  loading="lazy"
                />
              </div>
            )}

            <div className="offer-content">
              {offer.discount && (
                <span className="offer-discount">
                  {offer.discount}
                </span>
              )}

              <h3>{offer.title}</h3>

              {offer.description && (
                <p>{offer.description}</p>
              )}

              <small>
                Valid until{" "}
                {new Date(
                  `${offer.endDate}T12:00:00`
                ).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Offers;
