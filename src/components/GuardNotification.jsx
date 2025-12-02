import React, { useEffect, useRef } from "react";
import { useNotification } from "../context/NotificationContext";

export default function GuardNotification() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotification();

  //  Use your new sound file
  const notificationSound = useRef(new Audio("/notify.mp3"));
  const prevUnreadCount = useRef(unreadCount);

  /*  Play sound when new unread notification arrives */
  useEffect(() => {
    if (unreadCount > prevUnreadCount.current) {
      notificationSound.current.play().catch(() => {});
    }
    prevUnreadCount.current = unreadCount;
  }, [unreadCount]);

  /*  Sound on manual actions */
  const handleMarkAsRead = (id) => {
    notificationSound.current.play().catch(() => {});
    markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    notificationSound.current.play().catch(() => {});
    markAllAsRead();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-3">
        Guard Notifications ({unreadCount})
      </h2>

      <button
        onClick={handleMarkAllAsRead}
        className="mb-3 bg-green-600 text-white px-3 py-1 rounded"
      >
        Clear All
      </button>

      {notifications.map((n) => (
        <div key={n._id} className="border p-2 mb-2 rounded">
          <p>{n.notificationMessage}</p>

          {!n.notificationRead && (
            <button
              onClick={() => handleMarkAsRead(n._id)}
              className="text-blue-500 text-sm"
            >
              Mark Read
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
