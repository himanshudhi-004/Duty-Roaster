// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useGuardStore } from "../context/GuardContext";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

// export default function GuardIncidentHistory() {
//   const { selectedGuard } = useGuardStore();

//   const [incidents, setIncidents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const guardId = selectedGuard?.id || selectedGuard?.guard_id;
//   const guardToken = localStorage.getItem("guardToken");


//  useEffect(() => {
//     fetchIncidentHistory();
//     console.log("Guard ID in Effect:", guardId);
//   }, []);

//   const fetchIncidentHistory = async () => {
//     try {
//       const token = localStorage.getItem("guardToken");
//       console.log("Guard Token:", token);
//       if (!token) return;

    

//       const res = await axios.get(`${BASE_URL}/api/duty/accidentreq/${guardId}`, {
    
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setIncidents(res.data || []);
//     } catch (err) {
//       console.log("Profile Fetch Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2 style={{ marginBottom: "15px" }}>Guard Incident History</h2>

//       {loading && <p>Loading...</p>}
//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {!loading && incidents.length === 0 && !error && (
//         <p>No incident records found.</p>
//       )}

//       {!loading && incidents.length > 0 && (
//         <div style={{ overflowX: "auto" }}>
//           <table
//             style={{
//               width: "100%",
//               borderCollapse: "collapse",
//               background: "#fff",
//             }}
//           >
//             <thead>
//               <tr style={{ background: "#f5f5f5" }}>
//                 <th style={thStyle}>#</th>
//                 <th style={thStyle}>Guard ID</th>
//                 <th style={thStyle}>Status</th>
//                 <th style={thStyle}>Message</th>
//                 {/* <th style={thStyle}>Status</th> */}
//                 {/* <th style={thStyle}>Admin Status</th>
//                 <th style={thStyle}>Manager Status</th> */}
//                 {/* <th style={thStyle}>Created At</th> */}
//               </tr>
//             </thead>
//             <tbody>
//               {incidents.map((item, index) => (
//                 <tr key={item.id || index}>
//                   <td style={tdStyle}>{index + 1}</td>
//                   <td style={tdStyle}>{item.guard_id || guardId}</td>
//                   <td style={tdStyle}>{item.req}</td>
//                 <td style={tdStyle}>{item.message || "-"}</td>
//                   {/* <td style={tdStyle}>{item.admin_status || item.manager_status || "Pending"}</td> */}
//                   {/* <td style={tdStyle}>{item.admin_status || "Pending"}</td>
//                   <td style={tdStyle}>{item.manager_status || "Pending"}</td> */}
//                   {/* <td style={tdStyle}>
//                     {item.createdAt
//                       ? new Date(item.createdAt).toLocaleString()
//                       : "-"}
//                   </td> */}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// /*  TABLE STYLES */
// const thStyle = {
//   padding: "10px",
//   border: "1px solid #ddd",
//   fontWeight: "bold",
//   textAlign: "left",
// };

// const tdStyle = {
//   padding: "10px",
//   border: "1px solid #ddd",
// };



import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useGuardStore } from "../context/GuardContext";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const PER_PAGE = 10;

export default function GuardIncidentHistory() {
  const { selectedGuard } = useGuardStore();

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const guardId = selectedGuard?.id || selectedGuard?.guard_id;
  const guardToken = localStorage.getItem("guardToken");

  useEffect(() => {
    fetchIncidentHistory();
    console.log("Guard ID in Effect:", guardId);
  }, []);

  const fetchIncidentHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("guardToken");
      console.log("Guard Token:", token);
      if (!token) return;

      const res = await axios.get(
        `${BASE_URL}/api/duty/accidentreq/${guardId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIncidents(res.data || []);
    } catch (err) {
      console.log("Profile Fetch Error:", err);
      setError("Failed to load incident history");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- PAGINATION LOGIC ---------------- */
  const totalPages = Math.ceil(incidents.length / PER_PAGE);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return incidents.slice(start, start + PER_PAGE);
  }, [incidents, currentPage]);

  /* ---------------- STATUS COLOR LOGIC ---------------- */
  const getStatusColor = (status) => {
    const value = status?.toLowerCase();

    if (value === "manager_accepted") return "#17a2b8"; // blue
    if (value === "manager_rejected") return "#6f42c1"; // purple
    if (value === "admin_accepted") return "#28a745";   // green
    if (value === "admin_rejected") return "#dc3545";   // red
    if (value === "arise") return "#ffc107";            // yellow
    return "#6c757d";                                   // pending/other
  };

  return (
    <div style={styles.pageContainer}>
      {/* -------- HEADER -------- */}
      <div style={styles.header}>
        <h2 style={styles.title}>Guard Incident History</h2>
        <p style={styles.subtitle}>View all your past incident requests</p>
      </div>

      {/* -------- TABLE -------- */}
      <div style={styles.card}>
        {loading && <p style={styles.loading}>Loading...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {!loading && incidents.length === 0 && !error && (
          <p style={styles.empty}>No incident records found.</p>
        )}

        {!loading && incidents.length > 0 && (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={thStyle}>#</th>
                    <th style={thStyle}>Guard ID</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Message</th>
                    <th style={thStyle}>Request Time</th>
                    <th style={thStyle}>Response Time</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item, index) => {
                    const status =
                      item.admin_status ||
                      item.manager_status ||
                      item.req ||
                      "Pending";

                    return (
                      <tr key={item.id || index}>
                        <td style={tdStyle}>
                          {(currentPage - 1) * PER_PAGE + index + 1}
                        </td>

                        <td style={tdStyle}>
                          {item.guard_id || guardId}
                        </td>

                        <td style={tdStyle}>
                          <span
                            style={{
                              ...styles.statusBadge,
                              background: getStatusColor(status),
                            }}
                          >
                            {status}
                          </span>
                        </td>

                        <td style={tdStyle}>{item.message || "-"}</td>
                        <td style={tdStyle}>{item.requestTime || "-"}</td>
                        <td style={tdStyle}>{item.responseTime || "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* -------- PAGINATION -------- */}
            {totalPages > 1 && (
              <div style={styles.pagination}>
                <button
                  style={styles.pageBtn}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Prev
                </button>

                <span style={styles.pageInfo}>
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  style={styles.pageBtn}
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------- UI STYLES ---------------- */

const styles = {
  pageContainer: {
    padding: "25px",
    minHeight: "100vh",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(6px)",
  },
  header: {
    marginBottom: "20px",
    padding: "18px",
    background: "linear-gradient(135deg, #ff9966, #ff5e62)",
    borderRadius: "14px",
    color: "white",
  },
  title: { margin: 0, fontSize: "24px", fontWeight: "700" },
  subtitle: { marginTop: "5px", opacity: 0.9 },

  card: {
    background: "rgba(255,255,255,0.6)",
    borderRadius: "16px",
    padding: "18px",
    boxShadow: "0 8px 18px rgba(0,0,0,0.12)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
  },

  statusBadge: {
    padding: "6px 14px",
    borderRadius: "20px",
    color: "white",
    fontWeight: "700",
    fontSize: "13px",
    textTransform: "capitalize",
  },

  pagination: {
    marginTop: "15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "15px",
  },

  pageBtn: {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "none",
    background: "#ff5e62",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
  },

  pageInfo: {
    fontWeight: "600",
  },

  loading: { textAlign: "center", fontWeight: "600" },
  error: { textAlign: "center", color: "red", fontWeight: "600" },
  empty: { textAlign: "center", fontWeight: "600" },
};

/* ---------------- TABLE STYLES ---------------- */

const thStyle = {
  padding: "12px",
  border: "1px solid #ddd",
  fontWeight: "bold",
  textAlign: "left",
  background: "#f7f7f7",
};

const tdStyle = {
  padding: "12px",
  border: "1px solid #ddd",
};
