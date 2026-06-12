import axios from "axios";

const API =
  "http://localhost:5000/api/auth";

export const userLogin = (data) =>
  axios.post(
    `${API}/user/login`,
    data
  );

export const userSignup = (data) =>
  axios.post(
    `${API}/user/signup`,
    data
  );

export const agentLogin = (data) =>
  axios.post(
    `${API}/agent/login`,
    data
  );

export const agentSignup = (data) =>
  axios.post(
    `${API}/agent/signup`,
    data
  );