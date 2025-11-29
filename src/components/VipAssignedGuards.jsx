import React, { useEffect, useState } from "react";
import axios from "axios";
import { useVipStore } from "../context/VipContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

/* ------------------- AXIOS INSTANCE + INTERCEPTOR ------------------- */
const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

api.interceptors.request.use((config) => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem(`${role}Token`);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function VipAssignedGuards() {
  const { selectedVip } = useVipStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  const vipId = selectedVip?.id;

  useEffect(() => {
    if (!vipId) {
      toast.error("No VIP Selected!");
      navigate("/vip-management");
      return;
    }

    fetchAssignedGuards();
  }, [vipId]);

  const fetchAssignedGuards = async () => {
    try {
      const res = await api.get(`/api/assignments/${vipId}`);

      if (res.data?.details?.length > 0) {
        setResult(res.data);
      } else {
        toast.info("No guards assigned yet!");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Failed to fetch assigned guards!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h3 style={{ padding: 30 }}>Loading Assigned Guards...</h3>;
  }

  if (!result) {
    return <h3 style={{ padding: 30 }}>No Assigned Guards Found</h3>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Assigned Guards for {selectedVip?.name}</h2>

      {/*  SUMMARY TABLE */}
      <div style={styles.card}>
        <h3>Guard Summary</h3>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Level</th>
              <th style={styles.tableHeader}>Assigned</th>
            </tr>
          </thead>
          <tbody>
            {result.summary?.map((row, i) => (
              <tr key={i}>
                <td style={styles.tableCell}>{row.level}</td>
                <td style={styles.tableCell}>{row.assigned}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*  DETAILS TABLE */}
      <div style={styles.responseBox}>
        <h3>Guard Details</h3>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Guard Name</th>
              <th style={styles.tableHeader}>Email</th>
              <th style={styles.tableHeader}>Rank</th>
              <th style={styles.tableHeader}>Experience</th>
              <th style={styles.tableHeader}>Status</th>
              <th style={styles.tableHeader}>Assigned At</th>
              <th style={styles.tableHeader}>Assigned Till</th>
            </tr>
          </thead>

          <tbody>
            {result.details?.map((d) => (
              <tr key={d.id}>
                <td style={styles.tableCell}>{d.officer?.name}</td>
                <td style={styles.tableCell}>{d.officer?.email}</td>
                <td style={styles.tableCell}>{d.officer?.rank}</td>
                <td style={styles.tableCell}>
                  {d.officer?.experience} yrs
                </td>
                <td style={styles.tableCell}>{d.status}</td>
                <td style={styles.tableCell}>
                  {new Date(d.startAt).toLocaleString()}
                </td>
                <td style={styles.tableCell}>
                  {new Date(d.endAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          style={{ ...styles.btn, marginTop: 20 }}
          onClick={() => navigate(-1)}
        >
          ⬅ Back
        </button>
      </div>
    </div>
  );
}

/* ---------------- UI STYLES ---------------- */
const styles = {
  container: { padding: 30 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1967d2",
  },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
    marginBottom: 20,
  },
  btn: {
    background: "#1967d2",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 16,
  },
  responseBox: {
    background: "rgba(255,255,255,0.55)",
    borderRadius: 14,
    padding: 25,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
  table: { width: "100%", marginTop: 15 },
  tableHeader: {
    background: "#1967d2",
    color: "#fff",
    padding: 10,
  },
  tableCell: {
    padding: 10,
    borderBottom: "1px solid #ddd",
  },
};
