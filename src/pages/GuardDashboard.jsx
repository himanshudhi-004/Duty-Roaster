//----------------------------4-----------------------------------------

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGuardStore } from "../context/GuardContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function GuardDashboard() {
  const navigate = useNavigate();
  const { selectedGuard, setSelectedGuard, fetchGuardProfile } = useGuardStore();

  const [guardName, setGuardName] = useState("GUARD");

  const [totalAssignments, setTotalAssignments] = useState(0);
  const [totalIncidents, setTotalIncidents] = useState(0);
  const [totalNotification, setTotalNotification] = useState(0);

  const [shiftVip, setShiftVip] = useState(null);
  const [shiftLoading, setShiftLoading] = useState(true);

  const [activeIncidents, setActiveIncidents] = useState([]);
  const [incidentLoading, setIncidentLoading] = useState(true);

  useEffect(() => {
    if (selectedGuard?.name) {
      setGuardName(selectedGuard.name);
      fetchTotalAssignments(selectedGuard.id);
      fetchTotalIncidents(selectedGuard.id);
      fetchTotalNotifications(selectedGuard.id);
      fetchShiftVip(selectedGuard.id);
      fetchActiveIncidents(selectedGuard.id);
    }
  }, [selectedGuard]);

  useEffect(() => {
    fetchGuardProfile();
  }, []);

  useEffect(() => {
    const syncGuardProfile = async () => {
      try {
        if (selectedGuard?.name) return;

        const stored = localStorage.getItem("selectedGuard");
        if (stored) {
          const parsed = JSON.parse(stored);
          setSelectedGuard(parsed);
          setGuardName(parsed.name);
          fetchTotalAssignments(parsed.id);
          fetchTotalIncidents(parsed.id);
          fetchTotalNotifications(parsed.id);
          fetchShiftVip(parsed.id);
          fetchActiveIncidents(parsed.id);
          return;
        }

        const token = localStorage.getItem("guardToken");
        if (!token) return;

        const decoded = jwtDecode(token);
        const username = decoded.username || decoded.sub || decoded.email;

        const res = await axios.get(`${BASE_URL}/api/officer/profile`, {
          params: { username },
          headers: { Authorization: `Bearer ${token}` },
        });

        const profile = Array.isArray(res.data) ? res.data[0] : res.data;

        setSelectedGuard(profile);
        setGuardName(profile.name);
        localStorage.setItem("selectedGuard", JSON.stringify(profile));

        fetchTotalAssignments(profile.id);
        fetchTotalIncidents(profile.id);
        fetchTotalNotifications(profile.id);
        fetchShiftVip(profile.id);
        fetchActiveIncidents(profile.id);
      } catch (err) {
        console.log("Guard Sync Error:", err);
      }
    };

    syncGuardProfile();
  }, []);

  const fetchTotalAssignments = async (guardId) => {
    try {
      const token = localStorage.getItem("guardToken");
      const res = await axios.get(
        `${BASE_URL}/api/assignments/guard/${guardId}/history`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const history = res.data || [];
      const total = history.reduce(
        (sum, item) => sum + (item.timesAssigned || 0),
        0
      );

      setTotalAssignments(total);
    } catch {
      setTotalAssignments(0);
    }
  };

  const fetchTotalIncidents = async (guardId) => {
    try {
      const token = localStorage.getItem("guardToken");
      const res = await axios.get(
        `${BASE_URL}/api/duty/accidentreq/${guardId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const incidents = res.data || [];
      setTotalIncidents(incidents.length);
    } catch {
      setTotalIncidents(0);
    }
  };

  const fetchTotalNotifications = async (guardId) => {
    try {
      const token = localStorage.getItem("guardToken");

      const res = await axios.get(
        `${BASE_URL}/api/notification/guard/${guardId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const list = Array.isArray(res.data) ? res.data : [];
      setTotalNotification(list.length);
    } catch {
      setTotalNotification(0);
    }
  };

  const fetchShiftVip = async (guardId) => {
    try {
      setShiftLoading(true);
      const token = localStorage.getItem("guardToken");

      const res = await axios.get(
        `${BASE_URL}/api/assignments/getvip/${guardId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const extracted =
        res.data?.data || res.data?.vip || res.data || null;

      setShiftVip(extracted);
    } catch {
      setShiftVip(null);
    } finally {
      setShiftLoading(false);
    }
  };

  const fetchActiveIncidents = async (guardId) => {
    try {
      setIncidentLoading(true);
      const token = localStorage.getItem("guardToken");

      const res = await axios.get(
        `${BASE_URL}/api/duty/accidentreq/${guardId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const all = res.data || [];

      const active = all.filter((item) => {
        const status =
          item.admin_status ||
          item.manager_status ||
          item.req ||
          "pending";

        const value = status.toLowerCase();
        return (
          value === "pending" ||
          value === "arise" ||
          value === "manager_accepted"
        );
      });

      setActiveIncidents(active.slice(0, 5));
    } catch {
      setActiveIncidents([]);
    } finally {
      setIncidentLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  const stats = [
    {
      title: "Total Assignments Assigned",
      value: totalAssignments,
      icon: "fas fa-file",
      color: "#1e73be",
    },
    {
      title: "Total Incident History",
      value: totalIncidents,
      icon: "fas fa-exclamation-triangle",
      color: "#ffa500",
    },
    {
      title: "Total Notifications",
      value: totalNotification,
      icon: "fas fa-bell",
      color: "#28a745",
    },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.headerSection}>
        <div>
          <h2 style={styles.pageTitle}>Guard Dashboard</h2>
          <p style={styles.desc}>
            Overview of assignments, incidents & system activity
          </p>
        </div>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          <i className="fas fa-sign-out-alt" style={{ marginRight: 8 }}></i>
          Logout
        </button>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.welcomeBox}>
          <h2 style={styles.welcomeText}>Welcome {guardName} 👋</h2>
        </div>

        <div style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div
              key={index}
              style={styles.statCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0 12px 25px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(0,0,0,0.1)";
              }}
            >
              <div style={{ ...styles.iconCircle, background: stat.color }}>
                <i className={stat.icon} style={styles.icon}></i>
              </div>
              <h3 style={styles.statValue}>{stat.value}</h3>
              <p style={styles.statTitle}>{stat.title}</p>
            </div>
          ))}
        </div>

        <div style={styles.shiftCard}>
          <h3 style={styles.shiftTitle}>Current Guard Shift</h3>

          <div style={{ overflowX: "auto" }}>
            {shiftLoading ? (
              <p>Loading shift...</p>
            ) : !shiftVip ? (
              <p>No Shift Assigned</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Assignment ID</th>
                    <th style={styles.th}>VIP Name</th>
                    <th style={styles.th}>Designation</th>
                    <th style={styles.th}>Start</th>
                    <th style={styles.th}>End</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    style={styles.row}
                    onClick={() => navigate("/guardshift")}
                  >
                    <td style={styles.td}>{shiftVip.id}</td>
                    <td style={styles.td}>{shiftVip.name}</td>
                    <td style={styles.td}>{shiftVip.designation}</td>
                    <td style={styles.td}>{shiftVip.startAt || "N/A"}</td>
                    <td style={styles.td}>{shiftVip.endAt || "N/A"}</td>
                    <td style={styles.td}>{shiftVip.status || "Assigned"}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div style={styles.shiftCard}>
          <h3 style={styles.shiftTitle}>Active Incidents</h3>

          <div style={{ overflowX: "auto" }}>
            {incidentLoading ? (
              <p>Loading incidents...</p>
            ) : activeIncidents.length === 0 ? (
              <p>No Active Incidents</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>#</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {activeIncidents.map((item, index) => {
                    const status =
                      item.admin_status ||
                      item.manager_status ||
                      item.req ||
                      "Pending";

                    return (
                      <tr
                        key={index}
                        style={styles.row}
                        onClick={() =>
                          navigate("/guardIncidentHistory")
                        }
                      >
                        <td style={styles.td}>{index + 1}</td>
                        <td style={styles.td}>{status}</td>
                        <td style={styles.td}>{item.message || "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================== STYLES (ONLY TRANSITION ADDED) ========================== */
const styles = {
  page: {
    padding: "20px",
    background: "#f4f6f9",
    minHeight: "81vh",
  },
  headerSection: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },
  pageTitle: {
    fontSize: "clamp(22px, 4vw, 30px)",
    fontWeight: 800,
    color: "#1e73be",
  },
  desc: { fontSize: 14, color: "#666" },
  logoutBtn: {
    background: "linear-gradient(135deg,#1e73be,#4facfe)",
    padding: "10px 20px",
    borderRadius: 30,
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
    boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
  },
  mainContent: {
    background: "#fff",
    padding: 22,
    borderRadius: 18,
    boxShadow: "0 10px 28px rgba(0,0,0,0.12)",
  },
  welcomeBox: { marginBottom: 20 },
  welcomeText: {
    fontSize: "clamp(18px, 4vw, 26px)",
    fontWeight: 800,
    color: "#222",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 22,
  },
  statCard: {
    background: "#ffffff",
    borderRadius: 18,
    padding: 20,
    textAlign: "center",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease", // ✅ hover animation enabled
    cursor: "pointer",
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 10px",
  },
  icon: { fontSize: 18, color: "white" },
  statValue: {
    fontSize: 28,
    fontWeight: 800,
    color: "#1e73be",
  },
  statTitle: { fontSize: 13, color: "#777" },
  shiftCard: {
    marginTop: 30,
    background: "#f9fbff",
    padding: 18,
    borderRadius: 18,
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  },
  shiftTitle: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: 800,
    color: "#1e73be",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
  },
  th: {
    padding: 12,
    borderBottom: "2px solid #ddd",
    textAlign: "left",
    fontSize: 13,
    color: "#333",
  },
  td: {
    padding: 12,
    borderBottom: "1px solid #eee",
    fontSize: 13,
    color: "#555",
  },
  row: { cursor: "pointer" },
};






//----------------------------3--------------------------------------------
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useGuardStore } from "../context/GuardContext";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

// export default function GuardDashboard() {
//   const navigate = useNavigate();
//   const { selectedGuard, setSelectedGuard, fetchGuardProfile } = useGuardStore();

//   const [guardName, setGuardName] = useState("GUARD");

//   const [totalAssignments, setTotalAssignments] = useState(0);
//   const [totalIncidents, setTotalIncidents] = useState(0);
//   const [totalNotification, setTotalNotification] = useState(0);

//   const [shiftVip, setShiftVip] = useState(null);
//   const [shiftLoading, setShiftLoading] = useState(true);

//   const [activeIncidents, setActiveIncidents] = useState([]);
//   const [incidentLoading, setIncidentLoading] = useState(true);

//   useEffect(() => {
//     if (selectedGuard?.name) {
//       setGuardName(selectedGuard.name);
//       fetchTotalAssignments(selectedGuard.id);
//       fetchTotalIncidents(selectedGuard.id);
//       fetchTotalNotifications(selectedGuard.id);
//       fetchShiftVip(selectedGuard.id);
//       fetchActiveIncidents(selectedGuard.id);
//     }
//   }, [selectedGuard]);

//   useEffect(() => {
//     fetchGuardProfile();
//   }, []);

//   useEffect(() => {
//     const syncGuardProfile = async () => {
//       try {
//         if (selectedGuard?.name) return;

//         const stored = localStorage.getItem("selectedGuard");
//         if (stored) {
//           const parsed = JSON.parse(stored);
//           setSelectedGuard(parsed);
//           setGuardName(parsed.name);
//           fetchTotalAssignments(parsed.id);
//           fetchTotalIncidents(parsed.id);
//           fetchTotalNotifications(parsed.id);
//           fetchShiftVip(parsed.id);
//           fetchActiveIncidents(parsed.id);
//           return;
//         }

//         const token = localStorage.getItem("guardToken");
//         if (!token) return;

//         const decoded = jwtDecode(token);
//         const username = decoded.username || decoded.sub || decoded.email;

//         const res = await axios.get(`${BASE_URL}/api/officer/profile`, {
//           params: { username },
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const profile = Array.isArray(res.data) ? res.data[0] : res.data;

//         setSelectedGuard(profile);
//         setGuardName(profile.name);
//         localStorage.setItem("selectedGuard", JSON.stringify(profile));

//         fetchTotalAssignments(profile.id);
//         fetchTotalIncidents(profile.id);
//         fetchTotalNotifications(profile.id);
//         fetchShiftVip(profile.id);
//         fetchActiveIncidents(profile.id);
//       } catch (err) {
//         console.log("Guard Sync Error:", err);
//       }
//     };

//     syncGuardProfile();
//   }, []);

//   const fetchTotalAssignments = async (guardId) => {
//     try {
//       const token = localStorage.getItem("guardToken");
//       const res = await axios.get(
//         `${BASE_URL}/api/assignments/guard/${guardId}/history`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const history = res.data || [];
//       const total = history.reduce(
//         (sum, item) => sum + (item.timesAssigned || 0),
//         0
//       );

//       setTotalAssignments(total);
//     } catch {
//       setTotalAssignments(0);
//     }
//   };

//   const fetchTotalIncidents = async (guardId) => {
//     try {
//       const token = localStorage.getItem("guardToken");
//       const res = await axios.get(
//         `${BASE_URL}/api/duty/accidentreq/${guardId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const incidents = res.data || [];
//       setTotalIncidents(incidents.length);
//     } catch {
//       setTotalIncidents(0);
//     }
//   };

//   const fetchTotalNotifications = async (guardId) => {
//     try {
//       const token = localStorage.getItem("guardToken");

//       const res = await axios.get(
//         `${BASE_URL}/api/notification/guard/${guardId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const list = Array.isArray(res.data) ? res.data : [];
//       setTotalNotification(list.length);
//     } catch {
//       setTotalNotification(0);
//     }
//   };

//   const fetchShiftVip = async (guardId) => {
//     try {
//       setShiftLoading(true);
//       const token = localStorage.getItem("guardToken");

//       const res = await axios.get(
//         `${BASE_URL}/api/assignments/getvip/${guardId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const extracted =
//         res.data?.data || res.data?.vip || res.data || null;

//       setShiftVip(extracted);
//     } catch {
//       setShiftVip(null);
//     } finally {
//       setShiftLoading(false);
//     }
//   };

//   const fetchActiveIncidents = async (guardId) => {
//     try {
//       setIncidentLoading(true);
//       const token = localStorage.getItem("guardToken");

//       const res = await axios.get(
//         `${BASE_URL}/api/duty/accidentreq/${guardId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const all = res.data || [];

//       const active = all.filter((item) => {
//         const status =
//           item.admin_status ||
//           item.manager_status ||
//           item.req ||
//           "pending";

//         const value = status.toLowerCase();
//         return (
//           value === "pending" ||
//           value === "arise" ||
//           value === "manager_accepted"
//         );
//       });

//       setActiveIncidents(active.slice(0, 5));
//     } catch {
//       setActiveIncidents([]);
//     } finally {
//       setIncidentLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     sessionStorage.clear();
//     navigate("/login");
//   };

//   const stats = [
//     {
//       title: "Total Assignments Assigned",
//       value: totalAssignments,
//       icon: "fas fa-file",
//       color: "#1e73be",
//     },
//     {
//       title: "Total Incident History",
//       value: totalIncidents,
//       icon: "fas fa-exclamation-triangle",
//       color: "#ffa500",
//     },
//     {
//       title: "Total Notifications",
//       value: totalNotification,
//       icon: "fas fa-bell",
//       color: "#28a745",
//     },
//   ];

//   return (
//     <div style={styles.page}>
//       <div style={styles.headerSection}>
//         <div>
//           <h2 style={styles.pageTitle}>Guard Dashboard</h2>
//           <p style={styles.desc}>
//             Overview of assignments, incidents & system activity
//           </p>
//         </div>

//         <button style={styles.logoutBtn} onClick={handleLogout}>
//           <i className="fas fa-sign-out-alt" style={{ marginRight: 8 }}></i>
//           Logout
//         </button>
//       </div>

//       <div style={styles.mainContent}>
//         <div style={styles.welcomeBox}>
//           <h2 style={styles.welcomeText}>Welcome {guardName} 👋</h2>
//         </div>

//         <div style={styles.statsGrid}>
//           {stats.map((stat, index) => (
//             <div key={index} style={styles.statCard}>
//               <div style={{ ...styles.iconCircle, background: stat.color }}>
//                 <i className={stat.icon} style={styles.icon}></i>
//               </div>
//               <h3 style={styles.statValue}>{stat.value}</h3>
//               <p style={styles.statTitle}>{stat.title}</p>
//             </div>
//           ))}
//         </div>

//         <div style={styles.shiftCard}>
//           <h3 style={styles.shiftTitle}>Current Guard Shift</h3>

//           <div style={{ overflowX: "auto" }}>
//             {shiftLoading ? (
//               <p>Loading shift...</p>
//             ) : !shiftVip ? (
//               <p>No Shift Assigned</p>
//             ) : (
//               <table style={styles.table}>
//                 <thead>
//                   <tr>
//                     <th style={styles.th}>Assignment ID</th>
//                     <th style={styles.th}>VIP Name</th>
//                     <th style={styles.th}>Designation</th>
//                     <th style={styles.th}>Start</th>
//                     <th style={styles.th}>End</th>
//                     <th style={styles.th}>Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr
//                     style={styles.row}
//                     onClick={() => navigate("/guardshift")}
//                   >
//                     <td style={styles.td}>{shiftVip.id}</td>
//                     <td style={styles.td}>{shiftVip.name}</td>
//                     <td style={styles.td}>{shiftVip.designation}</td>
//                     <td style={styles.td}>{shiftVip.startAt || "N/A"}</td>
//                     <td style={styles.td}>{shiftVip.endAt || "N/A"}</td>
//                     <td style={styles.td}>{shiftVip.status || "Assigned"}</td>
//                   </tr>
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </div>

//         <div style={styles.shiftCard}>
//           <h3 style={styles.shiftTitle}>Active Incidents</h3>

//           <div style={{ overflowX: "auto" }}>
//             {incidentLoading ? (
//               <p>Loading incidents...</p>
//             ) : activeIncidents.length === 0 ? (
//               <p>No Active Incidents</p>
//             ) : (
//               <table style={styles.table}>
//                 <thead>
//                   <tr>
//                     <th style={styles.th}>#</th>
//                     <th style={styles.th}>Status</th>
//                     <th style={styles.th}>Message</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {activeIncidents.map((item, index) => {
//                     const status =
//                       item.admin_status ||
//                       item.manager_status ||
//                       item.req ||
//                       "Pending";

//                     return (
//                       <tr
//                         key={index}
//                         style={styles.row}
//                         onClick={() =>
//                           navigate("/guardIncidentHistory")
//                         }
//                       >
//                         <td style={styles.td}>{index + 1}</td>
//                         <td style={styles.td}>{status}</td>
//                         <td style={styles.td}>{item.message || "-"}</td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </div>

        
//       </div>
//     </div>
//   );
// }

// /* ========================== WHITE DASHBOARD THEME ========================== */
// const styles = {
//   page: {
//     padding: "20px",
//     background: "#f4f6f9",
//     minHeight: "81vh",
//   },

//   headerSection: {
//     display: "flex",
//     flexWrap: "wrap",
//     gap: "15px",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 22,
//   },

//   pageTitle: {
//     fontSize: "clamp(22px, 4vw, 30px)",
//     fontWeight: 800,
//     color: "#1e73be",
//   },

//   desc: { fontSize: 14, color: "#666" },

//   logoutBtn: {
//     background: "linear-gradient(135deg,#1e73be,#4facfe)",
//     padding: "10px 20px",
//     borderRadius: 30,
//     color: "#fff",
//     border: "none",
//     cursor: "pointer",
//     fontWeight: 700,
//     boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
//   },

//   mainContent: {
//     background: "#fff",
//     padding: 22,
//     borderRadius: 18,
//     boxShadow: "0 10px 28px rgba(0,0,0,0.12)",
//   },

//   welcomeBox: { marginBottom: 20 },

//   welcomeText: {
//     fontSize: "clamp(18px, 4vw, 26px)",
//     fontWeight: 800,
//     color: "#222",
//   },

//   statsGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//     gap: 22,
//   },

//   statCard: {
//     background: "#ffffff",
//     borderRadius: 18,
//     padding: 20,
//     textAlign: "center",
//     boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
//     transition: "0.25s",
//   },

//   iconCircle: {
//     width: 54,
//     height: 54,
//     borderRadius: "50%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     margin: "0 auto 10px",
//   },

//   icon: { fontSize: 18, color: "white" },

//   statValue: {
//     fontSize: 28,
//     fontWeight: 800,
//     color: "#1e73be",
//   },

//   statTitle: { fontSize: 13, color: "#777" },

//   shiftCard: {
//     marginTop: 30,
//     background: "#f9fbff",
//     padding: 18,
//     borderRadius: 18,
//     boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
//   },

//   shiftTitle: {
//     marginBottom: 10,
//     fontSize: 18,
//     fontWeight: 800,
//     color: "#1e73be",
//   },

//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//     background: "#fff",
//   },

//   th: {
//     padding: 12,
//     borderBottom: "2px solid #ddd",
//     textAlign: "left",
//     fontSize: 13,
//     color: "#333",
//   },

//   td: {
//     padding: 12,
//     borderBottom: "1px solid #eee",
//     fontSize: 13,
//     color: "#555",
//   },

//   row: { cursor: "pointer" },

//   activityBox: {
//     marginTop: 30,
//     padding: 18,
//     borderRadius: 18,
//     background: "#f9fbff",
//     boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
//   },

//   activityTitle: {
//     fontSize: 18,
//     color: "#1e73be",
//     marginBottom: 8,
//     fontWeight: 800,
//   },

//   activityList: {
//     lineHeight: 1.9,
//     paddingLeft: 12,
//     fontSize: 13,
//     color: "#444",
//   },
// };







//--------------------------------2-----------------------------------------
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useGuardStore } from "../context/GuardContext";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

// export default function GuardDashboard() {
//   const navigate = useNavigate();
//   const { selectedGuard, setSelectedGuard, fetchGuardProfile } = useGuardStore();

//   const [guardName, setGuardName] = useState("GUARD");

//   const [totalAssignments, setTotalAssignments] = useState(0);
//   const [totalIncidents, setTotalIncidents] = useState(0);

//   //  ADDED
//   const [totalNotification, setTotalNotification] = useState(0);

//   const [shiftVip, setShiftVip] = useState(null);
//   const [shiftLoading, setShiftLoading] = useState(true);

//   const [activeIncidents, setActiveIncidents] = useState([]);
//   const [incidentLoading, setIncidentLoading] = useState(true);

//   /* ---------------- CONTEXT SYNC ---------------- */
//   useEffect(() => {
//     if (selectedGuard?.name) {
//       setGuardName(selectedGuard.name);
//       fetchTotalAssignments(selectedGuard.id);
//       fetchTotalIncidents(selectedGuard.id);
//       fetchTotalNotifications(selectedGuard.id); //  ADDED
//       fetchShiftVip(selectedGuard.id);
//       fetchActiveIncidents(selectedGuard.id);
//     }
//   }, [selectedGuard]);

//   useEffect(() => {
//     fetchGuardProfile();
//   }, []);

//   useEffect(() => {
//     const syncGuardProfile = async () => {
//       try {
//         if (selectedGuard?.name) return;

//         const stored = localStorage.getItem("selectedGuard");
//         if (stored) {
//           const parsed = JSON.parse(stored);
//           setSelectedGuard(parsed);
//           setGuardName(parsed.name);
//           fetchTotalAssignments(parsed.id);
//           fetchTotalIncidents(parsed.id);
//           fetchTotalNotifications(parsed.id); //  ADDED
//           fetchShiftVip(parsed.id);
//           fetchActiveIncidents(parsed.id);
//           return;
//         }

//         const token = localStorage.getItem("guardToken");
//         if (!token) return;

//         const decoded = jwtDecode(token);
//         const username = decoded.username || decoded.sub || decoded.email;

//         const res = await axios.get(`${BASE_URL}/api/officer/profile`, {
//           params: { username },
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const profile = Array.isArray(res.data) ? res.data[0] : res.data;

//         setSelectedGuard(profile);
//         setGuardName(profile.name);
//         localStorage.setItem("selectedGuard", JSON.stringify(profile));

//         fetchTotalAssignments(profile.id);
//         fetchTotalIncidents(profile.id);
//         fetchTotalNotifications(profile.id); //  ADDED
//         fetchShiftVip(profile.id);
//         fetchActiveIncidents(profile.id);
//       } catch (err) {
//         console.log("Guard Sync Error:", err);
//       }
//     };

//     syncGuardProfile();
//   }, []);

//   /* ---------------- TOTAL ASSIGNMENTS ---------------- */
//   const fetchTotalAssignments = async (guardId) => {
//     try {
//       const token = localStorage.getItem("guardToken");
//       const res = await axios.get(
//         `${BASE_URL}/api/assignments/guard/${guardId}/history`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const history = res.data || [];
//       const total = history.reduce(
//         (sum, item) => sum + (item.timesAssigned || 0),
//         0
//       );

//       setTotalAssignments(total);
//     } catch {
//       setTotalAssignments(0);
//     }
//   };

//   /* ---------------- TOTAL INCIDENTS ---------------- */
//   const fetchTotalIncidents = async (guardId) => {
//     try {
//       const token = localStorage.getItem("guardToken");
//       const res = await axios.get(
//         `${BASE_URL}/api/duty/accidentreq/${guardId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const incidents = res.data || [];
//       setTotalIncidents(incidents.length);
//     } catch {
//       setTotalIncidents(0);
//     }
//   };

//   /* ---------------- TOTAL NOTIFICATIONS  ---------------- */
//   const fetchTotalNotifications = async (guardId) => {
//     try {
//       const token = localStorage.getItem("guardToken");

//       const res = await axios.get(
//         `${BASE_URL}/api/notification/guard/${guardId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const list = Array.isArray(res.data) ? res.data : [];
//       setTotalNotification(list.length);
//     } catch {
//       setTotalNotification(0);
//     }
//   };

//   /* ---------------- SHIFT VIP ---------------- */
//   const fetchShiftVip = async (guardId) => {
//     try {
//       setShiftLoading(true);
//       const token = localStorage.getItem("guardToken");

//       const res = await axios.get(
//         `${BASE_URL}/api/assignments/getvip/${guardId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const extracted =
//         res.data?.data || res.data?.vip || res.data || null;

//       setShiftVip(extracted);
//     } catch {
//       setShiftVip(null);
//     } finally {
//       setShiftLoading(false);
//     }
//   };

//   /* ---------------- ACTIVE INCIDENTS ---------------- */
//   const fetchActiveIncidents = async (guardId) => {
//     try {
//       setIncidentLoading(true);
//       const token = localStorage.getItem("guardToken");

//       const res = await axios.get(
//         `${BASE_URL}/api/duty/accidentreq/${guardId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const all = res.data || [];

//       const active = all.filter((item) => {
//         const status =
//           item.admin_status ||
//           item.manager_status ||
//           item.req ||
//           "pending";

//         const value = status.toLowerCase();
//         return (
//           value === "pending" ||
//           value === "arise" ||
//           value === "manager_accepted"
//         );
//       });

//       setActiveIncidents(active.slice(0, 5));
//     } catch {
//       setActiveIncidents([]);
//     } finally {
//       setIncidentLoading(false);
//     }
//   };

//   /* ---------------- LOGOUT ---------------- */
//   const handleLogout = () => {
//     localStorage.clear();
//     sessionStorage.clear();
//     navigate("/login");
//   };

//   /*  ONLY THIS ARRAY CHANGED */
//   const stats = [
//     {
//       title: "Total Assignments Assigned",
//       value: totalAssignments,
//       icon: "fas fa-file",
//       color: "#1e73be",
//     },
//     {
//       title: "Total Incident History",
//       value: totalIncidents,
//       icon: "fas fa-exclamation-triangle",
//       color: "#ffa500",
//     },
//     {
//       title: "Total Notifications",
//       value: totalNotification,
//       icon: "fas fa-bell",
//       color: "#45f04dff",
//     },
//   ];

//   /*    YOUR FULL ORIGINAL UI JSX – UNTOUCHED */
//   return (
//     <div style={styles.page}>
//       <div style={styles.headerSection}>
//         <div>
//           <h2 style={styles.pageTitle}>Guard DASHBOARD</h2>
//           <p style={styles.desc}>Manage VIPs, Guards & Combined User Count.</p>
//         </div>

//         <button style={styles.logoutBtn} onClick={handleLogout}>
//           <i className="fas fa-sign-out-alt" style={{ marginRight: 8 }}></i>
//           Logout
//         </button>
//       </div>

//       <div style={styles.mainContent}>
//         <div style={styles.welcomeBox}>
//           <h2 style={styles.welcomeText}>Welcome {guardName} 👋</h2>
//         </div>

//         <div style={styles.statsGrid}>
//           {stats.map((stat, index) => (
//             <div key={index} style={styles.statCard}>
//               <div style={{ ...styles.iconCircle, background: stat.color }}>
//                 <i className={stat.icon} style={styles.icon}></i>
//               </div>
//               <h3 style={styles.statValue}>{stat.value}</h3>
//               <p style={styles.statTitle}>{stat.title}</p>
//             </div>
//           ))}
//         </div>

//         {/* ---------------- SHIFT TABLE ---------------- */}
//         <div style={styles.shiftCard}>
//           <h3 style={styles.shiftTitle}>Current Guard Shift</h3>

//           <div style={{ overflowX: "auto" }}>
//             {shiftLoading ? (
//               <p>Loading shift...</p>
//             ) : !shiftVip ? (
//               <p>No Shift Assigned</p>
//             ) : (
//               <table style={styles.table}>
//                 <thead>
//                   <tr>
//                     <th style={styles.th}>Assignment ID</th>
//                     <th style={styles.th}>VIP Name</th>
//                     <th style={styles.th}>Designation</th>
//                     <th style={styles.th}>Start</th>
//                     <th style={styles.th}>End</th>
//                     <th style={styles.th}>Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr
//                     style={styles.row}
//                     onClick={() => navigate("/guardshift")}
//                   >
//                     <td style={styles.td}>{shiftVip.id}</td>
//                     <td style={styles.td}>{shiftVip.name}</td>
//                     <td style={styles.td}>{shiftVip.designation}</td>
//                     <td style={styles.td}>{shiftVip.startAt || "N/A"}</td>
//                     <td style={styles.td}>{shiftVip.endAt || "N/A"}</td>
//                     <td style={styles.td}>{shiftVip.status || "Assigned"}</td>
//                   </tr>
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </div>

//         {/* ---------------- ACTIVE INCIDENTS TABLE ---------------- */}
//         <div style={styles.shiftCard}>
//           <h3 style={styles.shiftTitle}>Active Incidents</h3>

//           <div style={{ overflowX: "auto" }}>
//             {incidentLoading ? (
//               <p>Loading incidents...</p>
//             ) : activeIncidents.length === 0 ? (
//               <p>No Active Incidents</p>
//             ) : (
//               <table style={styles.table}>
//                 <thead>
//                   <tr>
//                     <th style={styles.th}>#</th>
//                     <th style={styles.th}>Status</th>
//                     <th style={styles.th}>Message</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {activeIncidents.map((item, index) => {
//                     const status =
//                       item.admin_status ||
//                       item.manager_status ||
//                       item.req ||
//                       "Pending";

//                     return (
//                       <tr
//                         key={index}
//                         style={styles.row}
//                         onClick={() =>
//                           navigate("/guardIncidentHistory")
//                         }
//                       >
//                         <td style={styles.td}>{index + 1}</td>
//                         <td style={styles.td}>{status}</td>
//                         <td style={styles.td}>{item.message || "-"}</td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </div>

       
//       </div>
//     </div>
//   );
// }

// /* ---------------- ORIGINAL STYLES UNCHANGED ---------------- */
// const styles = {
//   page: { padding: "20px" },
//   headerSection: {
//     display: "flex",
//     flexWrap: "wrap",
//     gap: "15px",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   pageTitle: { fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 700, color: "#1e73be" },
//   desc: { fontSize: 14, opacity: 0.6 },
//   logoutBtn: { background: "#888", padding: "8px 18px", borderRadius: 8, color: "#fff", border: "none", cursor: "pointer", fontWeight: 600 },

//   mainContent: { background: "#fff", padding: 20, borderRadius: 12 },
//   welcomeBox: { marginBottom: 18 },
//   welcomeText: { fontSize: "clamp(18px, 4vw, 26px)", fontWeight: 700, color: "#1e73be" },

//   statsGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
//     gap: 20,
//   },

//   statCard: { background: "white", borderRadius: 12, padding: 18, textAlign: "center" },
//   iconCircle: { width: 50, height: 50, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" },
//   icon: { fontSize: 18, color: "white" },
//   statValue: { fontSize: 24, fontWeight: 700 },
//   statTitle: { fontSize: 13, opacity: 0.6 },

//   shiftCard: { marginTop: 30, background: "#f8fbff", padding: 16, borderRadius: 12 },
//   shiftTitle: { marginBottom: 10, fontSize: 18, fontWeight: 700 },

//   table: { width: "100%", borderCollapse: "collapse", background: "#fff" },
//   th: { padding: 10, borderBottom: "2px solid #ddd", textAlign: "left", fontSize: 13 },
//   td: { padding: 10, borderBottom: "1px solid #eee", fontSize: 13 },
//   row: { cursor: "pointer" },

//   activityBox: { marginTop: 30, padding: 16, borderRadius: 12, background: "#f8fbff" },
//   activityTitle: { fontSize: 18, color: "#1e73be", marginBottom: 8 },
//   activityList: { lineHeight: 1.8, paddingLeft: 10, fontSize: 13 },
// };


















//------------------------------1-----------------------
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAllVip, getAllGuard } from "../api/vipform";
// import { useGuardStore } from "../context/GuardContext";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

// export default function GuardDashboard() {
//   const navigate = useNavigate();
//   const { selectedGuard, setSelectedGuard } = useGuardStore();

//   const [guardName, setGuardName] = useState("GUARD");
//   const [vipList, setVipList] = useState([]);
//   const [guardList, setGuardList] = useState([]);
//   const { fetchGuardProfile } = useGuardStore();


//   /* ------------------------------------------------
//        1️⃣ INSTANT SYNC FROM CONTEXT (NO DELAY)
//   -------------------------------------------------- */
//   useEffect(() => {
//     if (selectedGuard?.name) {
//       setGuardName(selectedGuard.name);
//     }
//   }, [selectedGuard]);

//   useEffect(() => {
//     fetchGuardProfile();
//   }, []);

//   /* ------------------------------------------------
//        2️⃣ FALLBACK SYNC (REFRESH / DIRECT URL)
//   -------------------------------------------------- */
//   useEffect(() => {
//     const syncGuardProfile = async () => {
//       try {
//         //  Already available → no need to fetch
//         if (selectedGuard?.name) return;

//         //  Try localStorage
//         const stored = localStorage.getItem("selectedGuard");
//         if (stored) {
//           const parsed = JSON.parse(stored);
//           setSelectedGuard(parsed);
//           setGuardName(parsed.name);
//           return;
//         }

//         //  Last Fallback → Token + API
//         const token = localStorage.getItem("guardToken");
//         if (!token) return;

//         const decoded = jwtDecode(token);
//         const username = decoded.username || decoded.sub || decoded.email;

//         const res = await axios.get(`${BASE_URL}/api/officer/profile`, {
//           params: { username },
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const profile = Array.isArray(res.data) ? res.data[0] : res.data;

//         setSelectedGuard(profile);
//         setGuardName(profile.name);
//         localStorage.setItem("selectedGuard", JSON.stringify(profile));
//       } catch (err) {
//         console.log("Guard Sync Error:", err);
//       }
//     };

//     syncGuardProfile();
//   }, []); //  Run once only on mount

//   /* ---------------------------------------
//         LOAD VIP LIST
//   ----------------------------------------- */
//   const loadVip = async () => {
//     try {
//       const data = await getAllVip();
//       setVipList(Array.isArray(data) ? data : data?.data || []);
//     } catch {
//       setVipList([]);
//     }
//   };

//   /* ---------------------------------------
//         LOAD GUARD LIST
//   ----------------------------------------- */
//   const loadGuards = async () => {
//     try {
//       const data = await getAllGuard();
//       setGuardList(Array.isArray(data) ? data : data?.data || []);
//     } catch {
//       setGuardList([]);
//     }
//   };

//   useEffect(() => {
//     loadVip();
//     loadGuards();
//   }, []);

//   /* ---------------------------------------
//             LOGOUT
//   ----------------------------------------- */
//   const handleLogout = () => {
//     localStorage.clear();
//     sessionStorage.clear();
//     navigate("/login");
//   };

//   /* ---------------------------------------
//             STATS
//   ----------------------------------------- */
//   const stats = [

//     {
//       title: "Total Assignments Assigned",
//       value: "1",
//       icon: "fas fa-file",
//       color: "#1e73be",
//     },

//     // {
//     //   title: "Total Assignments Active",
//     //   value: "1",
//     //   icon: "fas fa-tasks",
//     //   color: "#3cb371",
//     // },
//     {
//       title: "Total Incidents Inactive",
//       value: "0",
//       icon: "fas fa-exclamation-triangle",
//       color: "#ffa500",
//     },
//   ];

//   /* ---------------------------------------
//               UI (UNCHANGED)
//   ----------------------------------------- */
//   return (
//     <div style={styles.page}>
//       <div style={styles.headerSection}>
//         <div>
//           <h2 style={styles.pageTitle}>Guard DASHBOARD</h2>
//           <p style={styles.desc}>Manage VIPs, Guards & Combined User Count.</p>
//         </div>

//         <button style={styles.logoutBtn} onClick={handleLogout}>
//           <i className="fas fa-sign-out-alt" style={{ marginRight: 8 }}></i>
//           Logout
//         </button>
//       </div>

//       <div style={styles.mainContent}>
//         <div style={styles.welcomeBox}>
//           <h2 style={styles.welcomeText}>
//             Welcome {guardName} 👋
//           </h2>
//         </div>

//         <div style={styles.statsGrid}>
//           {stats.map((stat, index) => (
//             <div key={index} style={styles.statCard}>
//               <div style={{ ...styles.iconCircle, background: stat.color }}>
//                 <i className={stat.icon} style={styles.icon}></i>
//               </div>
//               <h3 style={styles.statValue}>{stat.value}</h3>
//               <p style={styles.statTitle}>{stat.title}</p>
//             </div>
//           ))}
//         </div>

//         <div style={styles.activityBox}>
//           <h3 style={styles.activityTitle}>Recent Activity</h3>
//           <ul style={styles.activityList}>
//             <li>✔ VIP & Guards list updated</li>
//             <li>✔ Dashboard loaded successfully</li>
//             <li>✔ System running smoothly</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ---------------------------------------
//               STYLES (UNCHANGED)
// ----------------------------------------- */
// const styles = {
//   page: { padding: 25 },

//   headerSection: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },

//   pageTitle: { fontSize: 30, fontWeight: 700, color: "#1e73be" },

//   desc: { fontSize: 15, opacity: 0.6 },

//   logoutBtn: {
//     background: "#888",
//     padding: "10px 20px",
//     borderRadius: 8,
//     color: "#fff",
//     border: "none",
//     cursor: "pointer",
//     fontWeight: 600,
//     display: "flex",
//     alignItems: "center",
//   },

//   mainContent: {
//     background: "#fff",
//     padding: 25,
//     borderRadius: 12,
//     boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
//   },

//   welcomeBox: { marginBottom: 25 },

//   welcomeText: {
//     fontSize: 26,
//     fontWeight: 700,
//     color: "#1e73be",
//     marginBottom: 20,
//   },

//   statsGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
//     gap: 25,
//     marginTop: 20,
//   },

//   statCard: {
//     background: "white",
//     borderRadius: 12,
//     padding: 25,
//     textAlign: "center",
//     boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
//   },

//   iconCircle: {
//     width: 55,
//     height: 55,
//     borderRadius: "50%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     margin: "0 auto 15px",
//   },

//   icon: { fontSize: 22, color: "white" },

//   statValue: { fontSize: 28, fontWeight: 700, color: "#333" },

//   statTitle: { opacity: 0.6 },

//   activityBox: {
//     marginTop: "17%",
//     padding: 20,
//     borderRadius: 12,
//     background: "#f8fbff",
//     border: "1px solid #e5e9f0",
//   },

//   activityTitle: {
//     fontSize: 20,
//     color: "#1e73be",
//     marginBottom: 10,
//   },

//   activityList: { lineHeight: 2, paddingLeft: 10 },
// };
