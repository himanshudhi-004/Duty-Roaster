import axios from "axios";

// ====================== BASE API URL ======================

const BASE_URL = process.env.REACT_APP_BASE_URL;

// Create axios instance with token support
const api = axios.create({
  baseURL: BASE_URL,
});

// Attach token if available
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("adminToken");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

api.interceptors.request.use((config) => {
  const role = localStorage.getItem("role"); // admin or vip
  const token = localStorage.getItem(`${role}Token`);

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});


// ====================== ADMIN SECTION ======================

// Register new admin
export const submitAdminFormData = async (adminformData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, adminformData);
    return response.data;
  } catch (error) {
    console.error("Error while sending Admin form data:", error.message);
    throw error;
  }
};

// Get all admins (✔ Correct API)
export const getAllAdmin = async () => {
  try {
    const response = await api.get(`/api/auth`);
    const res = response.data;

    console.log("ADMIN API:", res);

    // Parse all possible backend formats
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.admins)) return res.admins;
    if (Array.isArray(res?.data?.admins)) return res.data.admins;

    return [];
  } catch (error) {
    console.error("Error fetching Admin data:", error.message);
    return [];
  }
};

// Get single admin by ID
export const getAdminById = async (id) => {
  try {
    const response = await api.get(`/api/auth/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching admin by ID:", error.message);
    throw error;
  }
};

// Update admin
export const updateAdmin = async (id, adminformData) => {
  try {
    const response = await api.post(`/auth/update/${id}`, adminformData);
    return response.data;
  } catch (error) {
    console.error("Error updating Admin data:", error.message);
    throw error;
  }
};

// Delete admin
export const deleteAdmin = async (id) => {
  try {
    const response = await api.delete(`/api/admins/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting Admin:", error.message);
    throw error;
  }
};


// ====================== User SECTION ======================

// Register new user
export const submitUserFormData = async (userformData) => {
  try {
    const response = await axios.post(`${BASE_URL}/usr/reg`, userformData);
    return response.data;
  } catch (error) {
    console.error("Error while sending User form data:", error.message);
    throw error;
  }
};

// Get all admins (✔ Correct API)
export const getAllUser = async () => {
  try {
    const response = await api.get(`/api/usr`);
    const res = response.data;

    console.log("User API:", res);

    // Parse all possible backend formats
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.users)) return res.users;
    if (Array.isArray(res?.data?.users)) return res.data.users;

    return [];
  } catch (error) {
    console.error("Error fetching User data:", error.message);
    return [];
  }
};

// Get single admin by ID
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/api/usr/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching admin by ID:", error.message);
    throw error;
  }
};

// Update admin
export const updateUser = async (id, userformData) => {
  try {
    const response = await api.post(`/auth/usr/${id}`, userformData);
    return response.data;
  } catch (error) {
    console.error("Error updating User data:", error.message);
    throw error;
  }
};

// Delete admin
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/api/usr/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting User:", error.message);
    throw error;
  }
};

// ====================== VIP SECTION ======================

// Add VIP
export const submit_vip_FormData = async (vipformData) => {
  try {
    const response = await api.post("/api/categories", vipformData);
    return response.data;
  } catch (error) {
    console.error("Error submitting VIP form:", error.message);
    throw error;
  }
};

// Get all VIPs
export const getAllVip = async () => {
  try {
    const response = await api.get("/api/categories");
    const res = response.data;

    // Normalize VIP list
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.categories)) return res.categories;

    return [];
  } catch (error) {
    console.error("Error fetching VIP data:", error.message);
    return [];
  }
};

// Update VIP
export const updateVip = async (id, vipformData) => {
  try {
    const response = await api.put(`/api/categories/${id}`, vipformData);
    return response.data;
  } catch (error) {
    console.error("Error updating VIP data:", error.message);
    throw error;
  }
};

// Delete VIP
export const deleteVip = async (id) => {
  try {
    const response = await api.delete(`/api/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting VIP:", error.message);
    throw error;
  }
};

// ====================== GUARD SECTION ======================

export const submit_gd_FormData = async (guardformData) => {
  try {
    const response = await api.post("/api/officer", guardformData);
    return response.data;
  } catch (error) {
    console.error("Error submitting Guard form:", error.message);
    throw error;
  }
};

// Get all guards
export const getAllGuard = async () => {
  try {
    const response = await api.get("/api/officer");
    const res = response.data;

    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.guards)) return res.guards;
    if (Array.isArray(res?.officers)) return res.officers;

    return [];
  } catch (error) {
    console.error("Error fetching Guard data:", error.message);
    return [];
  }
};

// Update guard
export const updateGuard = async (id, guardformData) => {
  try {
    const response = await api.put(`/api/officer/${id}`, guardformData);
    return response.data;
  } catch (error) {
    console.error("Error updating Guard data:", error.message);
    throw error;
  }
};

// Delete guard
export const deleteGuard = async (id) => {
  try {
    const response = await api.delete(`/api/officer/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting Guard:", error.message);
    throw error;
  }
};

// ====================== ATTENDANCE SECTION ======================
export const submitAttendance = async (data) => {
  try {
    const res = await api.post(`/officer/attendance`, data);
    return res.data;
  } catch (error) {
    console.error("Error submitting attendance:", error.message);
    throw error;
  }
};

export const getAttendance = async (name = "") => {
  try {
    const res = await api.get(`/categories/attendance`, { params: { name } });
    return res.data;
  } catch (error) {
    console.error("Error fetching attendance:", error.message);
    return [];
  }
};

// ====================== VIP–GUARD ASSIGNMENT SECTION ======================
export const assignGuardToVip = async (vip_id, guard_id) => {
  try {
    const res = await api.post("/api/assign", { vip_id, guard_id });
    return res.data;
  } catch (error) {
    console.error("Error assigning guard:", error.message);
    throw error;
  }
};

export const getAllAssigned = async () => {
  try {
    const res = await api.get("/api/assign");
    return res.data;
  } catch (error) {
    console.error("Error fetching assigned data:", error.message);
    return [];
  }
};

export const deleteAssigned = async (id) => {
  try {
    const res = await api.delete(`/api/assign/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting assigned relation:", error.message);
    throw error;
  }
};
