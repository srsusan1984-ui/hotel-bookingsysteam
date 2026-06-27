import axios from "axios";

const API =
  "https://hotel-bookingsystem-backend.onrender.com/api/bookings";

export const createBooking = async (data) => {
  console.log("📤 Sending booking:", data);

  try {
    const response = await axios.post(API, data);

    console.log("✅ Booking Success:", response);

    return response;
  } catch (error) {
  console.error("❌ AXIOS ERROR:", error);

  if (error.response) {
    console.error("Status:", error.response.status);
    console.error("Data:", error.response.data);
  } else {
    console.error("No response received");
  }

  alert(JSON.stringify(error.response?.data || error.message));

  throw error;
}
};

export const getUserBookings = (userId) =>
  axios.get(`${API}/user/${userId}`);

export const getHotelBookings = (hotelId) =>
  axios.get(`${API}/hotel/${hotelId}`);

export const cancelBooking = (bookingId) =>
  axios.put(`${API}/cancel/${bookingId}`);