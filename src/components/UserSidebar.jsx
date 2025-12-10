
// import React, { useState } from "react";
// import { NavLink, useNavigate } from "react-router-dom";

// export default function UserSidebar() {
//   const navigate = useNavigate();

//   const [open, setOpen] = useState({
//     tables: false,
//     duty: false,
//     history: false,
//   });

//   const toggle = (key) =>
//     setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

//   const handleLogout = () => {
//     localStorage.clear();
//     sessionStorage.clear();
//     navigate("/login");
//   };

//   return (
//     <div style={styles.sidebarContainer} className="sidebar">

//       {/* ===== SAME HOVER + DROPDOWN CSS ===== */}
//       <style>
//         {`
//           .menu-link {
//             background: linear-gradient(to right, #e8f2ff 50%, transparent 50%);
//             background-size: 200% 100%;
//             background-position: right bottom;
//             transition: all 0.4s ease;
//           }

//           .menu-link:hover {
//             background-position: left bottom;
//             color: #1e73be !important;
//           }

//           .menu-link:hover i {
//             color: #1e73be !important;
//           }

//           .dropdown-tables:hover {
//             border-left: 4px solid #20b2aa;
//             background: rgba(32, 178, 170, 0.08);
//           }

//           .dropdown-duty:hover {
//             border-left: 4px solid #ff8c00;
//             background: rgba(255, 140, 0, 0.08);
//           }

//           .dropdown-history:hover {
//             border-left: 4px solid #28f68bff;
//             background: rgba(40, 246, 139, 0.08);
//           }
//         `}
//       </style>

//       {/* LOGO */}
//       <div style={styles.logoBox}>
//         <NavLink to="/userdashboard" style={styles.logoLink}>
//           <span style={styles.logoText}>Manager Panel</span>
//         </NavLink>
//       </div>

//       <div style={styles.menuWrapper}>
//         <ul style={styles.menuList}>

//           {/* Dashboard */}
//           <li style={styles.menuItem}>
//             <NavLink to="/userdashboard" style={styles.menuLink} className="menu-link">
//               <i className="fas fa-home" style={styles.icon}></i>
//               <span>Dashboard</span>
//             </NavLink>
//           </li>

//           {/* Notifications */}
//           <li style={styles.sectionTitle}>Notifications</li>
//           <li style={styles.menuItem}>
//             <NavLink to="/notify" style={styles.menuLink} className="menu-link">
//               <i className="fas fa-bell" style={styles.icon}></i>
//               <span>Notifications</span>
//             </NavLink>
//           </li>

//           {/* ================= TABLES ================= */}
//           <li
//             style={styles.sectionTitleTables}
//             className="dropdown-tables"
//             onClick={() => toggle("tables")}
//           >
//             Tables
//             <i className={`fas fa-chevron-${open.tables ? "up" : "down"}`} style={styles.arrowTables}></i>
//           </li>

//           {open.tables && (
//             <>
//               <li style={styles.menuItem}>
//                 <NavLink to="/viplist" style={styles.menuLink} className="menu-link">
//                   <i className="fas fa-table" style={styles.icon}></i>
//                   <span>VIP Table</span>
//                 </NavLink>
//               </li>

//               <li style={styles.menuItem}>
//                 <NavLink to="/guardlist" style={styles.menuLink} className="menu-link">
//                   <i className="fas fa-table" style={styles.icon}></i>
//                   <span>Guard Table</span>
//                 </NavLink>
//               </li>

//               <li style={styles.menuItem}>
//                 <NavLink to="/updatehistory" style={styles.menuLink} className="menu-link">
//                   <i className="fas fa-table" style={styles.icon}></i>
//                   <span>Update Table</span>
//                 </NavLink>
//               </li>
//             </>
//           )}

//           {/* ================= DUTY MANAGEMENT ================= */}
//           <li
//             style={styles.sectionTitleDuty}
//             className="dropdown-duty"
//             onClick={() => toggle("duty")}
//           >
//             Duty Management
//             <i className={`fas fa-chevron-${open.duty ? "up" : "down"}`} style={styles.arrowDuty}></i>
//           </li>

//           {open.duty && (
//             <>
//               {/*  MOVED HERE AS YOU ASKED */}
//               <li style={styles.menuItem}>
//                 <NavLink to="/vgmang" style={styles.menuLink} className="menu-link">
//                   <i className="fas fa-users-cog" style={styles.icon}></i>
//                   <span>Vip-Guard-Management</span>
//                 </NavLink>
//               </li>

//               <li style={styles.menuItem}>
//                 <NavLink to="/adminrequestaccept" style={styles.menuLink} className="menu-link">
//                   <i className="fas fa-check-circle" style={styles.icon}></i>
//                   <span>Duty Accept/Reject</span>
//                 </NavLink>
//               </li>

//               <li style={styles.menuItem}>
//                 <NavLink to="/incidents" style={styles.menuLink} className="menu-link">
//                   <i className="fas fa-exclamation-triangle" style={styles.icon}></i>
//                   <span>Incidents</span>
//                 </NavLink>
//               </li>
//             </>
//           )}

//           {/* ================= HISTORY ================= */}
//           <li
//             style={styles.sectionTitleHistory}
//             className="dropdown-history"
//             onClick={() => toggle("history")}
//           >
//             History
//             <i className={`fas fa-chevron-${open.history ? "up" : "down"}`} style={styles.arrowHistory}></i>
//           </li>

//           {open.history && (
//             <li style={styles.menuItem}>
//               <NavLink to="/dutyhistory" style={styles.menuLink} className="menu-link">
//                 <i className="fas fa-history" style={styles.icon}></i>
//                 <span>Guard Duty History</span>
//               </NavLink>
//             </li>
//           )}

//           {/* ================= OTHERS ================= */}
//           <li style={styles.sectionTitle}>Others</li>

//           {/*  MOVED HERE */}
//           <li style={styles.menuItem}>
//             <NavLink to="/userprofile" style={styles.menuLink} className="menu-link">
//               <i className="fas fa-user" style={styles.icon}></i>
//               <span>My Profile</span>
//             </NavLink>
//           </li>

//           <li style={styles.menuItem}>
//             <NavLink to="/login" onClick={handleLogout} style={styles.menuLink} className="menu-link">
//               <i className="fas fa-sign-out-alt" style={styles.icon}></i>
//               <span>Logout</span>
//             </NavLink>
//           </li>

//         </ul>
//       </div>
//     </div>
//   );
// }

// /* ================= STYLES ================= */

// const styles = {
//   sidebarContainer: {
//     width: "260px",
//     height: "100vh",
//     background: "rgba(255, 255, 255, 0.28)",
//     backdropFilter: "blur(10px)",
//     borderRight: "1px solid rgba(255,255,255,0.3)",
//     boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
//     paddingTop: "20px",
//     position: "fixed",
//     overflowY: "auto",
//   },

//   logoBox: {
//     textAlign: "center",
//     marginBottom: "35px",
//     padding: "18px 0",
//     background: "linear-gradient(135deg, #4e54c8, #8f94fb)",
//     borderRadius: "14px",
//     width: "85%",
//     margin: "auto",
//   },

//   logoLink: { textDecoration: "none" },
//   logoText: { fontSize: "26px", fontWeight: "700", color: "#fff" },

//   menuWrapper: { padding: "0 10px" },
//   menuList: { listStyle: "none", padding: 0 },
//   menuItem: { marginBottom: "8px" },

//   menuLink: {
//     display: "flex",
//     alignItems: "center",
//     gap: "12px",
//     padding: "12px 15px",
//     borderRadius: "10px",
//     textDecoration: "none",
//     fontSize: "15px",
//     fontWeight: "600",
//     color: "#1e1e1e",
//   },

//   icon: { fontSize: "16px", color: "#1e73be" },

//   sectionTitle: {
//     fontSize: "13px",
//     fontWeight: "700",
//     color: "#1e73be",
//     margin: "20px 0 10px 10px",
//     textTransform: "uppercase",
//   },

//   sectionTitleTables: { color: "#20b2aa", margin: "20px 10px 10px", cursor: "pointer" },
//   sectionTitleDuty: { color: "#ff8c00", margin: "20px 10px 10px", cursor: "pointer" },
//   sectionTitleHistory: { color: "#28f68b", margin: "20px 10px 10px", cursor: "pointer" },

//   arrowTables: { marginLeft: "8px", color: "#20b2aa" },
//   arrowDuty: { marginLeft: "8px", color: "#ff8c00" },
//   arrowHistory: { marginLeft: "8px", color: "#28f68b" },
// };


import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function UserSidebar() {
  const navigate = useNavigate();

  const [open, setOpen] = useState({
    tables: false,
    duty: false,
    history: false,
  });

  const toggle = (key) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  /*  LIVE UNREAD COUNT STATE */
  const [unreadCount, setUnreadCount] = useState(0);

  /*  ROLE BASED TOKEN */
  const role = localStorage.getItem("role");
  const token =
    role === "admin"
      ? localStorage.getItem("adminToken")
      : localStorage.getItem("userToken");

  /*  ONLY COUNT FETCH */
  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/notification/all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const unread = Array.isArray(res.data)
        ? res.data.filter((n) => !n.notificationStatus).length
        : 0;

      setUnreadCount(unread);
    } catch (err) {
      console.error("Sidebar count error:", err);
    }
  };

  /*  AUTO REFRESH COUNT */
  useEffect(() => {
    fetchUnreadCount();

    const interval = setInterval(fetchUnreadCount, 5000);
    return () => clearInterval(interval);
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div style={styles.sidebarContainer} className="sidebar">

      {/* ===== SAME HOVER + DROPDOWN CSS ===== */}
      <style>
        {`
          .menu-link {
            background: linear-gradient(to right, #e8f2ff 50%, transparent 50%);
            background-size: 200% 100%;
            background-position: right bottom;
            transition: all 0.4s ease;
          }

          .menu-link:hover {
            background-position: left bottom;
            color: #1e73be !important;
          }

          .menu-link:hover i {
            color: #1e73be !important;
          }

          .dropdown-tables:hover {
            border-left: 4px solid #20b2aa;
            background: rgba(32, 178, 170, 0.08);
          }

          .dropdown-duty:hover {
            border-left: 4px solid #ff8c00;
            background: rgba(255, 140, 0, 0.08);
          }

          .dropdown-history:hover {
            border-left: 4px solid #28f68bff;
            background: rgba(40, 246, 139, 0.08);
          }
        `}
      </style>

      {/* LOGO */}
      <div style={styles.logoBox}>
        <NavLink to="/userdashboard" style={styles.logoLink}>
          <span style={styles.logoText}>Manager Panel</span>
        </NavLink>
      </div>

      <div style={styles.menuWrapper}>
        <ul style={styles.menuList}>

          {/* Dashboard */}
          <li style={styles.menuItem}>
            <NavLink to="/userdashboard" style={styles.menuLink} className="menu-link mt-3">
              <i className="fas fa-home" style={styles.icon}></i>
              <span>Dashboard</span>
            </NavLink>
          </li>

          {/*  Notifications WITH COUNT */}
          <li style={styles.sectionTitle}>Notifications</li>
          <li style={styles.menuItem}>
            <NavLink to="/notify" style={styles.menuLink} className="menu-link">
              <div style={{ position: "relative" }}>
                <i className="fas fa-bell" style={styles.icon}></i>

                {unreadCount > 0 && (
                  <span style={styles.badge}>{unreadCount}</span>
                )}
              </div>
              <span>Notifications</span>
            </NavLink>
          </li>

          {/* ================= TABLES ================= */}
          <li
            style={styles.sectionTitleTables}
            className="dropdown-tables"
            onClick={() => toggle("tables")}
          >
            Tables
            <i className={`fas fa-chevron-${open.tables ? "up" : "down"}`} style={styles.arrowTables}></i>
          </li>

          {open.tables && (
            <>
              <li style={styles.menuItem}>
                <NavLink to="/viplist" style={styles.menuLink} className="menu-link">
                  <i className="fas fa-table" style={styles.icon}></i>
                  <span>VIP Table</span>
                </NavLink>
              </li>

              <li style={styles.menuItem}>
                <NavLink to="/guardlist" style={styles.menuLink} className="menu-link">
                  <i className="fas fa-table" style={styles.icon}></i>
                  <span>Guard Table</span>
                </NavLink>
              </li>

              <li style={styles.menuItem}>
                <NavLink to="/updatehistory" style={styles.menuLink} className="menu-link">
                  <i className="fas fa-table" style={styles.icon}></i>
                  <span>Update Table</span>
                </NavLink>
              </li>
            </>
          )}

          {/* ================= DUTY MANAGEMENT ================= */}
          <li
            style={styles.sectionTitleDuty}
            className="dropdown-duty"
            onClick={() => toggle("duty")}
          >
            Duty Management
            <i className={`fas fa-chevron-${open.duty ? "up" : "down"}`} style={styles.arrowDuty}></i>
          </li>

          {open.duty && (
            <>
              <li style={styles.menuItem}>
                <NavLink to="/vgmang" style={styles.menuLink} className="menu-link">
                  <i className="fas fa-users-cog" style={styles.icon}></i>
                  <span>Vip-Guard-Management</span>
                </NavLink>
              </li>

              <li style={styles.menuItem}>
                <NavLink to="/adminrequestaccept" style={styles.menuLink} className="menu-link">
                  <i className="fas fa-check-circle" style={styles.icon}></i>
                  <span>Duty Accept/Reject</span>
                </NavLink>
              </li>

              <li style={styles.menuItem}>
                <NavLink to="/incidents" style={styles.menuLink} className="menu-link">
                  <i className="fas fa-exclamation-triangle" style={styles.icon}></i>
                  <span>Incidents</span>
                </NavLink>
              </li>
            </>
          )}

          {/* ================= HISTORY ================= */}
          <li
            style={styles.sectionTitleHistory}
            className="dropdown-history"
            onClick={() => toggle("history")}
          >
            History
            <i className={`fas fa-chevron-${open.history ? "up" : "down"}`} style={styles.arrowHistory}></i>
          </li>

          {open.history && (
            <li style={styles.menuItem}>
              <NavLink to="/dutyhistory" style={styles.menuLink} className="menu-link">
                <i className="fas fa-history" style={styles.icon}></i>
                <span>Guard Duty History</span>
              </NavLink>
            </li>
          )}

          {/* ================= OTHERS ================= */}
          <li style={styles.sectionTitle}>Others</li>

          <li style={styles.menuItem}>
            <NavLink to="/userprofile" style={styles.menuLink} className="menu-link">
              <i className="fas fa-user" style={styles.icon}></i>
              <span>My Profile</span>
            </NavLink>
          </li>

          <li style={styles.menuItem}>
            <NavLink to="/login" onClick={handleLogout} style={styles.menuLink} className="menu-link">
              <i className="fas fa-sign-out-alt" style={styles.icon}></i>
              <span>Logout</span>
            </NavLink>
          </li>

        </ul>
      </div>
    </div>
  );
}

/*  SAME STYLES + ONLY BADGE ADDED */
const styles = {
  sidebarContainer: {
    width: "260px",
    height: "100vh",
    background: "rgba(255, 255, 255, 0.28)",
    backdropFilter: "blur(10px)",
    borderRight: "1px solid rgba(255,255,255,0.3)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    paddingTop: "20px",
    position: "fixed",
    overflowY: "auto",
  },

  logoBox: {
    textAlign: "center",
    marginBottom: "35px",
    padding: "18px 0",
    background: "linear-gradient(135deg, #4e54c8, #8f94fb)",
    borderRadius: "14px",
    width: "85%",
    margin: "auto",
  },

  logoLink: { textDecoration: "none" },
  logoText: { fontSize: "26px", fontWeight: "700", color: "#fff" },

  menuWrapper: { padding: "0 10px" },
  menuList: { listStyle: "none", padding: 0 },
  menuItem: { marginBottom: "8px" },

  menuLink: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 15px",
    borderRadius: "10px",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "600",
    color: "#1e1e1e",
  },

  icon: { fontSize: "16px", color: "#1e73be" },

  sectionTitle: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#1e73be",
    margin: "20px 0 10px 10px",
    textTransform: "uppercase",
  },

  sectionTitleTables: { color: "#20b2aa", margin: "20px 10px 10px", cursor: "pointer" },
  sectionTitleDuty: { color: "#ff8c00", margin: "20px 10px 10px", cursor: "pointer" },
  sectionTitleHistory: { color: "#28f68b", margin: "20px 10px 10px", cursor: "pointer" },

  arrowTables: { marginLeft: "8px", color: "#20b2aa" },
  arrowDuty: { marginLeft: "8px", color: "#ff8c00" },
  arrowHistory: { marginLeft: "8px", color: "#28f68b" },

  /*  ONLY NEW STYLE */
  badge: {
    position: "absolute",
    top: "-6px",
    right: "-10px",
    background: "red",
    color: "#fff",
    borderRadius: "50%",
    fontSize: "11px",
    padding: "2px 7px",
    fontWeight: "700",
  },
};
