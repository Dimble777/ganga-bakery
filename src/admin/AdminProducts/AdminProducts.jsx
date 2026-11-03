
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import "./AdminProducts.css";

const BUCKET_NAME = "product-images";

function AdminProducts({ onBack }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [featured, setFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadData() {
    setLoading(true);
    setErrorMessage("");

    try {
      const [productsResult, categoriesResult] = await Promise.all([
        supabase
          .from("products")
          .select("*")
          .order("id", { ascending: true }),
        supabase
          .from("categories")
          .select("*")
          .order("id", { ascending: true }),
      ]);

      if (productsResult.error) throw productsResult.error;
      if (categoriesResult.error) throw categoriesResult.error;

      setProducts(productsResult.data || []);
      setCategories(
        (categoriesResult.data || [])
          .map((item) => item.name)
          .filter(Boolean)
      );
    } catch (error) {
      console.error("Unable to load admin products:", error);
      setErrorMessage(
        error.message || "Unable to load products from Supabase."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setImageFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      event.target.value = "";
      setImageFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Please choose an image smaller than 5 MB.");
      event.target.value = "";
      setImageFile(null);
      return;
    }

    setImageFile(file);
  };

  const resetForm = () => {
    setName("");
    setCategory("");
    setPrice("");
    setDescription("");
    setImageFile(null);
    setFeatured(false);

    const fileInput = document.getElementById("product-image-input");
    if (fileInput) fileInput.value = "";
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const numericPrice = Number(price);

    if (
      !trimmedName ||
      !category ||
      price === "" ||
      !trimmedDescription
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      alert("Please enter a valid price.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    let uploadedPath = null;

    try {
      let imageUrl = "";

      if (imageFile) {
        const safeName = imageFile.name
          .replace(/[^a-zA-Z0-9._-]/g, "-");

        const filePath =
          `${Date.now()}-${crypto.randomUUID()}-${safeName}`;

        const { data: uploadData, error: uploadError } =
          await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, imageFile, {
              cacheControl: "3600",
              upsert: false,
              contentType: imageFile.type,
            });

        if (uploadError) throw uploadError;

        uploadedPath = uploadData.path;

        const { data: publicUrlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(uploadData.path);

        imageUrl = publicUrlData.publicUrl;
      }

      const { data: newProduct, error: insertError } = await supabase
        .from("products")
        .insert({
          name: trimmedName,
          category,
          price: numericPrice,
          description: trimmedDescription,
          image: imageUrl,
          featured,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setProducts((current) => [...current, newProduct]);
      resetForm();
      alert("Product added successfully!");
    } catch (error) {
      console.error("Unable to add product:", error);

      // Clean up only the image uploaded during this failed attempt.
      if (uploadedPath) {
        const { error: cleanupError } = await supabase.storage
          .from(BUCKET_NAME)
          .remove([uploadedPath]);

        if (cleanupError) {
          console.error("Could not clean up uploaded image:", cleanupError);
        }
      }

      setErrorMessage(
        error.message ||
          "Could not save the product. Check Supabase permissions."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    setErrorMessage("");

    try {
      const { data, error } = await supabase
        .from("products")
        .delete()
        .eq("id", product.id)
        .select("id");

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error(
          "The product was not deleted. Check your Supabase permissions."
        );
      }

      setProducts((current) =>
        current.filter(
          (item) => String(item.id) !== String(product.id)
        )
      );

      alert("Product deleted successfully.");
    } catch (error) {
      console.error("Unable to delete product:", error);
      setErrorMessage(
        error.message || "Could not delete the selected product."
      );
    }
  };

  return (
    <div className="admin-products">
      <header className="admin-products-header">
        <div>
          <h1>Ganga Bakery</h1>
          <p>Product Management</p>
        </div>

        <button
          type="button"
          className="admin-products-back"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>
      </header>

      <main className="admin-products-content">
        {errorMessage && (
          <div className="category-empty" role="alert">
            <p>{errorMessage}</p>
            <button type="button" onClick={loadData}>
              Reload Data
            </button>
          </div>
        )}

        <section className="add-product-section">
          <h2>Add New Product</h2>

          <form onSubmit={handleAddProduct}>
            <div className="product-input">
              <label htmlFor="product-name">Product Name</label>
              <input
                id="product-name"
                type="text"
                placeholder="Example: Black Forest Cake"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            <div className="product-input">
              <label htmlFor="product-category">Category</label>
              <select
                id="product-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              {categories.length === 0 && (
                <small>
                  No categories loaded. Check Manage Categories and
                  the Supabase categories table.
                </small>
              )}
            </div>

            <div className="product-input">
              <label htmlFor="product-price">Price (₹)</label>
              <input
                id="product-price"
                type="number"
                min="0"
                step="0.01"
                placeholder="Example: 650"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                required
              />
            </div>

            <div className="product-input product-description">
              <label htmlFor="product-description">Description</label>
              <textarea
                id="product-description"
                placeholder="Enter product description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
              />
            </div>

            <div className="product-input">
              <label htmlFor="product-image-input">Product Image</label>
              <input
                id="product-image-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="product-image-preview"
                />
              )}
            </div>

            <div className="product-input">
              <label>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(event) => setFeatured(event.target.checked)}
                />
                {" "}Show in Best Sellers
              </label>
            </div>

            <button
              type="submit"
              className="add-product-button"
              disabled={isSubmitting || categories.length === 0}
            >
              {isSubmitting ? "Saving..." : "Add Product"}
            </button>
          </form>
        </section>

        <section className="product-list-section">
          <h2>Products ({products.length})</h2>

          {loading ? (
            <p>Loading products from Supabase...</p>
          ) : products.length === 0 ? (
            <p>No products found in the Supabase products table.</p>
          ) : (
            <div className="product-table">
              <div className="product-table-header">
                <span>Image</span>
                <span>Product</span>
                <span>Category</span>
                <span>Price</span>
                <span>Featured</span>
                <span>Action</span>
              </div>

              {products.map((product) => (
                <div
                  className="product-table-row"
                  key={product.id}
                >
                  <span>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-list-image"
                      />
                    ) : (
                      <span className="no-image">No Image</span>
                    )}
                  </span>

                  <span>
                    <strong>{product.name}</strong>
                    <small>{product.description}</small>
                  </span>

                  <span>{product.category}</span>
                  <span>₹{product.price}</span>
                  <span>{product.featured ? "⭐ Yes" : "No"}</span>

                  <button
                    type="button"
                    className="delete-product-button"
                    onClick={() => handleDelete(product)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminProducts;
