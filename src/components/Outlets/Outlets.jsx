
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import "./Outlets.css";

function Outlets() {
  const navigate = useNavigate();
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);

  const outletOrder = [
    "Ganga Nagar",
    "R.T. Nagar",
    "Sultanpalya",
    "Kempapura",
    "Jakkur",
    "Banaswadi",
    "T.C. Palya",
    "Vasanth Nagar",
    "Nagavara",
  ];

  useEffect(() => {
    let mounted = true;

    async function loadOutlets() {
      try {
        const { data, error } = await supabase
          .from("outlets")
          .select("*")
          .eq("active", true);

        if (error) {
          throw error;
        }

        const orderedOutlets = [...(data || [])].sort((a, b) => {
          const indexA = outletOrder.indexOf(a.name);
          const indexB = outletOrder.indexOf(b.name);

          return (
            (indexA === -1 ? 999 : indexA) -
            (indexB === -1 ? 999 : indexB)
          );
        });

        if (mounted) {
          setOutlets(orderedOutlets);
        }
      } catch (error) {
        console.error("Error loading outlets from Supabase:", error);

        if (mounted) {
          setOutlets([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadOutlets();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="outlets">
      <h2>Our Outlets</h2>

      {loading ? (
        <p>Loading outlets...</p>
      ) : outlets.length === 0 ? (
        <p>No outlets available at the moment.</p>
      ) : (
        <div className="outlets-grid">
          {outlets.map((outlet) => (
            <div
              key={outlet.id}
              onClick={() => navigate(`/outlets/${outlet.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(`/outlets/${outlet.id}`);
                }
              }}
              role="button"
              tabIndex={0}
              style={{ cursor: "pointer" }}
            >
              📍 {outlet.name}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Outlets;
