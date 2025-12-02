import React, { useState } from "react";
import axios from "axios";
import { useVipStore } from "../context/VipContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function VipDuty() {
  const { selectedVip, handleBack } = useVipStore();

  const [loading, setLoading] = useState(false);

  //  DUTY COMPLETE API CALL
  const handleDutyComplete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to mark this duty as COMPLETED?"
    );

    if (!confirm) return;

    try {
      setLoading(true);

      const token = localStorage.getItem("vipToken");
      if (!token) {
        toast.error("Token not found. Please login again.");
        return;
      }

      const res = await axios.post(
        `${BASE_URL}/api/assignments/complete/vip/${selectedVip.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("✅ Duty marked as Completed Successfully!");
      console.log("API Response:", res.data);
    } catch (err) {
      console.error("Duty Complete Error:", err);
      toast.error("❌ Failed to complete duty");
    } finally {
      setLoading(false);
    }
  };

  //  DUTY NOT COMPLETE
  const handleDutyNotComplete = () => {
    toast.info("❗ Duty marked as Not Completed");
  };

  //  NO VIP SELECTED
  if (!selectedVip) {
    return (
      <div style={styles.container}>
        <h2>No VIP Selected</h2>
        <p>Please select a VIP first.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h2>VIP Duty Status</h2>
        <button onClick={handleBack} style={styles.backBtn}>
          Back
        </button>
      </div>

      {/* VIP INFO CARD */}
      <div style={styles.vipCard}>
        <p><strong>Name:</strong> {selectedVip.name}</p>
        <p><strong>VIP ID:</strong> {selectedVip.id}</p>
      </div>

      {/* ACTION BUTTONS */}
      <div style={styles.actionBox}>
        <button
          style={{ ...styles.actionBtn, background: "#22c55e" }}
          onClick={handleDutyComplete}
          disabled={loading}
        >
          {loading ? "Processing..." : " Duty Completed"}
        </button>

        <button
          style={{ ...styles.actionBtn, background: "#ef4444" }}
          onClick={handleDutyNotComplete}
          disabled={loading}
        >
          ❌ Not Completed
        </button>
      </div>
    </div>
  );
}

/* ===================== STYLES ===================== */

const styles = {
  container: {
    padding: "20px",
    maxWidth: "700px",
    margin: "auto",
    fontFamily: "sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backBtn: {
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    background: "#111827",
    color: "#fff",
  },
  vipCard: {
    marginTop: "15px",
    padding: "16px",
    borderRadius: "10px",
    background: "#f1f5f9",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  actionBox: {
    marginTop: "40px",
    display: "flex",
    gap: "20px",
    justifyContent: "center",
  },
  actionBtn: {
    padding: "14px 26px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    minWidth: "200px",
  },
};
