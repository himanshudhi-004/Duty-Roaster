import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useGuardStore } from "../context/GuardContext";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function GuardShift() {
  const navigate = useNavigate();
  const { selectedGuard } = useGuardStore();
  const [vip, setVip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedGuard?.id) {
      console.warn("Guard missing — redirecting");
      navigate("/guarddashboard");
      return;
    }

    async function fetchVip() {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/assignments/getvip/${selectedGuard.id}`
        );

        const extracted =
          res.data?.data || res.data?.vip || res.data || null;

        setVip(extracted);
      } catch (error) {
        console.error("VIP Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVip();
  }, [selectedGuard, navigate]);

  /* ------------------ LOADING UI ------------------ */
  if (loading) {
    return (
      <div className="text-center py-5">
        <i className="fa fa-spinner fa-spin fa-2x text-primary mb-3"></i>
        <h5>Loading Shift...</h5>
      </div>
    );
  }

  /* ------------------ EMPTY UI ------------------ */
  if (!vip) {
    return (
      <div style={styles.emptyBox}>
        <h2>No VIP Data Found</h2>
        <button style={styles.backBtn} onClick={() => navigate("/guarddashboard")}>
          Go Back
        </button>
      </div>
    );
  }

  /* ------------------ MAIN UI ------------------ */
  return (
    <div style={styles.pageContainer}>
      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>
          <i className="fa fa-shield me-2"></i> Guard Shift Details
        </h2>
        <p style={styles.headerSubtitle}>
          Assigned VIP & Duty Schedule Overview
        </p>
      </div>

      {/* SHIFT CARD */}
      <div style={styles.card}>
        <div style={styles.cardBody}>
          <div style={styles.profileRow}>
            {/* LEFT VIP INFO */}
            <div style={styles.leftBox}>
              <h4 style={styles.name}>{vip.name}</h4>
              <p style={styles.role}>{vip.designation}</p>
            </div>

            {/* RIGHT DETAILS */}
            <div style={styles.rightBox}>
              {[
                ["VIP Name", vip.name],
                ["Designation", vip.designation],
                [
                  "Start Time",
                  <span style={styles.timeBadge}>{vip.startAt}</span>,
                ],
                [
                  "End Time",
                  <span style={styles.timeBadge}>{vip.endAt}</span>,
                ],
                [
                  "Status",
                  <span
                    style={{
                      ...styles.statusBadge,
                      background:
                        vip.status === "Active" ?  "#dc3545" : "#28a745",
                    }}
                  >
                    {vip.status || "Assigned"}
                  </span>,
                ],
              ].map(([label, value], i) => (
                <div style={styles.detailRow} key={i}>
                  <div style={styles.detailLabel}>{label}:</div>
                  <div style={styles.detailValue}>{value}</div>
                </div>
              ))}

              {/* ACTION */}
              <div style={{ marginTop: "20px" }}>
                <button
                  style={styles.backBtn}
                  onClick={() => navigate(-1)}
                >
                  ← Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================== FULL PAGE UI THEME ================== */

const styles = {
  pageContainer: {
    padding: "30px",
    minHeight: "100vh",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(6px)",
  },

  header: {
    marginBottom: "25px",
    padding: "20px",
    background: "linear-gradient(135deg, #4e54c8, #8f94fb)",
    borderRadius: "14px",
    color: "white",
    boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
  },

  headerTitle: {
    margin: 0,
    fontSize: "26px",
    fontWeight: "700",
  },

  headerSubtitle: {
    marginTop: "5px",
    opacity: 0.9,
  },

  card: {
    background: "rgba(255,255,255,0.55)",
    borderRadius: "18px",
    padding: "25px",
    backdropFilter: "blur(8px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  },

  profileRow: {
    display: "flex",
    gap: "40px",
    flexWrap: "wrap",
    alignItems: "center",
  },

  leftBox: {
    flex: "1",
    textAlign: "center",
  },

  name: {
    fontSize: "22px",
    fontWeight: "700",
    marginTop: "10px",
  },

  role: {
    fontSize: "15px",
    color: "#777",
  },

  rightBox: {
    flex: "2",
  },

  detailRow: {
    display: "flex",
    marginBottom: "12px",
  },

  detailLabel: {
    width: "150px",
    fontWeight: "600",
    color: "#333",
  },

  detailValue: {
    flex: 1,
    fontWeight: "500",
    color: "#444",
  },

  statusBadge: {
    padding: "6px 12px",
    borderRadius: "20px",
    color: "white",
    fontWeight: "600",
  },

  timeBadge: {
    padding: "6px 12px",
    borderRadius: "20px",
    background: "#1e73be",
    color: "white",
    fontWeight: "600",
  },

  backBtn: {
    background: "#1e73be",
    color: "white",
    padding: "10px 18px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
  },

  emptyBox: {
    padding: "50px",
    textAlign: "center",
  },
};
