import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllVip, getAllGuard } from "../api/vipform";
import { useAdminStore } from "../context/AdminContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { selectedAdmin, setSelectedAdmin } = useAdminStore();

  const [adminName, setAdminName] = useState("Admin");
  const [vipList, setVipList] = useState([]);
  const [guardList, setGuardList] = useState([]);

  /* ✅ INSTANT SYNC FROM CONTEXT */
  useEffect(() => {
    if (selectedAdmin?.adminName) {
      setAdminName(selectedAdmin.adminName);
    }
  }, [selectedAdmin]);

  /* ✅ FALLBACK FOR REFRESH / DIRECT URL */
  useEffect(() => {
    const syncAdminProfile = async () => {
      try {
        if (selectedAdmin?.adminName) return;

        const stored = localStorage.getItem("selectedAdmin");
        if (stored) {
          const parsed = JSON.parse(stored);
          setSelectedAdmin(parsed);
          setAdminName(parsed.adminName);
          return;
        }

        const token = localStorage.getItem("adminToken");
        if (!token) return;

        const decoded = jwtDecode(token);
        const userName = decoded.sub;

        const res = await axios.get(`${BASE_URL}/auth/profile`, {
          params: { userName },
          headers: { Authorization: `Bearer ${token}` },
        });

        const profile = Array.isArray(res.data) ? res.data[0] : res.data;

        setSelectedAdmin(profile);
        setAdminName(profile.adminName);
        localStorage.setItem("selectedAdmin", JSON.stringify(profile));
      } catch (err) {
        console.log("Admin Sync Error:", err);
      }
    };

    syncAdminProfile();
  }, []);

  const loadVip = async () => {
    const data = await getAllVip();
    setVipList(Array.isArray(data) ? data : data?.data || []);
  };

  const loadGuards = async () => {
    const data = await getAllGuard();
    setGuardList(Array.isArray(data) ? data : data?.data || []);
  };

  useEffect(() => {
    loadVip();
    loadGuards();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const totalUsers = vipList.length + guardList.length;

  const stats = [
    { title: "Total VIPs", value: vipList.length, icon: "fas fa-user", color: "#1e73be" },
    { title: "Total Officers", value: guardList.length, icon: "fas fa-user-shield", color: "#3cb371" },
    { title: "Total Users", value: totalUsers, icon: "fas fa-users", color: "#ffa500" },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.headerSection}>
        <div>
          <h2 style={styles.pageTitle}>ADMIN DASHBOARD</h2>
          <p style={styles.desc}>Manage VIPs, Guards & Combined User Count.</p>
        </div>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          <i className="fas fa-sign-out-alt" style={{ marginRight: 8 }}></i> Logout
        </button>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.welcomeBox}>
          <h2 style={styles.welcomeText}>Welcome {adminName} 👋</h2>

          <div style={styles.buttonRow}>
            <Link to="/vipform" style={styles.actionBtnBlue}>Add VIPs</Link>
            <Link to="/guardform" style={styles.actionBtnGreen}>Add Guards</Link>
          </div>
        </div>

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

/* ------------------ STYLES (UNCHANGED) ------------------ */
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
