
import { supabase } from "./supabase";
// Load all products from Supabase
export const getProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Could not load products from Supabase:", error);
    throw error;
  }

  return data ?? [];
};

const PRODUCT_STORAGE_KEY = "gangaBakeryProducts";


const defaultProducts = [
  {
    name: "Plum Cake",
    category: "Cakes",
    price: 650,
    description: "Rich and delicious plum cake.",
    image: "/products/plum-cake.jpg",
    featured: true,
  },
  {
    name: "Black Forest Cake",
    category: "Pastries",
    price: 600,
    description: "Classic black forest cake.",
    image: "/products/black-forest-cake.jpg",
    featured: true,
  },
  {
    name: "Carrot Dates Cake",
    category: "Cakes",
    price: 550,
    description: "Delicious carrot and dates cake.",
    image: "/products/carrot-dates.jpg",
    featured: true,
  },
  {
    name: "Chicken Puff",
    category: "Savory",
    price: 45,
    description: "Freshly baked crispy chicken puff.",
    image: "/products/chicken-puff.jpg",
    featured: true,
  },
  {
    name: "Egg Puff",
    category: "Savory",
    price: 40,
    description: "Freshly baked crispy egg puff.",
    image: "/products/egg-puff.jpg",
    featured: true,
  },
  {
    name: "Red Velvet Cake",
    category: "Pastries",
    price: 90,
    description: "Soft and delicious red velvet cake.",
    image: "/products/red-velvet-cake.jpg",
    featured: true,
  },
];

// Supabase is the primary source of product data.
// Cache featured products for 60 seconds.
let featuredProductsCache = null;
let featuredProductsCacheTime = 0;
let featuredProductsRequest = null;

const FEATURED_CACHE_DURATION = 60 * 1000;

export const getFeaturedProducts = async () => {
  const now = Date.now();

  // Return recently fetched products.
  if (
    featuredProductsCache !== null &&
    now - featuredProductsCacheTime < FEATURED_CACHE_DURATION
  ) {
    return featuredProductsCache;
  }

  // Reuse an ongoing request instead of starting another.
  if (featuredProductsRequest) {
    return featuredProductsRequest;
  }

  featuredProductsRequest = (async () => {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, category, price, description, image, featured")
      .eq("featured", true)
      .order("id", { ascending: true });

    if (error) {
      console.error("Could not load featured products:", error);
      throw error;
    }

    featuredProductsCache = data ?? [];
    featuredProductsCacheTime = Date.now();

    return featuredProductsCache;
  })();

  try {
    return await featuredProductsRequest;
  } finally {
    featuredProductsRequest = null;
  }
};


const categoryProductsCache = new Map();
const categoryProductsRequests = new Map();

const CATEGORY_CACHE_DURATION = 60 * 1000;

export const getProductsByCategory = async (category) => {
  const now = Date.now();

  const cached = categoryProductsCache.get(category);

  // Return cached products if they are less than 60 seconds old
  if (cached && now - cached.time < CATEGORY_CACHE_DURATION) {
    return cached.products;
  }

  // Reuse an existing request instead of sending another
  if (categoryProductsRequests.has(category)) {
    return categoryProductsRequests.get(category);
  }

  const request = (async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", category)
      .order("id", { ascending: true });

    if (error) {
      console.error("Could not load category products:", error);
      throw error;
    }

    const products = data ?? [];

    categoryProductsCache.set(category, {
      products,
      time: Date.now(),
    });

    return products;
  })();

  categoryProductsRequests.set(category, request);

  try {
    return await request;
  } finally {
    categoryProductsRequests.delete(category);
  }
};

// Insert new products or update existing ones.
// Products without a database ID are inserted as new rows.
export const saveProducts = async (products) => {
  const savedProducts = [];

  for (const product of products) {
    const { id, ...fields } = product;

    const result = id != null
      ? await supabase
          .from("products")
          .upsert({ id, ...fields })
          .select()
          .single()
      : await supabase
          .from("products")
          .insert(fields)
          .select()
          .single();

    if (result.error) {
      console.error("Could not save product:", result.error);
      throw result.error;
    }

    savedProducts.push(result.data);
  }

  return savedProducts;
};

export const getCachedProducts = () => {
  try {
    const saved = localStorage.getItem(PRODUCT_STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultProducts;
  } catch {
    return defaultProducts;
  }
};
