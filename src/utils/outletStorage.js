
const STORAGE_KEY = "ganga-bakery-outlets";

const defaultOutlets = [
  {
    id: 1,
    name: "Ganga Nagar",
    address: "",
    phone: "",
    hours: "",
    image: "",
  },
  {
    id: 2,
    name: "R.T. Nagar",
    address: "",
    phone: "",
    hours: "",
    image: "",
  },
  {
    id: 3,
    name: "Sultanpalya",
    address: "",
    phone: "",
    hours: "",
    image: "",
  },
  {
    id: 4,
    name: "Kempapura",
    address: "",
    phone: "",
    hours: "",
    image: "",
  },
  {
    id: 5,
    name: "Jakkur",
    address: "",
    phone: "",
    hours: "",
    image: "",
  },
  {
    id: 6,
    name: "Banaswadi",
    address: "",
    phone: "",
    hours: "",
    image: "",
  },
  {
    id: 7,
    name: "T.C. Palya",
    address: "",
    phone: "",
    hours: "",
    image: "",
  },
  {
    id: 8,
    name: "Vasanth Nagar",
    address: "",
    phone: "",
    hours: "",
    image: "",
  },
  {
    id: 9,
    name: "Nagavara",
    address: "",
    phone: "",
    hours: "",
    image: "",
  },
];

export const getOutlets = () => {
  const storedOutlets = localStorage.getItem(STORAGE_KEY);

  if (!storedOutlets) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultOutlets)
    );

    return defaultOutlets;
  }

  try {
    return JSON.parse(storedOutlets);
  } catch {
    return defaultOutlets;
  }
};

export const saveOutlets = (outlets) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(outlets)
  );
};

