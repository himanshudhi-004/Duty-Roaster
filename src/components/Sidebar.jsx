import React from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth";

export default function Sidebar() {
  const navigate = useNavigate();
  //  Handle Logout
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };
  return (

    <div style={styles.sidebarContainer} className="sidebar">

      {/* LOGO SECTION */}
      <div style={styles.logoBox}>
        <NavLink to="/admindashboard" style={styles.logoLink}>
          <span style={styles.logoText}>Admin Panel</span>
        </NavLink>
      </div>

      {/* MENU LIST */}
      <div style={styles.menuWrapper}>
        <ul style={styles.menuList}>

          {/* Dashboard */}
          <li style={styles.menuItem}>
            <NavLink
              to="/admindashboard"
              style={styles.menuLink}
              className={({ isActive }) =>
                `menu-link ${isActive ? "active-menu" : ""}`
              }
            >
              <i className="fas fa-home" style={styles.icon}></i>
              <span>Dashboard</span>
            </NavLink>
          </li>

          <li style={styles.sectionTitle}>Notifications</li>

          <li style={styles.menuItem}>
            <NavLink
              to="/notify"
              style={styles.menuLink}
              className="menu-link"
            >
              <i className="fas fa-bell" style={styles.icon}></i>
              <span>Notifications</span>
            </NavLink>
          </li>
          {/* Section */}
          <li style={styles.sectionTitle}>Manage Forms</li>

          {/* <li style={styles.menuItem}>
            <NavLink
              to="/userform"
              style={styles.menuLink}
              className="menu-link"
            >
              <i className="fas fa-pen-square" style={styles.icon}></i>
              <span>User Registration Form</span>
            </NavLink>
          </li> */}

          <li style={styles.menuItem}>
            <NavLink
              to="/vipform"
              style={styles.menuLink}
              className="menu-link"
            >
              <i className="fas fa-pen-square" style={styles.icon}></i>
              <span>VIP Registration Form</span>
            </NavLink>
          </li>

          <li style={styles.menuItem}>
            <NavLink
              to="/guardform"
              style={styles.menuLink}
              className="menu-link"
            >
              <i className="fas fa-pen-square" style={styles.icon}></i>
              <span>Guard Registration Form</span>
            </NavLink>
          </li>



          {/* Table Section */}
          <li style={styles.sectionTitle}>Tables</li>

          <li style={styles.menuItem}>
            <NavLink
              to="/viplist"
              style={styles.menuLink}
              className="menu-link"
            >
              <i className="fas fa-table" style={styles.icon}></i>
              <span>VIP Table</span>
            </NavLink>
          </li>

          <li style={styles.menuItem}>
            <NavLink
              to="/guardlist"
              style={styles.menuLink}
              className="menu-link"
            >
              <i className="fas fa-table" style={styles.icon}></i>
              <span>Guard Table</span>
            </NavLink>
          </li>
          <li style={styles.sectionTitle}>Others</li>
          {/* Management */}
          {/* <li style={styles.menuItem}>
            <NavLink
              to="/vgmang"
              style={styles.menuLink}
              className="menu-link"
            >
              <i className="fas fa-users-cog" style={styles.icon}></i>
              <span>Vip-Guard-Management</span>
            </NavLink>
          </li> */}
          {/* <li style={styles.menuItem}>
            <NavLink
              to="/markduty"
              style={styles.menuLink}
              className="menu-link"
            >
              <i className="fas fa-file" style={styles.icon}></i>
              <span>Duty-Management</span>
            </NavLink>
          </li> */}
          <li style={styles.menuItem}>
            <NavLink
              to="/updatehistory"
              style={styles.menuLink}
              className="menu-link"
            >
              <i className="fas fa-history" style={styles.icon}></i>
              <span>Updation History</span>
            </NavLink>
          </li>
          <li style={styles.menuItem}>
            <NavLink
              to="/dutyhistory"
              style={styles.menuLink}
              className="menu-link"
            >
              <i className="fas fa-history" style={styles.icon}></i>
              <span>Guard-Duty-History</span>
            </NavLink>
          </li>
          <li style={styles.menuItem}>
            <NavLink
              to="/incidents"
              style={styles.menuLink}
              className="menu-link"
            >
              <i className="fas fa-exclamation-triangle" style={styles.icon}></i>
              <span>Incidents</span>
            </NavLink>
          </li>

          {/*
          <li style={styles.menuItem}>
            <NavLink
              to="/guardlist"
              style={styles.menuLink}
              className="menu-link"
            >
              <i className="fas fa-bell" style={styles.icon}></i>
              <span>Guard Notifications</span>
            </NavLink>
          </li> */}
          <li style={styles.menuItem}>
            <NavLink
              to="/adminrequestaccept"
              style={styles.menuLink}
              className="menu-link"
            >
              <i className="fas fa-check-circle" style={styles.icon}></i>
              <span>Duty Accept/Reject</span>
            </NavLink>
          </li>
          <li style={styles.menuItem}>
            <NavLink
              to="/setting"
              style={styles.menuLink}
              className="menu-link"
            >
              <i className="fas fa-cog" aria-hidden="true" style={styles.icon}></i>
              <span>Settings</span>
            </NavLink>
          </li>
          <li style={styles.menuItem}>
            <NavLink
              to="/adminprofile"
              style={styles.menuLink}
              className="menu-link"
            >
              <i className="fas fa-user" style={styles.icon}></i>
              <span>My Profile</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/login" className="menu-link" style={styles.menuLink} onClick={handleLogout}>
              <i className="fas fa-sign-out-alt" style={styles.icon}></i>
              <span>Logout</span>
            </NavLink>

          </li>
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
                    INLINE STYLES
------------------------------------------------------------------ */

const styles = {

  sidebarContainer: {
    width: "260px",
    height: "100vh",
    background: "rgba(255, 255, 255, 0.28)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
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
    marginLeft: "auto",
    marginRight: "auto",
    boxShadow: "0 6px 25px rgba(0,0,0,0.2)",
  },

  logoLink: {
    textDecoration: "none",
  },

  logoText: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#fff",
    letterSpacing: "1px",
    fontFamily: "Poppins, sans-serif",
  },

  menuWrapper: {
    padding: "0 10px",
  },

  menuList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },

  menuItem: {
    marginBottom: "10px",
  },

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
    transition: "0.3s",
    position: "relative",
    overflow: "hidden",
  },


  icon: {
    fontSize: "18px",
    color: "#1e73be",
  },

  sectionTitle: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#1e73be",
    margin: "20px 0 10px 10px",
    textTransform: "uppercase",
    opacity: 0.8,
  },
};
