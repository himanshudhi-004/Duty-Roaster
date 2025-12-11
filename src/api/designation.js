// src/api/designation.js
import axios from "axios";


const BASE_URL = process.env.REACT_APP_BASE_URL;

// Create axios instance with token support
const api = axios.create({
  baseURL: BASE_URL,
});


api.interceptors.request.use((config) => {
  const role = localStorage.getItem("role"); // admin or vip
  const token = localStorage.getItem(`${role}Token`);
  
  if (token) config.headers.Authorization = `Bearer ${token}`;
  
  return config;
});

export const createDesignation = async (data) => {
  const res = await api.post("/api/categories", data);
  // const res = await axios.post(DEGINATION_URL, data);
  return res.data;
};

export const getAllDesignations = async () => {
  const res = await axios.get(BASE_URL/category);
  return res.data;
};

//-------------------------GUARD Degination

// Register new admin
export const createCategory = async () => {
  try {
    const role = localStorage.getItem("role"); // admin or vip
    const token = localStorage.getItem(`${role}Token`);
    console.log("token", token)
    const response = await axios.get(`${BASE_URL}/api/officer/unique-ranks`,
      {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
    );

    return response.data;
  } catch (error) {
    console.error("Error while sending Rank form data:", error.message);
    throw error;
  }
};

export const getAllCategory = async () => {
  const res = await axios.get(BASE_URL/officer);
  return res.data;
};