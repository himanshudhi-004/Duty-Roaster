import React, { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";
import { useVipStore } from "../context/VipContext";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const ITEMS_PER_PAGE = 10;

export default function VipNotification() {
  const { selectedVip } = useVipStore();
  const vipId = selectedVip?._id || selectedVip?.id;

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /* 🔊 SOUND */
  const notificationSound = useRef(new Audio("/notify.mp3"));
  const prevUnreadCount = useRef(0);

  /* ✅ STABLE FETCH FUNCTION */
  const fetchNotifications = useRef(null);

  useEffect(() => {
    fetchNotifications.current = async () => {
      if (!vipId) return;

      try {
        setLoading(true);
        const token = localStorage.getItem("vipToken");

        const res = await axios.get(
          `${BASE_URL}/api/notification/vip/${vipId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setNotifications(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("VIP Notification fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
  }, [vipId]);

  /* ✅ POLLING + VIP CHANGE HANDLER */
  useEffect(() => {
    if (!vipId) return;

    // Reset when VIP changes
    setNotifications([]);
    setCurrentPage(1);

    // First immediate fetch
    fetchNotifications.current?.();

    // Poll every 5 seconds
    const interval = setInterval(() => {
      fetchNotifications.current?.();
    }, 5000);

    return () => clearInterval(interval);
  }, [vipId]);

  /* ✅ UNREAD COUNT */
  const unreadCount = notifications.filter((n) => !n.read).length;

  /* 🔊 PLAY SOUND ON NEW NOTIFICATION */
  useEffect(() => {
    if (unreadCount > prevUnreadCount.current) {
      notificationSound.current.play().catch(() => {});
    }
    prevUnreadCount.current = unreadCount;
  }, [unreadCount]);

  /* ✅ SEARCH + FILTER */
  const filteredData = useMemo(() => {
    const text = search.trim().toLowerCase();

    return notifications.filter((n) => {
      const searchMatch = text
        ? [n.message, n.vip?.name, n.read ? "read" : "unread"].some((field) =>
            String(field || "").toLowerCase().includes(text)
          )
        : true;

      const statusMatch = statusFilter
        ? statusFilter === "read"
          ? n.read
          : !n.read
        : true;

      return searchMatch && statusMatch;
    });
  }, [notifications, search, statusFilter]);

  /* ✅ PAGINATION */
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* ✅ MARK SINGLE READ */
  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem("vipToken");

      await axios.get(`${BASE_URL}/api/notification/vip/read/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      notificationSound.current.play().catch(() => {});
      fetchNotifications.current?.();
    } catch (err) {
      console.error("VIP mark read failed", err);
    }
  };

  /* ✅ MARK ALL READ (FIXED _id BUG) */
  const handleMarkAllAsRead = async () => {
    const token = localStorage.getItem("vipToken");
    const unread = notifications.filter((n) => !n.read);

    try {
      await Promise.all(
        unread.map((n) =>
          axios.get(
            `${BASE_URL}/api/notification/vip/read/${n._id || n.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );

      notificationSound.current.play().catch(() => {});
      fetchNotifications.current?.();
    } catch (err) {
      console.error("VIP mark all read failed", err);
    }
  };

  if (!vipId) {
    return (
      <div style={styles.container}>
        <div style={styles.noData}>No VIP Selected</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        VIP Notification Management ({unreadCount})
      </h2>

      {/* ✅ FILTER ROW */}
      <div style={styles.filterRow}>
        <div style={styles.filterCard}>
          <label style={styles.filterLabel}>Search</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by message or Vip..."
            style={styles.input}
          />
        </div>

        <div style={styles.filterCard}>
          <label style={styles.filterLabel}>Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.select}
          >
            <option value="">All</option>
            <option value="read">Read</option>
            <option value="unread">Unread</option>
          </select>
        </div>

        <div style={{ alignSelf: "end" }}>
          <button style={styles.acceptBtn} onClick={handleMarkAllAsRead}>
            Mark All Read
          </button>
        </div>
      </div>

      {/* ✅ TABLE */}
      <div style={styles.card}>
        {loading ? (
          <div style={styles.noData}>Loading...</div>
        ) : paginatedData.length === 0 ? (
          <div style={styles.noData}>No Notifications Found</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Message</th>
                <th style={styles.th}>Vip</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((item, index) => {
                const statusStyle = item.read
                  ? styles.statusActive
                  : styles.statusOther;

                return (
                  <tr key={item._id || item.id} style={styles.row}>
                    <td style={styles.td}>
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>

                    <td style={styles.td}>{item.message}</td>

                    <td style={styles.td}>{item.vip?.name || "N/A"}</td>

                    <td style={styles.td}>
                      <span style={statusStyle}>
                        {item.read ? "Read" : "Unread"}
                      </span>
                    </td>

                    <td style={styles.td}>
                      {item.read ? (
                        <span style={{ color: "#888" }}>Completed</span>
                      ) : (
                        <button
                          style={styles.acceptBtn}
                          onClick={() =>
                            handleMarkAsRead(item._id || item.id)
                          }
                        >
                          Mark Read
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ✅ PAGINATION */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 20, gap: 8 }}>
          <button
            style={styles.pageBtn}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              style={{
                ...styles.pageBtn,
                background: currentPage === i + 1 ? "#1a73e8" : "#fff",
                color: currentPage === i + 1 ? "#fff" : "#000",
              }}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            style={styles.pageBtn}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

/* ✅ STYLES */
const styles = {
  container: { padding: 30, background: "#fff" },
  title: { fontSize: 30, fontWeight: 800, marginBottom: 25, color: "#1967d2" },

  filterRow: { display: "flex", gap: 20, marginBottom: 25 },
  filterCard: {
    flex: 1,
    padding: 18,
    borderRadius: 12,
    background: "#fff",
    boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
  },

  filterLabel: { fontSize: 15, fontWeight: 600, marginBottom: 6 },

  select: {
    width: "100%",
    padding: "12px",
    borderRadius: 8,
    border: "1.5px solid #1a73e8",
    fontSize: 15,
  },

  input: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "1.5px solid #1a73e8",
    fontSize: 15,
    outline: "none",
  },

  card: {
    background: "#fff",
    padding: 10,
    borderRadius: 15,
    boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
  },

  table: { width: "100%", borderCollapse: "collapse" },

  th: {
    background: "#f4f4f6",
    padding: "16px 10px",
    textAlign: "left",
    borderBottom: "2px solid #ddd",
    fontWeight: 700,
  },

  row: { height: 62 },
  td: { padding: "14px 10px", borderBottom: "1px solid #eee" },

  statusActive: {
    background: "#e6ffe6",
    padding: "6px 12px",
    borderRadius: 20,
    color: "#2e7d32",
    fontWeight: 600,
  },

  statusOther: {
    background: "#fff8e1",
    padding: "6px 12px",
    borderRadius: 20,
    color: "#ff9800",
    fontWeight: 600,
  },

  acceptBtn: {
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    padding: "7px 14px",
    borderRadius: 8,
    cursor: "pointer",
  },

  pageBtn: {
    padding: "6px 14px",
    border: "1px solid #ccc",
    borderRadius: 6,
    cursor: "pointer",
  },

  noData: {
    textAlign: "center",
    padding: 40,
    fontSize: 18,
    color: "#777",
  },
};





// import React, { useEffect, useRef } from "react";
// import { useNotification } from "../context/NotificationContext";

// export default function VipNotification() {
//   const {
//     notifications,
//     unreadCount,
//     loading,
//     markAsRead,
//     markAllAsRead,
//   } = useNotification();

//   //  Sound from public/notify.mp3
//   const notificationSound = useRef(new Audio("/notify.mp3"));
//   const prevUnreadCount = useRef(unreadCount);

//   /*  Play sound when new unread notification arrives */
//   useEffect(() => {
//     if (unreadCount > prevUnreadCount.current) {
//       notificationSound.current.play().catch(() => {});
//     }
//     prevUnreadCount.current = unreadCount;
//   }, [unreadCount]);

//   /*  Sound on manual actions */
//   const handleMarkAsRead = (id) => {
//     notificationSound.current.play().catch(() => {});
//     markAsRead(id);
//   };

//   const handleMarkAllAsRead = () => {
//     notificationSound.current.play().catch(() => {});
//     markAllAsRead();
//   };

//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-bold">
//           Notifications ({unreadCount})
//         </h2>
//         <button
//           onClick={handleMarkAllAsRead}
//           className="bg-blue-600 text-white px-3 py-1 rounded"
//         >
//           Mark All Read
//         </button>
//       </div>

//       {loading && <p>Loading...</p>}

//       {notifications.length === 0 ? (
//         <p>No Notifications</p>
//       ) : (
//         <div className="space-y-2">
//           {notifications.map((n) => (
//             <div
//               key={n._id}
//               className={`p-3 border rounded ${
//                 n.notificationRead ? "bg-gray-100" : "bg-yellow-50"
//               }`}
//             >
//               <p className="font-semibold">
//                 {n.notificationMessage}
//               </p>

//               {!n.notificationRead && (
//                 <button
//                   onClick={() => handleMarkAsRead(n._id)}
//                   className="text-sm text-blue-600 mt-1"
//                 >
//                   Mark Read
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
