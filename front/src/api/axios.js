// src/api/axios.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

export const sendMessage = async (message) => {
  const res = await axios.post(`${API_BASE}/api/chat`, { message });
  return res.data; // { reply: "..." }
};
