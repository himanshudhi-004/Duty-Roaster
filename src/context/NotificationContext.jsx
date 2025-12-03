import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useGuardStore } from "./GuardContext"; // ✅ IMPORT GUARD CONTEXT

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { selectedGuard } = useGuardStore(); // ✅ GET SELECTED GUARD

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // ✅ TOKEN & ROLE
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // ✅ USER ID (GUARD FROM CONTEXT FIRST)
  const userId =
    selectedGuard?._id ||
    JSON.parse(localStorage.getItem("admin"))?._id ||
    JSON.parse(localStorage.getItem("vip"))?._id ||
    JSON.parse(localStorage.getItem("guard"))?._id ||
    JSON.parse(localStorage.getItem("user"))?._id;

  /* ================================
      FETCH NOTIFICATIONS
  ================================= */
  const fetchNotifications = async () => {
    if (!token || !role || !userId) return;

    try {
      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}/api/notification/${role}/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data || [];

      setNotifications(data);

      const unread = data.filter((n) => !n.notificationRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Notification Fetch Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================================
      MARK AS READ (SINGLE)
  ================================= */
  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${BASE_URL}/api/notification/read/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, notificationRead: true } : n
        )
      );

      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("Mark Read Error:", err.message);
    }
  };

  /* ================================
      MARK ALL AS READ
  ================================= */
  const markAllAsRead = async () => {
    if (!role || !userId) return;

    try {
      await axios.put(
        `${BASE_URL}/api/notification/read-all/${role}/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updated = notifications.map((n) => ({
        ...n,
        notificationRead: true,
      }));

      setNotifications(updated);
      setUnreadCount(0);
    } catch (err) {
      console.error("Mark All Read Error:", err.message);
    }
  };

  /* ================================
      AUTO FETCH ON LOAD & GUARD CHANGE
  ================================= */
  useEffect(() => {
    fetchNotifications();
  }, [role, userId]);

  /* ================================
      AUTO REFRESH (15 SECONDS)
  ================================= */
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [role, userId]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);




// import React, { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { useGuardStore } from "./GuardContext"; // ✅ IMPORT GUARD CONTEXT

// const NotificationContext = createContext();

// export const NotificationProvider = ({ children }) => {
//   const { selectedGuard } = useGuardStore(); // ✅ GET SELECTED GUARD

//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [loading, setLoading] = useState(false);

//   const BASE_URL = process.env.REACT_APP_BASE_URL;

//   // ✅ TOKEN & ROLE
//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");

//   // ✅ USER ID (GUARD FROM CONTEXT FIRST)
//   const userId =
//     selectedGuard?._id ||
//     JSON.parse(localStorage.getItem("admin"))?._id ||
//     JSON.parse(localStorage.getItem("vip"))?._id ||
//     JSON.parse(localStorage.getItem("guard"))?._id ||
//     JSON.parse(localStorage.getItem("user"))?._id;

//   /* ================================
//       FETCH NOTIFICATIONS
//   ================================= */
//   const fetchNotifications = async () => {
//     if (!token || !role || !userId) return;

//     try {
//       setLoading(true);

//       const res = await axios.get(
//         `${BASE_URL}/api/notification/${role}/${userId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = res.data || [];

//       setNotifications(data);

//       const unread = data.filter((n) => !n.notificationRead).length;
//       setUnreadCount(unread);
//     } catch (err) {
//       console.error("Notification Fetch Error:", err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================================
//       MARK AS READ (SINGLE)
//   ================================= */
//   const markAsRead = async (id) => {
//     try {
//       await axios.put(
//         `${BASE_URL}/api/notification/read/${id}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setNotifications((prev) =>
//         prev.map((n) =>
//           n._id === id ? { ...n, notificationRead: true } : n
//         )
//       );

//       setUnreadCount((prev) => Math.max(prev - 1, 0));
//     } catch (err) {
//       console.error("Mark Read Error:", err.message);
//     }
//   };

//   /* ================================
//       MARK ALL AS READ
//   ================================= */
//   const markAllAsRead = async () => {
//     if (!role || !userId) return;

//     try {
//       await axios.put(
//         `${BASE_URL}/api/notification/read-all/${role}/${userId}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       const updated = notifications.map((n) => ({
//         ...n,
//         notificationRead: true,
//       }));

//       setNotifications(updated);
//       setUnreadCount(0);
//     } catch (err) {
//       console.error("Mark All Read Error:", err.message);
//     }
//   };

//   /* ================================
//       AUTO FETCH ON LOAD & GUARD CHANGE
//   ================================= */
//   useEffect(() => {
//     fetchNotifications();
//   }, [role, userId]);

//   /* ================================
//       AUTO REFRESH (15 SECONDS)
//   ================================= */
//   useEffect(() => {
//     const interval = setInterval(fetchNotifications, 15000);
//     return () => clearInterval(interval);
//   }, [role, userId]);

//   return (
//     <NotificationContext.Provider
//       value={{
//         notifications,
//         unreadCount,
//         loading,
//         fetchNotifications,
//         markAsRead,
//         markAllAsRead,
//       }}
//     >
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// export const useNotification = () => useContext(NotificationContext);
