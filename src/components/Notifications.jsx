// import React, { useEffect, useRef, useState, useMemo } from "react";
// import axios from "axios";

// const BASE_URL = process.env.REACT_APP_BASE_URL;
// const ITEMS_PER_PAGE = 20;

// export default function Notifications() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);

//   /* 🔊 SOUND */
//   const notificationSound = useRef(new Audio("/notify.mp3"));
//   const prevUnreadCount = useRef(0);

//   /*  ROLE-BASED TOKEN */
//   const role = localStorage.getItem("role");
//   const token =
//     role === "admin"
//       ? localStorage.getItem("adminToken")
//       : localStorage.getItem("userToken");

//   /*  STABLE FETCH FUNCTION */
//   const fetchNotifications = useRef(null);

//   useEffect(() => {
//     fetchNotifications.current = async () => {
//       try {
//         setLoading(true);

//         const res = await axios.get(
//           `${BASE_URL}/api/notification/all`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         setNotifications(Array.isArray(res.data) ? res.data : []);
//       } catch (err) {
//         console.error("Notification fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//   }, [token]);

//   /*  POLLING */
//   useEffect(() => {
//     fetchNotifications.current?.();

//     const interval = setInterval(() => {
//       fetchNotifications.current?.();
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   /*  UNREAD COUNT */
//   const unreadCount = notifications.filter(
//     (n) => !n.notificationStatus
//   ).length;

//   /* 🔊 SOUND ON NEW NOTIFICATION */
//   useEffect(() => {
//     if (unreadCount > prevUnreadCount.current) {
//       notificationSound.current.play().catch(() => { });
//     }
//     prevUnreadCount.current = unreadCount;
//   }, [unreadCount]);

//   /*  SEARCH + FILTER */
//   const filteredData = useMemo(() => {
//     const text = search.trim().toLowerCase();

//     return notifications.filter((n) => {
//       const searchMatch = text
//         ? [
//           n.notificationMessage,
//           n.notificationSenderName,
//           n.notificationSender,
//           n.notificationStatus ? "read" : "unread",
//         ].some((field) =>
//           String(field || "").toLowerCase().includes(text)
//         )
//         : true;

//       const statusMatch = statusFilter
//         ? statusFilter === "read"
//           ? n.notificationStatus
//           : !n.notificationStatus
//         : true;

//       return searchMatch && statusMatch;
//     });
//   }, [notifications, search, statusFilter]);

//   /*  PAGINATION */
//   const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

//   const paginatedData = filteredData.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   );

//   /*  FORMAT DATE FUNCTION  */
//   const formatDate = (dateStr) => {
//     if (!dateStr) return "--";
//     const d = new Date(dateStr);
//     return isNaN(d)
//       ? "--"
//       : d.toLocaleString("en-IN", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: true,
//       });
//   };

//   /*  MARK SINGLE READ */
//   const handleMarkAsRead = async (id) => {
//     try {
//       await axios.get(
//         `${BASE_URL}/api/notification/read/${id}/${role}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       notificationSound.current.play().catch(() => { });
//       fetchNotifications.current?.();
//     } catch (err) {
//       console.error("Mark read failed", err);
//     }
//   };

//   /*  MARK ALL READ */
//   const handleMarkAllAsRead = async () => {
//     const unread = notifications.filter(
//       (n) => !n.notificationStatus
//     );

//     try {
//       await Promise.all(
//         unread.map((n) =>
//           axios.get(
//             `${BASE_URL}/api/notifications/admin/read/${n.notificationId}`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           )
//         )
//       );

//       notificationSound.current.play().catch(() => { });
//       fetchNotifications.current?.();
//     } catch (err) {
//       console.error("Mark all read failed", err);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.title}>
//         System Notifications ({unreadCount})
//       </h2>

//       {/*  FILTER ROW */}
//       <div style={styles.filterRow}>
//         <div style={styles.filterCard}>
//           <label style={styles.filterLabel}>Search</label>
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search message, user, role..."
//             style={styles.input}
//           />
//         </div>

//         <div style={styles.filterCard}>
//           <label style={styles.filterLabel}>Status</label>
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             style={styles.select}
//           >
//             <option value="">All</option>
//             <option value="read">Read</option>
//             <option value="unread">Unread</option>
//           </select>
//         </div>

//         <div style={{ alignSelf: "end" }}>
//           <button style={styles.acceptBtn} onClick={handleMarkAllAsRead}>
//             Mark All Read
//           </button>
//         </div>
//       </div>

//       {/*  TABLE */}
//       <div style={styles.card}>
//         {loading ? (
//           <div style={styles.noData}>Loading...</div>
//         ) : paginatedData.length === 0 ? (
//           <div style={styles.noData}>No Notifications Found</div>
//         ) : (
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th style={styles.th}>#</th>
//                 <th style={styles.th}>Message</th>
//                 <th style={styles.th}>Sender Name</th>
//                 <th style={styles.th}>Role</th>
//                 <th style={styles.th}>Read By</th>
//                 <th style={styles.th}>Receive Time</th>
//                 <th style={styles.th}>Read Time</th>
//                 <th style={styles.th}>Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {paginatedData.map((item, index) => {
//                 const statusStyle = item.notificationStatus
//                   ? styles.statusActive
//                   : styles.statusOther;

//                 return (
//                   <tr key={item.notificationId} style={styles.row}>
//                     <td style={styles.td}>
//                       {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
//                     </td>

//                     <td style={styles.td}>{item.notificationMessage}</td>
//                     <td style={styles.td}>
//                       {item.notificationSenderName || "System"}
//                     </td>
//                     <td style={styles.td}>{item.notificationSender}</td>

//                     <td style={styles.td}>
//                       <span style={statusStyle}>
//                           {
//                           `Read by ${item.notificationReadBy === "admin" ? "Admin" : "Manager"}`
                          
//                           }
                          
//                       </span>
//                     </td>


//                     {/*  NORMAL DATE TIME FORMAT */}
//                     <td style={styles.td}>
//                       {formatDate(item.notificationAssignTime)}
//                     </td>

//                     <td style={styles.td}>
//                       {formatDate(item.notificationReadTime)}
//                     </td>

//                     <td style={styles.td}>
//                       {item.notificationStatus ? (
//                         <span style={{ color: "#888" }}>Completed</span>
//                       ) : (
//                         <button
//                           style={styles.acceptBtn}
//                           onClick={() =>
//                             handleMarkAsRead(item.notificationId)
//                           }
//                         >
//                           Mark Read
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/*  PAGINATION */}
//       {totalPages > 1 && (
//         <div style={styles.pagination}>
//           <button
//             style={styles.pageBtn}
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((p) => p - 1)}
//           >
//             Prev
//           </button>

//           {[...Array(totalPages)].map((_, i) => (
//             <button
//               key={i}
//               style={{
//                 ...styles.pageBtn,
//                 background: currentPage === i + 1 ? "#1a73e8" : "#fff",
//                 color: currentPage === i + 1 ? "#fff" : "#000",
//               }}
//               onClick={() => setCurrentPage(i + 1)}
//             >
//               {i + 1}
//             </button>
//           ))}

//           <button
//             style={styles.pageBtn}
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage((p) => p + 1)}
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ================== STYLES ================== */
// const styles = {
//   container: { padding: 30, background: "#fff" },
//   title: { fontSize: 30, fontWeight: 800, marginBottom: 25, color: "#1967d2" },

//   filterRow: { display: "flex", gap: 20, marginBottom: 25 },
//   filterCard: {
//     flex: 1,
//     padding: 18,
//     borderRadius: 12,
//     background: "#fff",
//     boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
//   },

//   filterLabel: { fontSize: 15, fontWeight: 600, marginBottom: 6 },

//   select: {
//     width: "100%",
//     padding: 12,
//     borderRadius: 8,
//     border: "1.5px solid #1a73e8",
//     fontSize: 15,
//   },

//   input: {
//     width: "100%",
//     padding: 12,
//     borderRadius: 8,
//     border: "1.5px solid #1a73e8",
//     fontSize: 15,
//   },

//   card: {
//     background: "#fff",
//     padding: 10,
//     borderRadius: 15,
//     boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
//   },

//   table: { width: "100%", borderCollapse: "collapse" },

//   th: {
//     background: "#f4f4f6",
//     padding: "16px 10px",
//     fontWeight: 700,
//   },

//   row: { height: 62 },
//   td: { padding: "14px 10px", borderBottom: "1px solid #eee" },

//   statusActive: {
//     background: "#e6ffe6",
//     padding: "6px 12px",
//     borderRadius: 20,
//     color: "#2e7d32",
//     fontWeight: 600,
//   },

//   statusOther: {
//     background: "#fff8e1",
//     padding: "6px 12px",
//     borderRadius: 20,
//     color: "#ff9800",
//     fontWeight: 600,
//   },

//   acceptBtn: {
//     background: "#2e7d32",
//     color: "#fff",
//     border: "none",
//     padding: "7px 14px",
//     borderRadius: 8,
//     cursor: "pointer",
//   },

//   pagination: {
//     display: "flex",
//     justifyContent: "center",
//     marginTop: 20,
//     gap: 8,
//   },

//   pageBtn: {
//     padding: "6px 14px",
//     border: "1px solid #ccc",
//     borderRadius: 6,
//     cursor: "pointer",
//   },

//   noData: {
//     textAlign: "center",
//     padding: 40,
//     fontSize: 18,
//     color: "#777",
//   },
// };


import React, { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const ITEMS_PER_PAGE = 20;

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /* 🔊 SOUND */
  const notificationSound = useRef(new Audio("/notify.mp3"));
  const prevUnreadCount = useRef(0);

  /*  ROLE-BASED TOKEN */
  const role = localStorage.getItem("role");
  const token =
    role === "admin"
      ? localStorage.getItem("adminToken")
      : localStorage.getItem("userToken");

  /*  STABLE FETCH FUNCTION */
  const fetchNotifications = useRef(null);

  useEffect(() => {
    fetchNotifications.current = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BASE_URL}/api/notification/all`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        /*  ONLY CHANGE: SORT LATEST FIRST */
        const sortedData = Array.isArray(res.data)
          ? [...res.data].sort(
              (a, b) =>
                new Date(b.notificationAssignTime || 0) -
                new Date(a.notificationAssignTime || 0)
            )
          : [];

        setNotifications(sortedData);
      } catch (err) {
        console.error("Notification fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
  }, [token]);

  /*  INITIAL LOAD ONLY */
  useEffect(() => {
    fetchNotifications.current?.();
  }, []);

  /*  UNREAD COUNT */
  const unreadCount = notifications.filter(
    (n) => !n.notificationStatus
  ).length;

  /* 🔊 SOUND ON NEW NOTIFICATION */
  useEffect(() => {
    if (unreadCount > prevUnreadCount.current) {
      notificationSound.current.play().catch(() => {});
    }
    prevUnreadCount.current = unreadCount;
  }, [unreadCount]);

  /*  SEARCH + FILTER */
  const filteredData = useMemo(() => {
    const text = search.trim().toLowerCase();

    return notifications.filter((n) => {
      const searchMatch = text
        ? [
            n.notificationMessage,
            n.notificationSenderName,
            n.notificationSender,
            n.notificationStatus ? "read" : "unread",
          ].some((field) =>
            String(field || "").toLowerCase().includes(text)
          )
        : true;

      const statusMatch = statusFilter
        ? statusFilter === "read"
          ? n.notificationStatus
          : !n.notificationStatus
        : true;

      return searchMatch && statusMatch;
    });
  }, [notifications, search, statusFilter]);

  /*  PAGINATION */
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /*  FORMAT DATE FUNCTION  */
  const formatDate = (dateStr) => {
    if (!dateStr) return "--";
    const d = new Date(dateStr);
    return isNaN(d)
      ? "--"
      : d.toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
  };

  /*  MARK SINGLE READ */
  const handleMarkAsRead = async (id) => {
    try {
      await axios.get(
        `${BASE_URL}/api/notification/read/${id}/${role}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      notificationSound.current.play().catch(() => {});
      fetchNotifications.current?.();
    } catch (err) {
      console.error("Mark read failed", err);
    }
  };

  /*  MARK ALL READ */
  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter(
      (n) => !n.notificationStatus
    );

    try {
      await Promise.all(
        unread.map((n) =>
          axios.get(
            `${BASE_URL}/api/notifications/admin/read/${n.notificationId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );

      notificationSound.current.play().catch(() => {});
      fetchNotifications.current?.();
    } catch (err) {
      console.error("Mark all read failed", err);
    }
  };

  /*  MANUAL REFRESH BUTTON */
  const handleRefresh = () => {
    fetchNotifications.current?.();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        System Notifications ({unreadCount})
      </h2>

      {/*  FILTER ROW */}
      <div style={styles.filterRow}>
        <div style={styles.filterCard}>
          <label style={styles.filterLabel}>Search</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search message, user, role..."
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

        <div style={{ alignSelf: "end", display: "flex", gap: 10 }}>
          <button style={styles.refreshBtn} onClick={handleRefresh}>
            Refresh
          </button>

          <button style={styles.acceptBtn} onClick={handleMarkAllAsRead}>
            Mark All Read
          </button>
        </div>
      </div>

      {/*  TABLE */}
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
                <th style={styles.th}>Sender Name</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Read By</th>
                <th style={styles.th}>Receive Time</th>
                <th style={styles.th}>Read Time</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((item, index) => {
                const statusStyle = item.notificationStatus
                  ? styles.statusActive
                  : styles.statusOther;

                return (
                  <tr key={item.notificationId} style={styles.row}>
                    <td style={styles.td}>
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>

                    <td style={styles.td}>{item.notificationMessage}</td>
                    <td style={styles.td}>
                      {item.notificationSenderName || "System"}
                    </td>
                    <td style={styles.td}>{item.notificationSender}</td>

                    <td style={styles.td}>
                      <span style={statusStyle}>
                        {`Read by ${
                          item.notificationReadBy === "admin"
                            ? "Admin"
                            : "Manager"
                        }`}
                      </span>
                    </td>

                    <td style={styles.td}>
                      {formatDate(item.notificationAssignTime)}
                    </td>

                    <td style={styles.td}>
                      {formatDate(item.notificationReadTime)}
                    </td>

                    <td style={styles.td}>
                      {item.notificationStatus ? (
                        <span style={{ color: "#888" }}>Completed</span>
                      ) : (
                        <button
                          style={styles.acceptBtn}
                          onClick={() =>
                            handleMarkAsRead(item.notificationId)
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

      {/*  PAGINATION */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
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

/* ================== STYLES ================== */
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
    padding: 12,
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

  refreshBtn: {
    background: "#1a73e8",
    color: "#fff",
    border: "none",
    padding: "7px 14px",
    borderRadius: 8,
    cursor: "pointer",
  },

  pagination: {
    display: "flex",
    justifyContent: "center",
    marginTop: 20,
    gap: 8,
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
