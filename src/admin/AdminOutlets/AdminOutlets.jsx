
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import "./AdminOutlets.css";

const TABLE = "outlets";
const BUCKET = "outlet-images";

function normalizeOutletName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function AdminOutlets({ onBack }) {
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [hours, setHours] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [mapLink, setMapLink] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadOutlets();
  }, []);

  async function loadOutlets() {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;

      setOutlets(data || []);
    } catch (error) {
      console.error("Could not load outlets:", error);
      alert(`Could not load outlets: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Please choose an image smaller than 5 MB.");
      e.target.value = "";
      return;
    }

    setImageFile(file);
    setImage(URL.createObjectURL(file));
  }

  function clearForm() {
    setEditingId(null);
    setName("");
    setAddress("");
    setPhone("");
    setHours("");
    setImage("");
    setImageFile(null);
    setMapLink("");
    setWhatsapp("");

    const input = document.getElementById("outlet-image");
    if (input) input.value = "";
  }

  async function uploadImage(file) {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        upsert: false,
        contentType: file.type,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (isSubmitting) return;

    const trimmedName = name.trim();
    const trimmedAddress = address.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || !trimmedAddress || !trimmedPhone) {
      alert("Please fill Outlet Name, Address and Phone Number.");
      return;
    }

    const duplicate = outlets.find(
      (outlet) =>
        String(outlet.id) !== String(editingId) &&
        normalizeOutletName(outlet.name) ===
          normalizeOutletName(trimmedName)
    );

    if (duplicate) {
      alert(`"${duplicate.name}" already exists.`);
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = image;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const outletData = {
        name: trimmedName,
        address: trimmedAddress,
        phone: trimmedPhone,
        hours: hours.trim(),
        image: imageUrl || null,
        mapLink: mapLink.trim(),
        whatsapp: whatsapp.trim(),
      };

      if (editingId !== null) {
        const { error } = await supabase
          .from(TABLE)
          .update(outletData)
          .eq("id", editingId);

        if (error) throw error;

        alert("Outlet updated successfully.");
      } else {
        const { error } = await supabase
          .from(TABLE)
          .insert([{ ...outletData, active: true }]);

        if (error) throw error;

        alert("Outlet added successfully.");
      }

      clearForm();
      await loadOutlets();
    } catch (error) {
      console.error("Could not save outlet:", error);
      alert(`Could not save outlet: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEdit(outlet) {
    setEditingId(outlet.id);
    setName(outlet.name || "");
    setAddress(outlet.address || "");
    setPhone(outlet.phone || "");
    setHours(outlet.hours || "");
    setImage(outlet.image || "");
    setImageFile(null);
    setMapLink(outlet.mapLink || "");
    setWhatsapp(outlet.whatsapp || "");

    const input = document.getElementById("outlet-image");
    if (input) input.value = "";

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    const outlet = outlets.find(
      (item) => String(item.id) === String(id)
    );

    if (!outlet) return;

    if (
      !window.confirm(
        `Are you sure you want to delete "${outlet.name}"?`
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from(TABLE)
        .delete()
        .eq("id", id);

      if (error) throw error;

      if (String(editingId) === String(id)) {
        clearForm();
      }

      alert("Outlet deleted successfully.");
      await loadOutlets();
    } catch (error) {
      console.error("Could not delete outlet:", error);
      alert(`Could not delete outlet: ${error.message}`);
    }
  }

  return (
    <div className="admin-outlets">
      <header className="admin-outlets-header">
        <div>
          <h1>Ganga Bakery</h1>
          <p>Outlet Management</p>
        </div>

        <button
          className="admin-outlets-back"
          type="button"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>
      </header>

      <main className="admin-outlets-content">
        <section className="add-outlet-section">
          <h2>
            {editingId !== null ? "Edit Outlet" : "Add New Outlet"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="outlet-input">
              <label htmlFor="outlet-name">Outlet Name</label>
              <input
                id="outlet-name"
                type="text"
                placeholder="Example: Ganga Nagar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="outlet-input">
              <label htmlFor="outlet-address">Address</label>
              <textarea
                id="outlet-address"
                placeholder="Enter complete outlet address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="outlet-input">
              <label htmlFor="outlet-phone">Phone Number</label>
              <input
                id="outlet-phone"
                type="tel"
                placeholder="Example: 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="outlet-input">
              <label htmlFor="outlet-hours">Opening Hours</label>
              <input
                id="outlet-hours"
                type="text"
                placeholder="Example: 7:00 AM - 10:00 PM"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>

            <div className="outlet-input">
              <label htmlFor="outlet-map">Google Maps Link</label>
              <input
                id="outlet-map"
                type="url"
                placeholder="Paste Google Maps location link"
                value={mapLink}
                onChange={(e) => setMapLink(e.target.value)}
              />
            </div>

            <div className="outlet-input">
              <label htmlFor="outlet-whatsapp">WhatsApp Link</label>
              <input
                id="outlet-whatsapp"
                type="text"
                placeholder="https://wa.me/919876543210"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
              />
            </div>

            <div className="outlet-input">
              <label htmlFor="outlet-image">Outlet Image</label>
              <input
                id="outlet-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              {image && (
                <img
                  src={image}
                  alt="Outlet preview"
                  style={{
                    width: "220px",
                    maxWidth: "100%",
                    height: "145px",
                    objectFit: "cover",
                    marginTop: "10px",
                  }}
                />
              )}
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : editingId !== null
                  ? "Update Outlet"
                  : "Add Outlet"}
            </button>

            {editingId !== null && (
              <button type="button" onClick={clearForm}>
                Cancel
              </button>
            )}
          </form>
        </section>

        <section className="outlet-list-section">
          <h2>Our Outlets ({outlets.length})</h2>

          {loading ? (
            <p>Loading outlets...</p>
          ) : outlets.length === 0 ? (
            <p>No outlets found in Supabase. Add your first outlet above.</p>
          ) : (
            <div className="outlet-list">
              {outlets.map((outlet) => (
                <div className="outlet-card" key={outlet.id}>
                  {outlet.image && (
                    <img src={outlet.image} alt={outlet.name} />
                  )}

                  <div className="outlet-info">
                    <h3>{outlet.name}</h3>
                    <p><strong>Address:</strong> {outlet.address || "Not added"}</p>
                    <p><strong>Phone:</strong> {outlet.phone || "Not added"}</p>
                    <p><strong>Hours:</strong> {outlet.hours || "Not added"}</p>

                    {outlet.mapLink && (
                      <p>
                        📍 <a href={outlet.mapLink} target="_blank" rel="noopener noreferrer">
                          View Google Maps
                        </a>
                      </p>
                    )}

                    {outlet.whatsapp && (
                      <p>
                        💬{" "}
                        <a
                          href={
                            outlet.whatsapp.startsWith("http")
                              ? outlet.whatsapp
                              : `https://wa.me/${outlet.whatsapp.replace(/\D/g, "")}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          WhatsApp
                        </a>
                      </p>
                    )}

                    <p>
                      <strong>Status:</strong>{" "}
                      {outlet.active ? "Active" : "Inactive"}
                    </p>
                  </div>

                  <div className="outlet-actions">
                    <button type="button" onClick={() => handleEdit(outlet)}>
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(outlet.id)}>
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

export default AdminOutlets;
