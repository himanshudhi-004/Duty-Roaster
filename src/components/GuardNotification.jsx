import React, { useEffect, useRef, useMemo } from "react";
import { useNotification } from "../context/NotificationContext";
import { useGuardStore } from "../context/GuardContext";

export default function GuardNotification() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotification();

  const { selectedGuard } = useGuardStore(); // ✅ GET GUARD FROM CONTEXT

  const guardId = selectedGuard?._id || selectedGuard?.id; // ✅ SAFE ID PICK

  // ✅ SOUND
  const notificationSound = useRef(new Audio("/notify.mp3"));
  const prevUnreadCount = useRef(unreadCount);

  /* ✅ FILTER ONLY THIS GUARD'S NOTIFICATIONS */
  const guardNotifications = useMemo(() => {
    return notifications.filter(
      (n) => n.guardId === guardId
    );
  }, [notifications, guardId]);

  const guardUnreadCount = guardNotifications.filter(
    (n) => !n.notificationRead
  ).length;

  /* ✅ PLAY SOUND WHEN NEW NOTIFICATION ARRIVES */
  useEffect(() => {
    if (guardUnreadCount > prevUnreadCount.current) {
      notificationSound.current.play().catch(() => {});
    }
    prevUnreadCount.current = guardUnreadCount;
  }, [guardUnreadCount]);

  /* ✅ MARK SINGLE READ WITH SOUND */
  const handleMarkAsRead = (id) => {
    notificationSound.current.play().catch(() => {});
    markAsRead(id);
  };

  /* ✅ MARK ALL READ (ONLY THIS GUARD) */
  const handleMarkAllAsRead = () => {
    notificationSound.current.play().catch(() => {});

    guardNotifications.forEach((n) => {
      if (!n.notificationRead) {
        markAsRead(n._id);
      }
    });
  };

  /* ✅ SAFETY CHECK */
  if (!guardId) {
    return (
      <div className="p-4 text-red-600 font-semibold">
        No Guard Selected
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl mb-3 font-bold">
        Guard Notifications ({guardUnreadCount})
      </h2>

      {guardNotifications.length > 0 && (
        <button
          onClick={handleMarkAllAsRead}
          className="mb-3 bg-green-600 text-white px-3 py-1 rounded"
        >
          Clear All
        </button>
      )}

      {guardNotifications.length === 0 && (
        <p className="text-gray-500">No notifications found.</p>
      )}

      {guardNotifications.map((n) => (
        <div
          key={n._id}
          className={`border p-2 mb-2 rounded ${
            n.notificationRead ? "bg-gray-100" : "bg-yellow-50"
          }`}
        >
          <p className="font-medium">{n.notificationMessage}</p>

          {!n.notificationRead && (
            <button
              onClick={() => handleMarkAsRead(n._id)}
              className="text-blue-500 text-sm mt-1"
            >
              Mark Read
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
