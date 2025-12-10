// import React from "react";
// import { NavLink } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { logoutUser } from "../api/auth";

// export default function GuardSidebar() {
//   const navigate = useNavigate();
//   //  Handle Logout
//   const handleLogout = () => {
//     localStorage.clear();
//     sessionStorage.clear();
//     navigate("/login");
//   };
//   return (
//     <div style={styles.sidebarContainer} className="sidebar">

//       {/* LOGO SECTION */}
//       <div style={styles.logoBox}>
//         <NavLink to="/guarddashboard" style={styles.logoLink}>
//           <span style={styles.logoText}>Guard Panel</span>
//         </NavLink>
//       </div>

//       {/* MENU LIST */}
//       <div style={styles.menuWrapper}>
//         <ul style={styles.menuList}>

//           {/* Dashboard */}
//           <li style={styles.menuItem}>
//             <NavLink
//               to="/guarddashboard"
//               style={styles.menuLink}
//               className={({ isActive }) =>
//                 `menu-link ${isActive ? "active-menu" : ""}`
//               }
//             >
//               <i className="fas fa-home" style={styles.icon}></i>
//               <span>Dashboard</span>
//             </NavLink>
//           </li>

//           {/* Section Title */}
//           {/* <li style={styles.sectionTitle}>Manage Forms</li> */}

//           {/* Guard Dashboard */}
//           {/* <li style={styles.menuItem}>
//             <NavLink
//               to="/guardform"
//               style={styles.menuLink}
//               className="menu-link"
//             >
//               <i className="fas fa-file-alt" style={styles.icon}></i>
//               <span>Guard Registration</span>
//             </NavLink>
//           </li>
//              */}
//           <li style={styles.sectionTitle}>Manage</li>
//           <li style={styles.menuItem}>
//             <NavLink
//               to="/guardshift"
//               style={styles.menuLink}
//               className="menu-link"
//             >
//               <i className="fas fa-briefcase" style={styles.icon}></i>
//               <span>My Shift</span>
//             </NavLink>
//           </li>
          
//           <li style={styles.menuItem}>
//             <NavLink
//               to="/guardhistory"
//               style={styles.menuLink}
//               className="menu-link"
//             >
//               <i className="fas fa-history" style={styles.icon}></i>
//               <span>Duty History</span>
//             </NavLink>
//           </li>

//           <li style={styles.menuItem}>
//             <NavLink
//               to="/guardNotification"
//               style={styles.menuLink}
//               className="menu-link"
//             >
//               <i className="fas fa-bell" style={styles.icon}></i>
//               <span>Notifications</span>
//             </NavLink>
//           </li>
//           <li style={styles.menuItem}>
//             <NavLink
//               to="/guardIncident"
//               style={styles.menuLink}
//               className="menu-link"
//             >
//               <i className="fas fa-exclamation-triangle" style={styles.icon}></i>
//               <span>Incidents</span>
//             </NavLink>
//           </li>

//           <li style={styles.menuItem}>
//             <NavLink
//               to="/guardIncidentHistory"
//               style={styles.menuLink}
//               className="menu-link"
//             >
//               <i className="fas fa-clipboard-list" style={styles.icon}></i>
//               <span>Incidents History</span>
//             </NavLink>
//           </li>

//           {/* <li style={styles.menuItem}>
//             <NavLink
//               to="/guardsrequest"
//               style={styles.menuLink}
//               className="menu-link"
//             >
//               <i className="fas fa-file-alt" style={styles.icon}></i>
//               <span>Leave Request</span>
//             </NavLink>
//           </li>

//           <li style={styles.menuItem}>
//             <NavLink
//               to="/guardshistory"
//               style={styles.menuLink}
//               className="menu-link"
//             >
//               <i className="fas fa-file-alt" style={styles.icon}></i>
//               <span>Duty History</span>
//             </NavLink>
//           </li>

//           <li style={styles.menuItem}>
//             <NavLink
//               to="/guardsinsident"
//               style={styles.menuLink}
//               className="menu-link"
//             >
//               <i className="fas fa-file-alt" style={styles.icon}></i>
//               <span>Incidents</span>
//             </NavLink>
//           </li> */}




//           <li style={styles.menuItem}>
//             <NavLink
//               to="/guardprofile"
//               style={styles.menuLink}
//               className="menu-link"
//             >
//               <i className="fas fa-user" style={styles.icon}></i>
//               <span>My Profile</span>
//             </NavLink>
//           </li>
//           <li>
//             <button to="/login" className="menu-link" style={{ ...styles.menuLink, outline: "none", border: "none" }} onClick={handleLogout}>
//               <i className="fas fa-sign-out-alt" style={styles.icon}></i>
//               <span>Logout</span>
//             </button>

//           </li>


//         </ul>
//       </div>
//     </div>
//   );
// }

// /* ------------------------------------------------------------------
//                      SIDEBAR STYLES
// ------------------------------------------------------------------ */

// const styles = {

//   sidebarContainer: {
//     width: "260px",
//     height: "100vh",
//     background: "rgba(255, 255, 255, 0.28)",
//     backdropFilter: "blur(10px)",
//     WebkitBackdropFilter: "blur(10px)",
//     borderRight: "1px solid rgba(255,255,255,0.3)",
//     boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
//     paddingTop: "20px",
//     position: "fixed",
//     top: 0,
//     left: 0,
//     overflowY: "auto",
//   },

//   logoBox: {
//     textAlign: "center",
//     marginBottom: "35px",
//     padding: "18px 0",
//     background: "linear-gradient(135deg, #4e54c8, #8f94fb)",
//     borderRadius: "14px",
//     width: "85%",
//     marginLeft: "auto",
//     marginRight: "auto",
//     boxShadow: "0 6px 25px rgba(0,0,0,0.2)",
//   },

//   logoLink: {
//     textDecoration: "none",
//   },

//   logoText: {
//     fontSize: "26px",
//     fontWeight: "700",
//     color: "#fff",
//     letterSpacing: "1px",
//     fontFamily: "Poppins, sans-serif",
//     textShadow: "0 2px 4px rgba(0,0,0,0.3)",
//   },

//   menuWrapper: {
//     padding: "0 20px",
//   },

//   menuList: {
//     listStyle: "none",
//     padding: 0,
//     margin: 0,
//   },

//   menuItem: {
//     marginBottom: "10px",
//   },

//   menuLink: {
//     width: "100%",
//     background: "transparent",
//     display: "flex",
//     alignItems: "center",
//     gap: "12px",
//     padding: "12px 15px",
//     borderRadius: "10px",
//     textDecoration: "none",
//     fontSize: "15px",
//     fontWeight: "600",
//     color: "#1e1e1e",
//     transition: "0.3s",
//     position: "relative",
//     overflow: "hidden",
//   },

//   icon: {
//     fontSize: "18px",
//     color: "#1e73be",
//   },

//   sectionTitle: {
//     fontSize: "13px",
//     fontWeight: "700",
//     color: "#1e73be",
//     margin: "20px 0 10px 10px",
//     textTransform: "uppercase",
//     opacity: 0.8,
//   },
// };


import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useGuardStore } from "../context/GuardContext";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function GuardSidebar() {
  const navigate = useNavigate();
  const { selectedGuard } = useGuardStore();
  const guardId = selectedGuard?._id || selectedGuard?.id;

  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    if (!guardId) return;

    try {
      const token = localStorage.getItem("guardToken");

      const res = await axios.get(
        `${BASE_URL}/api/notification/guard/${guardId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const unread = Array.isArray(res.data)
        ? res.data.filter((n) => !n.read).length
        : 0;

      setUnreadCount(unread);
    } catch (err) {
      console.error("Sidebar count error:", err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 5000);
    return () => clearInterval(interval);
  }, [guardId]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/*  NO ANIMATION — ONLY LEFT → RIGHT COLOR FILL ON HOVER */}
      <style>
        {`
          .menu-link {
            background: linear-gradient(
              to right,
              rgba(173, 216, 230, 0.4) 50%,
              transparent 50%
            );
            background-size: 200% 100%;
            background-position: right bottom;
            transition: background-position 0.3s ease;
          }

          .menu-link:hover {
            background-position: left bottom;
            color: #1e73be;
          }
        `}
      </style>

      <div style={styles.sidebarContainer} className="sidebar">
        <div style={styles.logoBox}>
          <NavLink to="/guarddashboard" style={styles.logoLink}>
            <span style={styles.logoText}>Guard Panel</span>
          </NavLink>
        </div>

        <div style={styles.menuWrapper}>
          <ul style={styles.menuList}>

            <li style={styles.menuItem}>
              <NavLink to="/guarddashboard" style={styles.menuLink} className="menu-link mt-3">
                <i className="fas fa-home" style={styles.icon}></i>
                <span>Dashboard</span>
              </NavLink>
            </li>

            <li style={styles.sectionTitle}>Manage</li>

            <li style={styles.menuItem}>
              <NavLink to="/guardshift" style={styles.menuLink} className="menu-link">
                <i className="fas fa-briefcase" style={styles.icon}></i>
                <span>My Shift</span>
              </NavLink>
            </li>

            <li style={styles.menuItem}>
              <NavLink to="/guardhistory" style={styles.menuLink} className="menu-link">
                <i className="fas fa-history" style={styles.icon}></i>
                <span>Duty History</span>
              </NavLink>
            </li>

            <li style={styles.menuItem}>
              <NavLink to="/guardNotification" style={styles.menuLink} className="menu-link">
                <div style={{ position: "relative" }}>
                  <i className="fas fa-bell" style={styles.icon}></i>
                  {unreadCount > 0 && (
                    <span style={styles.badge}>{unreadCount}</span>
                  )}
                </div>
                <span>Notifications</span>
              </NavLink>
            </li>

            <li style={styles.menuItem}>
              <NavLink to="/guardIncident" style={styles.menuLink} className="menu-link">
                <i className="fas fa-exclamation-triangle" style={styles.icon}></i>
                <span>Incidents</span>
              </NavLink>
            </li>

            <li style={styles.menuItem}>
              <NavLink to="/guardIncidentHistory" style={styles.menuLink} className="menu-link">
                <i className="fas fa-clipboard-list" style={styles.icon}></i>
                <span>Incidents History</span>
              </NavLink>
            </li>

            <li style={styles.menuItem}>
              <NavLink to="/guardprofile" style={styles.menuLink} className="menu-link">
                <i className="fas fa-user" style={styles.icon}></i>
                <span>My Profile</span>
              </NavLink>
            </li>

            <li>
              <button
                className="menu-link"
                style={{ ...styles.menuLink, border: "none", background: "none" }}
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt" style={styles.icon}></i>
                <span>Logout</span>
              </button>
            </li>

          </ul>
        </div>
      </div>
    </>
  );
}

/*  ORIGINAL STYLES — UNCHANGED */
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
    top: 0,
    left: 0,
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

  logoText: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#fff",
  },

  menuWrapper: { padding: "0 20px" },
  menuList: { listStyle: "none", padding: 0, margin: 0 },
  menuItem: { marginBottom: "10px" },

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

  icon: { fontSize: "18px", color: "#1e73be" },

  sectionTitle: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#1e73be",
    margin: "20px 0 10px 10px",
    textTransform: "uppercase",
  },

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
