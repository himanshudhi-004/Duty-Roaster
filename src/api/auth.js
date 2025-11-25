import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// export const loginUser = async (data, role) => {
//   try {
//     const res = await axios.post(`${BASE_URL}/auth/login`, data);

//     if (res.data.data) {
//       if (role) {
//         localStorage.setItem(`${role}Token`, res.data.data);
//         localStorage.setItem(`${role}LastActive`, Date.now());
//       }
//       return { success: true, res };
//     } else {
//       return { success: false, message: "No token received" };
//     }

//   } catch (err) {
//     return { success: false, message: err.message };
//   }
// };

export const loginUser = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, data);

    if (res.data.data) {
      return { success: true, res };
    } else {
      return { success: false, message: "No token received" };
    }

  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const logoutUser = (role) => {
  localStorage.removeItem(`${role}Token`);
  localStorage.removeItem(`${role}LastActive`);
  return { success: true };
};

export const checkToken = (role) => {
  const token = localStorage.getItem(`${role}Token`);
  const lastActive = localStorage.getItem(`${role}LastActive`);

  if (!token) return false;

  const now = Date.now();
  const limit = 5 * 60 * 1000;

  if (lastActive && now - lastActive > limit) {
    logoutUser(role);
    return false;
  }

  localStorage.setItem(`${role}LastActive`, Date.now());
  return true;
};
