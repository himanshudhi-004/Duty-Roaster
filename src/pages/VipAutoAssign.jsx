import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

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

  /* New State For Time Modal */
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");

  useEffect(() => {
    if (!vip) {
      navigate("/vip-management");
      return;
    }
    fetchAssignedGuards();
  }, []);

  /* CHECK ALREADY ASSIGNED */
  const fetchAssignedGuards = async () => {
    try {
       const token = localStorage.getItem("adminToken");
      if (!token) return setLoading(false);
      const url = `${process.env.REACT_APP_BASE_URL}/api/assignments/${id}`;
      const res = await axios.get(url,{
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.details?.length > 0) {
        setResult(res.data);
        setAlreadyAssigned(true);
      }
    } catch (err) {
      console.error("Check assigned error:", err);
    }
  };

  /* STEP 1 -> OPEN TIME MODAL */
  const openTimePopup = () => {
    setShowTimeModal(true);
  };

  /* STEP 2 -> HANDLE AUTO ASSIGN AFTER TIME ENTERED */
  const handleAutoAssign = async () => {
    if (!startAt || !endAt) {
      toast.error("Please select both start and end time!");
      return;
    }

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
      const url = `${process.env.REACT_APP_BASE_URL}/api/assignments/auto`;
      const response = await axios.post(url, payload);

      setResult(response.data);
      setAlreadyAssigned(true);
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

      {/* VIP CARD */}
      <div style={styles.card}>
        <h3>{vip?.name}</h3>
        <p>📧 {vip?.email}</p>
        <p>🎖 {vip?.designation}</p>
        <p>📞 {vip?.contactno}</p>

        {vip?.status?.toLowerCase() === "active" ? (
          <span className="badge bg-success" style={{ padding: "8px 12px" }}>
            <i className="bi bi-check-circle"></i> &nbsp; Active
          </span>
        ) : (
          <span className="badge bg-danger" style={{ padding: "8px 12px" }}>
            <i className="bi bi-x-circle"></i> &nbsp; Inactive
          </span>
        )}
      </div>

      {/* AUTO ASSIGN BUTTON */}
      {!alreadyAssigned && (
        <button style={styles.btn} onClick={openTimePopup} disabled={loading}>
          {loading ? "Assigning..." : "Auto Assign Guards"}
        </button>
      )}

      {/* TIME INPUT POPUP MODAL */}
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
              <button style={styles.btn} onClick={handleAutoAssign}>
                Continue
              </button>
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

      {/* RESULT DISPLAY */}
      {result && (
        <div style={styles.responseBox}>
          <h3>Assigned Guard Summary</h3>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Level</th>
                <th style={styles.tableHeader}>Requested</th>
                <th style={styles.tableHeader}>Assigned</th>
                <th style={styles.tableHeader}>Missing</th>
              </tr>
            </thead>

            <tbody>
              {result.summary?.map((row, i) => (
                <tr
                  key={i}
                  style={styles.row}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = styles.rowHover.background)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td style={styles.tableCell}>{row.level}</td>
                  <td style={styles.tableCell}>{row.requested}</td>
                  <td style={styles.tableCell}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 8,
                        background: row.assigned > 0 ? "#d4f8d4" : "#ffe6e6",
                        color: row.assigned > 0 ? "#2e7d32" : "#d32f2f",
                        fontWeight: 600,
                      }}
                    >
                      {row.assigned}
                    </span>
                  </td>

                  <td style={styles.tableCell}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 8,
                        background: row.missing > 0 ? "#ffcccc" : "#d4f8d4",
                        color: row.missing > 0 ? "#d32f2f" : "#2e7d32",
                        fontWeight: 600,
                      }}
                    >
                      {row.missing}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* DETAILS TABLE */}
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
                <tr
                  key={d.id}
                  style={styles.row}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = styles.rowHover.background)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td style={styles.tableCell}>{d.officer.name}</td>
                  <td style={styles.tableCell}>{d.officer.email}</td>
                  <td style={styles.tableCell}>
                    <span
                      style={{
                        padding: "5px 12px",
                        borderRadius: 20,
                        background: "#e3f2fd",
                        color: "#1967d2",
                        fontWeight: 600,
                      }}
                    >
                      {d.officer.rank}
                    </span>
                  </td>
                  <td style={styles.tableCell}>{d.officer.experience} yrs</td>

                  <td style={styles.tableCell}>
                    <span
                      style={{
                        padding: "5px 12px",
                        borderRadius: 20,
                        background: d.status === "Active" ? "#d4f8d4" : "#ffe6e6",
                        color: d.status === "Active" ? "#2e7d32" : "#d32f2f",
                        fontWeight: 600,
                      }}
                    >
                      {d.status}
                    </span>
                  </td>

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
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------- */
/* PREMIUM UI STYLES */
/* ------------------------------------------------------- */
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
    marginBottom: 20,
  },
  responseBox: {
    background: "rgba(255,255,255,0.55)",
    backdropFilter: "blur(8px)",
    borderRadius: 14,
    padding: 25,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    marginTop: 15,
    borderRadius: 14,
    overflow: "hidden",
    background: "rgba(255,255,255,0.45)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
  },
  tableHeader: {
    background: "linear-gradient(90deg, #1967d2, #4285f4)",
    color: "#fff",
    fontWeight: "600",
    textAlign: "left",
    padding: "14px 16px",
    fontSize: 15,
  },
  tableCell: {
    padding: "14px 16px",
    fontSize: 14,
    background: "rgba(255,255,255,0.75)",
    borderBottom: "1px solid rgba(0,0,0,0.05)",
  },
  row: { transition: "0.25s ease" },
  rowHover: { background: "rgba(25,103,210,0.08)" },

  /* POPUP MODAL STYLES */
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modalBox: {
    background: "#fff",
    padding: 25,
    borderRadius: 12,
    width: "400px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: 8,
    border: "1px solid #ccc",
    marginTop: 5,
    marginBottom: 15,
    fontSize: 15,
  },
};
