import axios from "axios";

const API_URL = "https://hotel-bookingsystem-backend.onrender.com/api/offers";

// Get all active offers
export const getActiveOffers = async () => {
  try {
    const response = await axios.get(`${API_URL}/active`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Validate a promo code
export const validatePromoCode = async (code, bookingAmount, hotelId) => {
  try {
    const response = await axios.post(`${API_URL}/validate`, {
      code,
      bookingAmount,
      hotelId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Admin: Create offer
export const createOffer = async (offerData) => {
  try {
    const response = await axios.post(`${API_URL}/create`, offerData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Admin: Get all offers
export const getAllOffers = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Admin: Get offer by ID
export const getOfferById = async (offerId) => {
  try {
    const response = await axios.get(`${API_URL}/${offerId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Admin: Update offer
export const updateOffer = async (offerId, updateData) => {
  try {
    const response = await axios.put(`${API_URL}/${offerId}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Admin: Deactivate offer
export const deactivateOffer = async (offerId) => {
  try {
    const response = await axios.delete(`${API_URL}/${offerId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Admin: Increment usage count
export const incrementUsageCount = async (code) => {
  try {
    const response = await axios.post(`${API_URL}/usage/increment`, { code });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export const restoreOffer = async (offerId) => {
  try {
    const response = await axios.put(
      `${API_URL}/restore/${offerId}`
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
