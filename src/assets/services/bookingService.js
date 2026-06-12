import axios from "axios";

const API =
  "http://localhost:5000/api/bookings";

export const createBooking =
  (data) =>
    axios.post(
      API,
      data
    );

export const getUserBookings =
  (userId) =>
    axios.get(
      `${API}/user/${userId}`
    );
export const getHotelBookings =
  (hotelId) =>
    axios.get(
      `${API}/hotel/${hotelId}`
    );
export const cancelBooking =
  (bookingId) =>
    axios.put(
      `${API}/cancel/${bookingId}`
    );
