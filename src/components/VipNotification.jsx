import React, { useEffect, useRef } from "react";
import { useNotification } from "../context/NotificationContext";

export default function VipNotification() {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
  } = useNotification();

  //  Sound from public/notify.mp3
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          Notifications ({unreadCount})
        </h2>
        <button
          onClick={handleMarkAllAsRead}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Mark All Read
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {notifications.length === 0 ? (
        <p>No Notifications</p>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-3 border rounded ${
                n.notificationRead ? "bg-gray-100" : "bg-yellow-50"
              }`}
            >
              <p className="font-semibold">
                {n.notificationMessage}
              </p>

              {!n.notificationRead && (
                <button
                  onClick={() => handleMarkAsRead(n._id)}
                  className="text-sm text-blue-600 mt-1"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
