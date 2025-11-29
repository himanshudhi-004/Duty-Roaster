import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../api/auth";
import { useVipStore } from "../context/VipContext";

export default function VipNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedVip } = useVipStore();

  const [showNavbar, setShowNavbar] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 851 : false
  );
  const [leftMenuOpen, setLeftMenuOpen] = useState(false);
  const [userDropOpen, setUserDropOpen] = useState(false);

  const leftMenuRef = useRef(null);
  const userRef = useRef(null);

  const vipName = selectedVip?.name || "Vip";
  const vipEmail = selectedVip?.email || "vip@gmail.com";

  /*  RESPONSIVE WIDTH CONTROL */
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 851;
      setShowNavbar(isMobile);

      if (!isMobile) {
        setLeftMenuOpen(false);
        setUserDropOpen(false);
      }
    };

    handleResize();
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

  /*  LOGOUT */
  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem("vipToken");
    localStorage.removeItem("selectedVip");
    localStorage.removeItem("role");
    navigate("/login");
  };

  /*  HIDE ON DESKTOP */
  if (!showNavbar) return null;

  return (
    <nav style={styles.navbar}>
      {/*  LEFT SIDE : MENU + BRAND */}
      <div style={styles.leftBox} ref={leftMenuRef}>
        <button
          style={styles.menuBtn}
          aria-label="Open menu"
          onClick={() => {
            setLeftMenuOpen((p) => !p);
            setUserDropOpen(false);
          }}
        >
          ---
        </button>

        <span style={styles.brand}>VIP Panel</span>

        {leftMenuOpen && (
          <div style={styles.leftDropdown}>
            <NavLink to="/vipdashboard" style={styles.menuItem}>
              Dashboard
            </NavLink>

            <NavLink to="/assguards" style={styles.menuItem}>
              Assigned Guards
            </NavLink>

            <NavLink to="/vipprofile" style={styles.menuItem}>
              My Profile
            </NavLink>
          </div>
        )}
      </div>

      {/*  RIGHT SIDE : PROFILE ICON */}
      <div style={styles.userBox} ref={userRef}>
        <button
          style={styles.profileIconBtn}
          aria-label="Open profile"
          onClick={() => {
            setUserDropOpen((p) => !p);
            setLeftMenuOpen(false);
          }}
        >
          <img
            src="/assets/img/avtar.jpg"
            alt="Vip"
            style={styles.avatar}
          />
        </button>

        {userDropOpen && (
          <div style={styles.userDropdown}>
            <div style={styles.userHeader}>
              <img
                src="/assets/img/avtar.jpg"
                alt="Vip"
                style={styles.userBigAvatar}
              />
              <div>
                <strong>{vipName}</strong>
                <br />
                <small>{vipEmail}</small>
              </div>
            </div>

            <NavLink to="/vipprofile" style={styles.userItem}>
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
    VIP NAVBAR STYLES
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

  /* LEFT */
  leftBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    position: "relative",
  },

  menuBtn: {
    fontSize: 20,
    fontWeight: "900",
    background: "none",
    border: "2px solid #4e54c8",
    borderRadius: 6,
    padding: "2px 8px",
    cursor: "pointer",
    color: "#4e54c8",
  },

  brand: {
    fontSize: 17,
    fontWeight: "700",
    color: "#4e54c8",
    whiteSpace: "nowrap",
  },

  leftDropdown: {
    position: "absolute",
    top: 38,
    left: 0,
    width: 230,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
    overflow: "hidden",
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

  /* RIGHT */
  userBox: {
    position: "relative",
  },

  profileIconBtn: {
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
  },

  avatar: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    border: "2px solid #4e54c8",
  },

  userDropdown: {
    position: "absolute",
    right: 0,
    top: 42,
    width: 220,
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
