import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllVip, getAllGuard } from "../api/vipform";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function VipDashboard() {
  const navigate = useNavigate();

  const [vipList, setVipList] = useState([]);
  const [guardList, setGuardList] = useState([]);
  const [vipName, setVipName] = useState("");

  /* ---------------------------------------
      FETCH Vip PROFILE (get name)
  ----------------------------------------- */
  const loadVipProfile = async () => {
    try {
      const token = localStorage.getItem("vipToken");
      if (!token) return;

      const res = await axios.get(`${BASE_URL}/vipauth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profile = Array.isArray(res.data) ? res.data[0] : res.data;

      setVipName(profile.name || "VIP");
    } catch (error) {
      console.log("PROFILE FETCH ERROR:", error);
    }
  };

  /* ---------------------------------------
        LOAD VIP LIST
  ----------------------------------------- */
  const loadVip = async () => {
    try {
      const data = await getAllVip();
      if (Array.isArray(data)) setVipList(data);
      else if (Array.isArray(data?.data)) setVipList(data.data);
      else setVipList([]);
    } catch (error) {
      console.log("VIP API ERROR:", error);
      setVipList([]);
    }
  };

  /* ---------------------------------------
        LOAD GUARD LIST
  ----------------------------------------- */
  const loadGuards = async () => {
    try {
      const data = await getAllGuard();
      if (Array.isArray(data)) setGuardList(data);
      else if (Array.isArray(data?.data)) setGuardList(data.data);
      else setGuardList([]);
    } catch (err) {
      console.log("GUARD API ERROR:", err);
      setGuardList([]);
    }
  };

  /* ---------------------------------------
            USE EFFECT
  ----------------------------------------- */
  useEffect(() => {
    loadVip();
    loadGuards();
    loadVipProfile();   // <-- FETCH Vip NAME HERE
  }, []);

  /* ---------------------------------------
            LOGOUT
  ----------------------------------------- */
  const handleLogout = () => {
    localStorage.removeItem("vipToken");
    navigate("/viplogin");
  };

  const totalUsers = vipList.length + guardList.length;

  /* ---------------------------------------
            STATS ARRAY
  ----------------------------------------- */
  const stats = [
    { title: "Total VIPs", value: vipList.length, icon: "fas fa-user", color: "#1e73be" },
    { title: "Total Officers", value: guardList.length, icon: "fas fa-user-shield", color: "#3cb371" },
    { title: "Total Users", value: totalUsers, icon: "fas fa-users", color: "#ffa500" },
  ];

  /* ---------------------------------------
              MAIN UI
  ----------------------------------------- */
  return (
    <div style={styles.page}>
      <div style={styles.headerSection}>
        <div>
          <h2 style={styles.pageTitle}>VIP DASHBOARD</h2>
          <p style={styles.desc}>Manage VIPs, Guards & Combined User Count.</p>
        </div>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          <i className="fas fa-sign-out-alt" style={{ marginRight: 8 }}></i> Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Welcome Section */}
        <div style={styles.welcomeBox}>
          <h2 style={styles.welcomeText}>
            Welcome {vipName} 👋
          </h2>
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} style={styles.statCard}>
              <div style={{ ...styles.iconCircle, background: stat.color }}>
                <i className={stat.icon} style={styles.icon}></i>
              </div>
              <h3 style={styles.statValue}>{stat.value}</h3>
              <p style={styles.statTitle}>{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Activity Section */}
        <div style={styles.activityBox}>
          <h3 style={styles.activityTitle}>Recent Activity</h3>
          <ul style={styles.activityList}>
            <li>✔ VIP & Guards list updated</li>
            <li>✔ Dashboard loaded successfully</li>
            <li>✔ System running smoothly</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------
              STYLES
----------------------------------------- */
const styles = {
  page: { padding: 25 },

  headerSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  pageTitle: { fontSize: 30, fontWeight: 700, color: "#1e73be" },

  desc: { fontSize: 15, opacity: 0.6 },

  logoutBtn: {
    background: "#888",
    padding: "10px 20px",
    borderRadius: 8,
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
  },

  mainContent: {
    background: "#fff",
    padding: 25,
    borderRadius: 12,
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
  },

  welcomeBox: { marginBottom: 25 },

  welcomeText: { fontSize: 26, fontWeight: 700, color: "#1e73be", marginBottom: 20 },

  buttonRow: { display: "flex", gap: 15, flexWrap: "wrap" },

  actionBtnBlue: {
    background: "#1e73be",
    padding: "10px 20px",
    borderRadius: 8,
    color: "white",
    textDecoration: "none",
    fontWeight: 600,
  },

  actionBtnGreen: {
    background: "#3cb371",
    padding: "10px 20px",
    borderRadius: 8,
    color: "white",
    textDecoration: "none",
    fontWeight: 600,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: 25,
    marginTop: 20,
  },

  statCard: {
    background: "white",
    borderRadius: 12,
    padding: 25,
    textAlign: "center",
    boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
  },

  iconCircle: {
    width: 55,
    height: 55,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px",
  },

  icon: { fontSize: 22, color: "white" },

  statValue: { fontSize: 28, fontWeight: 700, color: "#333" },

  statTitle: { opacity: 0.6 },

  activityBox: {
    marginTop: 35,
    padding: 20,
    borderRadius: 12,
    background: "#f8fbff",
    border: "1px solid #e5e9f0",
  },

  activityTitle: { fontSize: 20, color: "#1e73be", marginBottom: 10 },

  activityList: { lineHeight: 2, paddingLeft: 10 },
};
