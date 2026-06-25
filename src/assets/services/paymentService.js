import axios from "axios";

export const createOrder = (amount) =>
  axios.post(
    "https://hotel-bookingsystem-backend.onrender.com/api/payment/create-order",
    { amount }
  );