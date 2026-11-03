
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import "./AdminCategories.css";

function AdminCategories({ onBack }) {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  
async function loadCategories() {
  setLoading(true);
  setErrorMessage("");

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name")
      .order("id", { ascending: true });

    console.log("Categories returned:", data);
    console.log("Categories query error:", error);

    if (error) {
      throw error;
    }

    setCategories(data || []);
  } catch (error) {
    console.error("Could not load Supabase categories:", error);

    setErrorMessage(
      error.message || "Could not load categories from Supabase."
    );
  } finally {
    setLoading(false);
  }
}


  async function handleAddCategory(event) {
    event.preventDefault();

    const name = newCategory.trim();

    if (!name || isSubmitting) return;

    if (
      categories.some(
        (item) => item.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      setErrorMessage("This category already exists.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const { data, error } = await supabase
        .from("categories")
        .insert({ name })
        .select("id, name")
        .single();

      if (error) throw error;

      setCategories((current) => [...current, data]);
      setNewCategory("");
    } catch (error) {
      console.error("Could not add category:", error);
      setErrorMessage(
        error.message || "Could not add the category to Supabase."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteCategory(category) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"? This does not delete products in that category.`
    );

    if (!confirmed) return;

    setErrorMessage("");

    try {
      const { data, error } = await supabase
        .from("categories")
        .delete()
        .eq("id", category.id)
        .select("id");

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error(
          "The category was not deleted. Check Supabase permissions."
        );
      }

      setCategories((current) =>
        current.filter((item) => item.id !== category.id)
      );
    } catch (error) {
      console.error("Could not delete category:", error);
      setErrorMessage(
        error.message || "Could not delete the category from Supabase."
      );
    }
  }

  return (
    <div className="admin-categories">
      <div className="admin-categories-header">
        <button type="button" onClick={onBack}>
          ← Back to Dashboard
        </button>

        <h2>Manage Categories</h2>
      </div>

      {errorMessage && (
        <p role="alert" className="category-error">
          {errorMessage}
        </p>
      )}

      <form onSubmit={handleAddCategory}>
        <input
          type="text"
          value={newCategory}
          onChange={(event) => setNewCategory(event.target.value)}
          placeholder="Enter category name"
          aria-label="Category name"
          disabled={isSubmitting || loading}
        />

        <button
          type="submit"
          disabled={isSubmitting || loading}
        >
          {isSubmitting ? "Adding..." : "Add Category"}
        </button>
      </form>

      <div className="category-list">
        <h3>Existing Categories</h3>

        {loading ? (
          <p>Loading categories from Supabase...</p>
        ) : categories.length === 0 ? (
          <p>No categories found in Supabase.</p>
        ) : (
          categories.map((category) => (
            <div className="category-item" key={category.id}>
              <span>{category.name}</span>

              <button
                type="button"
                onClick={() => handleDeleteCategory(category)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminCategories;
