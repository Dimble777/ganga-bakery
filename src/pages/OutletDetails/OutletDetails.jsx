
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import "./OutletDetails.css";

function OutletDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [outlet, setOutlet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadOutlet() {
      setLoading(true);
      setError(false);

      try {
        const { data, error: queryError } = await supabase
          .from("outlets")
          .select("*")
          .eq("id", id)
          .eq("active", true)
          .maybeSingle();

        if (queryError) {
          throw queryError;
        }

        if (mounted) {
          setOutlet(data || null);
          setError(!data);
        }
      } catch (err) {
        console.error("Error loading outlet from Supabase:", err);

        if (mounted) {
          setOutlet(null);
          setError(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadOutlet();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="outlet-not-found">
        <p>Loading outlet details...</p>
      </div>
    );
  }

  if (error || !outlet) {
    return (
      <div className="outlet-not-found">
        <h2>Outlet Not Found</h2>
        <button type="button" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </div>
    );
  }

  const whatsappLink = outlet.whatsapp
    ? outlet.whatsapp.startsWith("http")
      ? outlet.whatsapp
      : `https://wa.me/${outlet.whatsapp.replace(/\D/g, "")}`
    : "";

  return (
    <section className="outlet-details">
      <button
        type="button"
        className="outlet-back-btn"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>

      <div className="outlet-details-container">
        {outlet.image && (
          <img
            src={outlet.image}
            alt={outlet.name || "Ganga Bakery outlet"}
            className="outlet-details-image"
          />
        )}

        <div className="outlet-details-content">
          <p className="outlet-label">GANGA BAKERY</p>
          <h1>{outlet.name}</h1>

          {outlet.address && (
            <div className="outlet-detail-item">
              <h3>Address</h3>
              <p>{outlet.address}</p>
            </div>
          )}

          {outlet.phone && (
            <div className="outlet-detail-item">
              <h3>Phone</h3>
              <p>{outlet.phone}</p>
            </div>
          )}

          {outlet.hours && (
            <div className="outlet-detail-item">
              <h3>Opening Hours</h3>
              <p>{outlet.hours}</p>
            </div>
          )}

          <div className="outlet-detail-buttons">
            {outlet.mapLink && (
              <a
                href={outlet.mapLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                📍 Google Maps
              </a>
            )}

            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                💬 WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default OutletDetails;
