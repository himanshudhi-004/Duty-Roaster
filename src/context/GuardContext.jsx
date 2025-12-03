// import React, { createContext, useContext, useEffect, useState } from "react";

// const GuardContext = createContext();

// export const GuardProvider = ({ children }) => {
//   const [selectedGuard, setSelectedGuard] = useState(() => {
//     const stored = localStorage.getItem("selectedGuard");
//     return stored ? JSON.parse(stored) : null;
//   });

//   useEffect(() => {
//     if (selectedGuard) {
//       localStorage.setItem("selectedGuard", JSON.stringify(selectedGuard));
//       console.log("Selected Guard stored in localStorage", selectedGuard);
//     }
//   }, [selectedGuard]);

//   const handleEdit = (guard) => {
//     setSelectedGuard(guard);
//   };

//   const handleBack = () => {
//     setSelectedGuard(null);
//     localStorage.removeItem("selectedGuard");
//   };

//   return (
//     <GuardContext.Provider
//       value={{
//         selectedGuard,
//         handleEdit,
//         handleBack,
//         setSelectedGuard,
//       }}
//     >
//       {children}
//     </GuardContext.Provider>
//   );
// };

// export const useGuardStore = () => useContext(GuardContext);


// src/context/GuardContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const GuardContext = createContext();

export const GuardProvider = ({ children }) => {
  const [selectedGuard, setSelectedGuard] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ✅ AUTO FETCH PROFILE EACH TIME TOKEN EXISTS */
  useEffect(() => {
    const token = localStorage.getItem("guardToken");
    console.log("Guard Provider Activated",children);
    if (!token) {
      setSelectedGuard(null);
      setProfileImage(null);
      return;
    }

    fetchGuardProfile();
  }, []);

  /* ✅ FETCH PROFILE */
  const fetchGuardProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("guardToken");
      if (!token) return;

      const decoded = jwtDecode(token);
      const username = decoded.username || decoded.sub || decoded.email;
      
      const res = await axios.get(`${BASE_URL}/api/officer/profile`, {

        params: { username },
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched Guard Profile:", await res.data);
      
      const profile = Array.isArray(res.data) ? res.data[0] : res.data;

      setSelectedGuard(profile);

      if (profile?.image) {
        setProfileImage(`${BASE_URL}/${profile.image}`);
      } else {
        setProfileImage(null);
      }
    } catch (err) {
      console.error("Profile Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ✅ IMAGE UPLOAD */
  const uploadGuardImage = async (file) => {
    try {
      if (!selectedGuard) return;

      const token = localStorage.getItem("guardToken");
      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post(
        `${BASE_URL}/api/officer/upload-profile-image/${selectedGuard.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newImageUrl = `${BASE_URL}/${res.data.image}`;
      setProfileImage(newImageUrl);
      setSelectedGuard((prev) => ({ ...prev, image: res.data.image }));
    } catch (err) {
      console.error("Image Upload Error:", err);
    }
  };

  /* ✅ RESET CONTEXT ON LOGOUT */
  const handleBack = () => {
    setSelectedGuard(null);
    setProfileImage(null);
  };

  const handleEdit = (guard) => setSelectedGuard(guard);

  return (
    <GuardContext.Provider
      value={{
        selectedGuard,
        profileImage,
        loading,
        fetchGuardProfile,
        uploadGuardImage,
        handleEdit,
        handleBack,
        setSelectedGuard,
      }}
    >
      {children}
    </GuardContext.Provider>
  );
};

export const useGuardStore = () => useContext(GuardContext);













































// import React, { createContext, useContext, useEffect, useState } from "react";

// const GuardContext = createContext();

// export const GuardProvider = ({ children }) => {
//   const [selectedGuard, setSelectedGuard] = useState(() => {
//     const stored = localStorage.getItem("selectedGuard");
//     return stored ? JSON.parse(stored) : null;
//   });

//   useEffect(() => {
//     if (selectedGuard) {
//       localStorage.setItem("selectedGuard", JSON.stringify(selectedGuard));
//       console.log("Selected Guard stored in localStorage", selectedGuard);
//     }
//   }, [selectedGuard]);

//   const handleEdit = (guard) => {
//     setSelectedGuard(guard);
//   };

//   const handleBack = () => {
//     setSelectedGuard(null);
//     localStorage.removeItem("selectedGuard");
//   };

//   console.log("GuardContext selectedGuard:", selectedGuard);

//   return (
//     <GuardContext.Provider
//       value={{
//         selectedGuard,
//         handleEdit,
//         handleBack,
//         setSelectedGuard,
//       }}
//     >
//       {children}
//     </GuardContext.Provider>
//   );
// };

// export const useGuardStore = () => useContext(GuardContext);
