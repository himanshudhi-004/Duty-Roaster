import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  //  Get token & role safely
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userId =
    JSON.parse(localStorage.getItem("admin"))?._id ||
    JSON.parse(localStorage.getItem("vip"))?._id ||
    JSON.parse(localStorage.getItem("guard"))?._id ||
    JSON.parse(localStorage.getItem("user"))?._id;

  //  Fetch Notifications (GLOBAL)
  const fetchNotifications = async () => {
    if (!token || !role || !userId) return;

    try {
      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}/api/notifications/${role}/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(res.data || []);

      const unread = res.data.filter((n) => !n.notificationRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Notification Fetch Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  //  Mark as Read
  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${BASE_URL}/api/notifications/read/${id}`,
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

  //  Mark All Read
  const markAllAsRead = async () => {
    try {
      await axios.put(
        `${BASE_URL}/api/notifications/read-all/${role}/${userId}`,
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

  //  GLOBAL AUTO FETCH ON APP LOAD
  useEffect(() => {
    fetchNotifications();
  }, [role, userId]);

  //  AUTO REFRESH EVERY 15 SECONDS
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

//  Custom Hook
export const useNotification = () => useContext(NotificationContext);
