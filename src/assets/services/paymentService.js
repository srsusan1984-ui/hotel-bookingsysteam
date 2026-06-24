import axios from "axios";

export const createOrder = (amount) =>
  axios.post(
    "http://localhost:5000/api/payment/create-order",
    { amount }
  );