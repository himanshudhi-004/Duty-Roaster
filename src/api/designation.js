// src/api/designation.js
import axios from "axios";

//-------------------------VIP Degination
// const BASE_URL = "https://4856b82510d5.ngrok-free.app";
const BASE_URL = "http://192.168.29.46:8081"; // change to your backend URL

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

export const createCategory = async (data) => {
  
  const res = await axios.post("/api/officer", data);
  return res.data;
};

export const getAllCategory = async () => {
  const res = await axios.get(BASE_URL/officer);
  return res.data;
};