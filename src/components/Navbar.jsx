import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../api/auth";
import { useAdminStore } from "../context/AdminContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedAdmin } = useAdminStore();

  const [leftMenuOpen, setLeftMenuOpen] = useState(false);
  const [userDropOpen, setUserDropOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 851 : false
  );

  const leftMenuRef = useRef(null);
  const userRef = useRef(null);

  const adminName = selectedAdmin?.adminName || "Admin";
  const adminEmail = selectedAdmin?.adminEmail || "admin@gmail.com";

  const handleLogout = () => {
    logoutUser();
     localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  /*  RESPONSIVE WIDTH + ORIENTATION */
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 851;
      setShowNavbar(isMobile);

      if (!isMobile) {
        setLeftMenuOpen(false);
        setUserDropOpen(false);
      }
    };

    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  /*  CLOSE DROPDOWNS ON ROUTE CHANGE */
  useEffect(() => {
    setLeftMenuOpen(false);
    setUserDropOpen(false);
  }, [location.pathname]);

  /*  OUTSIDE CLICK CLOSE */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (leftMenuRef.current && !leftMenuRef.current.contains(e.target)) {
        setLeftMenuOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserDropOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  /*  AUTO HIDE ON DESKTOP */
  if (!showNavbar) return null;

  return (
    <nav style={styles.navbar}>
      {/*  LEFT SIDE */}
      <div style={styles.leftBox} ref={leftMenuRef}>
        <button
          style={styles.dashBtn}
          aria-label="Open menu"
          onClick={() => {
            setLeftMenuOpen((prev) => !prev);
            setUserDropOpen(false);
          }}
        >
          ---
        </button>

        <span style={styles.brand}>Admin Panel</span>

        {leftMenuOpen && (
          <div style={styles.leftDropdown}>
            <NavLink to="/admindashboard" style={styles.menuItem}>Dashboard</NavLink>
            <NavLink to="/vipform" style={styles.menuItem}>VIP Form</NavLink>
            <NavLink to="/guardform" style={styles.menuItem}>Guard Form</NavLink>
            <NavLink to="/viplist" style={styles.menuItem}>VIP Table</NavLink>
            <NavLink to="/guardlist" style={styles.menuItem}>Guard Table</NavLink>
            <NavLink to="/vgmang" style={styles.menuItem}>VIP–Guard Management</NavLink>
            <NavLink to="/dutyhistory" style={styles.menuItem}>Guard-duty-history</NavLink>
          </div>
        )}
      </div>

      {/*  RIGHT SIDE */}
      <div style={styles.userDropdownBox} ref={userRef}>
        <button
          style={styles.profileIconBtn}
          aria-label="Open profile menu"
          onClick={() => {
            setUserDropOpen((prev) => !prev);
            setLeftMenuOpen(false);
          }}
        >
          <img
            src="/assets/img/avtar.jpg"
            alt="profile"
            style={styles.avatar}
          />
        </button>

        {userDropOpen && (
          <div style={styles.userDropdown}>
            <div style={styles.userHeader}>
              <img
                src="/assets/img/avtar.jpg"
                alt="profile"
                style={styles.userBigAvatar}
              />
              <div>
                <strong>{adminName}</strong>
                <br />
                <small>{adminEmail}</small>
              </div>
            </div>

            <NavLink to="/adminprofile" style={styles.userItem}>
              My Profile
            </NavLink>

            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

/* ===============================
    PERFECT RESPONSIVE STYLES
================================ */

const styles = {
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 14px",
    background: "#ffffff",
    borderBottom: "1px solid #ddd",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    width: "100%",
  },

  leftBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    position: "relative",
    maxWidth: "70%",
  },

  dashBtn: {
    fontSize: 20,
    fontWeight: "900",
    background: "none",
    border: "2px solid #4e54c8",
    borderRadius: 6,
    padding: "2px 8px",
    cursor: "pointer",
    color: "#4e54c8",
    minWidth: 36,
    minHeight: 32,
  },

  brand: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4e54c8",
    whiteSpace: "nowrap",
  },

  leftDropdown: {
    position: "absolute",
    top: "38px",
    left: 0,
    width: "240px",
    maxHeight: "70vh",
    overflowY: "auto",
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
    zIndex: 1000,
  },

  menuItem: {
    display: "block",
    padding: "12px 14px",
    textDecoration: "none",
    color: "#333",
    borderBottom: "1px solid #eee",
    fontWeight: 600,
    fontSize: 14,
  },

  userDropdownBox: {
    position: "relative",
  },

  profileIconBtn: {
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: "2px solid #4e54c8",
    objectFit: "cover",
  },

  userDropdown: {
    position: "absolute",
    right: 0,
    top: "40px",
    width: "220px",
    maxWidth: "90vw",
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    overflow: "hidden",
    zIndex: 1000,
  },

  userHeader: {
    display: "flex",
    gap: 10,
    padding: 12,
    background: "#f8f9fa",
    borderBottom: "1px solid #eee",
    alignItems: "center",
  },

  userBigAvatar: {
    width: 38,
    height: 38,
    borderRadius: "50%",
  },

  userItem: {
    display: "block",
    padding: "10px 14px",
    textDecoration: "none",
    color: "#333",
    fontWeight: 600,
    fontSize: 14,
  },

  logoutBtn: {
    width: "100%",
    border: "none",
    background: "#dc3545",
    color: "#fff",
    padding: 12,
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 14,
  },
};
