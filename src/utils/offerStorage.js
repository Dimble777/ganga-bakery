const OFFER_STORAGE_KEY = "gangaBakeryOffers";

export const getOffers = () => {
  const savedOffers = localStorage.getItem(
    OFFER_STORAGE_KEY
  );

  if (savedOffers) {
    return JSON.parse(savedOffers);
  }

  return [];
};

export const saveOffers = (offers) => {
  localStorage.setItem(
    OFFER_STORAGE_KEY,
    JSON.stringify(offers)
  );
};