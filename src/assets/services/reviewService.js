import axios from "axios";

const API_URL = "https://hotel-bookingsystem-backend.onrender.com/api/reviews";
// Submit a review
export const submitReview = async (reviewData) => {
  try {
    const response = await axios.post(`${API_URL}/submit`, reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get reviews for a specific hotel
export const getHotelReviews = async (hotelId) => {
  try {
    const response = await axios.get(`${API_URL}/hotel/${hotelId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get all reviews by a user
export const getUserReviews = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get review statistics for a hotel
export const getReviewStats = async (hotelId) => {
  try {
    const response = await axios.get(`${API_URL}/stats/${hotelId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Admin: Get all pending reviews
export const getPendingReviews = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/pending`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Admin: Approve a review
export const approveReview = async (reviewId) => {
  try {
    const response = await axios.put(`${API_URL}/admin/approve/${reviewId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Admin: Delete a review
export const deleteReview = async (reviewId) => {
  try {
    const response = await axios.delete(`${API_URL}/admin/delete/${reviewId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Admin: Add response to review
export const addAdminResponse = async (reviewId, response) => {
  try {
    const responseData = await axios.put(
      `${API_URL}/admin/response/${reviewId}`,
      { response }
    );
    return responseData.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
