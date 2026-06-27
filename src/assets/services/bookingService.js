import axios from "axios";

const API =
  "https://hotel-bookingsystem-backend.onrender.com/api/bookings";

export const createBooking = async (data) => {
  console.log("📤 Sending Booking:", data);

  try {
    const response = await axios.post(API, data);

    console.log("✅ Booking Success:", response);

    return response;
  } catch (error) {
    console.log("❌ Axios Error:", error);
    console.log("❌ Status:", error.response?.status);
    console.log("❌ Data:", error.response?.data);
    console.log("❌ Message:", error.message);

    throw error;
  }
};

export const getUserBookings = (userId) =>
  axios.get(`${API}/user/${userId}`);

export const getHotelBookings = (hotelId) =>
  axios.get(`${API}/hotel/${hotelId}`);

export const cancelBooking = (bookingId) =>
  axios.put(`${API}/cancel/${bookingId}`);