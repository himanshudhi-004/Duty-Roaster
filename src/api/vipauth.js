
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// Vip Login
export const vipLogin = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, data);

    if (res.data) {
      localStorage.setItem("vipToken", res.data);
      localStorage.setItem("lastActiveTime", Date.now());
      return { success: true, res };
    } else {
      return { success: false, message: "No token received" };
    }
  } catch (err) {
    console.error("Error logging in Vip:", err.message);
    return { success: false, message: err.message };
  }
};

//  Vip Logout
export const vipLogout = () => {
  localStorage.removeItem("vipToken");
  localStorage.removeItem("lastActiveTime");
  console.log("Vip logged out successfully");
  return { success: true };
};

//  Check Token Validity (used by PrivateRoute)
export const checkTokenValidity = () => {
  const token = localStorage.getItem("vipToken");
  const lastActiveTime = localStorage.getItem("lastActiveTime");

  if (!token) return false;

  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  if (lastActiveTime && now - lastActiveTime > fiveMinutes) {
    vipLogout();
    return false;
  }

  // Still active → update activity time
  localStorage.setItem("lastActiveTime", Date.now());
  return true;
};
