import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
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

/* ------------------- DEFAULT TIME LOGIC ------------------- */
const now = new Date();
const plus8Hours = new Date(now.getTime() + 8 * 60 * 60 * 1000);

const formatDateTimeLocal = (date) => {
  const pad = (n) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/* STATIC GUARD DISTRIBUTION */
const guardDistribution = {
  "Bollywood Actor": ["Grade A - 1", "Grade B - 1", "Grade C - 2", "Grade E - 10"],
  Cricketers: ["Grade B - 1", "Grade C - 1", "Grade D - 5", "Grade E - 10"],
  Chessmaster: ["Grade B - 1", "Grade C - 2", "Grade E - 10"],
  User: ["Grade D - 2", "Grade E - 15"],
};

export default function VipAutoAssign() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const vip = state?.vip;
  const id = vip?.id;

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [alreadyAssigned, setAlreadyAssigned] = useState(false);

  const [showTimeModal, setShowTimeModal] = useState(false);

  const [startAt, setStartAt] = useState(formatDateTimeLocal(now));
  const [endAt, setEndAt] = useState(formatDateTimeLocal(plus8Hours));

  /* ✅ STATUS STATE */
  const [vipStatus, setVipStatus] = useState(vip?.status?.toLowerCase());

  useEffect(() => {
    if (!vip) return navigate("/vip-management");
    setVipStatus(vip?.status?.toLowerCase());
    fetchAssignedGuards();
  }, [vip]);

  const fetchAssignedGuards = async () => {
    try {
      const res = await api.get(`/api/assignments/${id}`);
      if (res.data?.details?.length > 0) {
        setResult(res.data);
        setAlreadyAssigned(true);
      }
    } catch (err) {
      console.error("Check assigned error:", err);
    }
  };

  const openTimePopup = () => setShowTimeModal(true);

  const handleAutoAssign = async () => {
    if (!startAt || !endAt) return toast.error("Please select both start and end time!");

    setShowTimeModal(false);
    setLoading(true);

    const dataList = guardDistribution[vip.designation] || [];

    const levelsArray = dataList.map((item) => {
      const [grade, count] = item.split(" - ");
      const formatted = grade.replace("Grade ", "") + " Grade";
      return { guardLevel: formatted, numberOfGuards: Number(count) };
    });

    const payload = {
      userId: vip.id,
      levels: levelsArray,
      startAt,
      endAt,
    };

    try {
      const response = await api.post(`/api/assignments/auto`, payload);

      setResult(response.data);
      setAlreadyAssigned(true);

      /* ✅ INSTANTLY SET ACTIVE */
      setVipStatus("active");

      toast.success("Guards Assigned Successfully!");
    } catch (err) {
      toast.error("Assignment Failed!");
      setResult({ error: err.message });
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>VIP Guard Assignment</h2>

      <div style={styles.card}>
        <h3>{vip?.name}</h3>
        <p>📧 {vip?.email}</p>
        <p>🎖 {vip?.designation}</p>
        <p>📞 {vip?.contactno}</p>

        {vipStatus === "active" ? (
          <span className="badge bg-success" style={{ padding: "8px 12px" }}>
            Active
          </span>
        ) : (
          <span className="badge bg-danger" style={{ padding: "8px 12px" }}>
            Inactive
          </span>
        )}
      </div>

      {!alreadyAssigned && (
        <button style={styles.btn} onClick={openTimePopup} disabled={loading}>
          {loading ? "Assigning..." : "Auto Assign Guards"}
        </button>
      )}

      {showTimeModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h3>Select Duty Time</h3>

            <label>Start Time</label>
            <input
              type="datetime-local"
              style={styles.input}
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
            />

            <label>End Time</label>
            <input
              type="datetime-local"
              style={styles.input}
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
            />

            <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
              <button style={styles.btn} onClick={handleAutoAssign}>Continue</button>
              <button
                style={{ ...styles.btn, background: "#888" }}
                onClick={() => setShowTimeModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div style={styles.responseBox}>
          <h3>Assigned Guard Summary</h3>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Level</th>
                {/* <th style={styles.tableHeader}>Requested</th>
                <th style={styles.tableHeader}>Assigned</th> */}
                <th style={styles.tableHeader}>Missing</th>
              </tr>
            </thead>
            <tbody>
              {result.summary?.map((row, i) => (
                <tr key={i}>
                  <td style={styles.tableCell}>{row.level}</td>
                  {/* <td style={styles.tableCell}>{row.requested}</td> */}
                  <td style={styles.tableCell}>{row.assigned}</td>
                  {/* <td style={styles.tableCell}>{row.missing}</td> */}
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={{ marginTop: 30 }}>Assigned Guard Details</h3>

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
                  <td style={styles.tableCell}>{d.officer?.experience} yrs</td>
                  <td style={styles.tableCell}>{d.status}</td>
                  <td style={styles.tableCell}>{new Date(d.startAt).toLocaleString()}</td>
                  <td style={styles.tableCell}>{new Date(d.endAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ---------------- UI STYLES ---------------- */
const styles = {
  container: { padding: 30 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#1967d2" },
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
    marginBottom: 20,
  },
  responseBox: {
    background: "rgba(255,255,255,0.55)",
    borderRadius: 14,
    padding: 25,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
  table: { width: "100%", marginTop: 15 },
  tableHeader: { background: "#1967d2", color: "#fff", padding: 10 },
  tableCell: { padding: 10, borderBottom: "1px solid #ddd" },
  modalOverlay: {
    position: "fixed", top: 0, left: 0,
    width: "100vw", height: "100vh",
    background: "rgba(0,0,0,0.6)",
    display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999,
  },
  modalBox: { background: "#fff", padding: 25, borderRadius: 12, width: "400px" },
  input: {
    width: "100%", padding: "10px", borderRadius: 8,
    border: "1px solid #ccc", marginTop: 5, marginBottom: 15,
  },
};
