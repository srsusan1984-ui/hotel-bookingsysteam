import axios from "axios";

const API =
  "http://localhost:5000/api/hotels";

export const getHotels = () =>
  axios.get(API);

export const addHotel = (data) =>
  axios.post(API, data);

export const getAgentHotels = (
  agentId
) =>
  axios.get(
    `${API}/agent/${agentId}`
  );

export const updateHotel = (
  id,
  data
) =>
  axios.put(
    `${API}/${id}`,
    data
  );

export const deleteHotel = (
  id
) =>
  axios.delete(
    `${API}/${id}`
  );

  