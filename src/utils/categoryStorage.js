const CATEGORY_STORAGE_KEY = "gangaBakeryCategories";

const defaultCategories = [

  "Theme Cake",
  "Special Moments",
  "Pastries",
  "Bread",
  "Wedding Cake",
  "Biscuits & Cookies",
  "Savory",
  "Desserts",
  "Dry Cakes",
  "Snacks"
];

export const getCategories = () => {
  const savedCategories = localStorage.getItem(
    CATEGORY_STORAGE_KEY
  );

  if (savedCategories) {
    return JSON.parse(savedCategories);
  }

  localStorage.setItem(
    CATEGORY_STORAGE_KEY,
    JSON.stringify(defaultCategories)
  );

  return defaultCategories;
};

export const saveCategories = (categories) => {
  localStorage.setItem(
    CATEGORY_STORAGE_KEY,
    JSON.stringify(categories)
  );
};