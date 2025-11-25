import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function VipProfile() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // ------------------- FETCH VIP PROFILE -------------------
  const fetchVipProfile = async () => {
    try {
      const token = localStorage.getItem("vipToken");
      if (!token) return setLoading(false);

      const res = await axios.get(`${BASE_URL}/vip/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // If API returns array, pick 1st row
      const profile = Array.isArray(res.data) ? res.data[0] : res.data;

      setUserDetails(profile);
    } catch (err) {
      console.error("VIP Profile Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVipProfile();
  }, []);

  // ------------------- LOADING -------------------
  if (loading) {
    return (
      <div className="text-center py-5">
        <i className="fa fa-spinner fa-spin fa-2x text-primary mb-3"></i>
        <h5>Loading VIP profile...</h5>
      </div>
    );
  }

  // ------------------- FAIL STATE -------------------
  if (!userDetails) {
    return (
      <div className="text-center py-5 text-danger">
        <h4>Unable to load VIP profile.</h4>
      </div>
    );
  }

  // ------------------- RENDER UI -------------------
  return (
    <div style={styles.pageContainer}>

      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>
          <i className="fa fa-user-circle me-2"></i> VIP Profile
        </h2>
        <p style={styles.headerSubtitle}>Preview of VIP account information</p>
      </div>

      {/* PROFILE CARD */}
      <div style={styles.card}>
        <div style={styles.cardBody}>
          <div style={styles.profileRow}>

            {/* LEFT SIDE */}
            <div style={styles.leftBox}>
              <h4 style={styles.name}>{userDetails.vip_name}</h4>
              <p style={styles.role}>VIP</p>
            </div>

            {/* RIGHT SIDE */}
            <div style={styles.rightBox}>
              {[
                ["Vip ID", userDetails.vip_id],
                ["Username", userDetails.vip_username],
                ["Email", userDetails.vip_email],
                ["Contact No", userDetails.contact_no],
                [
                  "Status",
                  <span
                    style={{
                      ...styles.statusBadge,
                      background:
                        userDetails.vip_status === "Active"
                          ? "#28a745"
                          : "#dc3545",
                    }}
                  >
                    {userDetails.vip_status}
                  </span>,
                ],
              ].map(([label, value], index) => (
                <div style={styles.detailRow} key={index}>
                  <div style={styles.detailLabel}>{label}:</div>
                  <div style={styles.detailValue}>{value}</div>
                </div>
              ))}

              {/* BUTTONS */}
              <div style={{ marginTop: "20px" }}>
                <button style={styles.editBtn}>
                  <i className="fa fa-edit me-1"></i> Edit Profile
                </button>

                <button style={styles.passBtn}>
                  <i className="fa fa-key me-1"></i> Change Password
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

/* ---------------- UI THEME (SAME AS ADMIN) ---------------- */

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

  editBtn: {
    background: "#1e73be",
    color: "white",
    padding: "10px 18px",
    borderRadius: "10px",
    border: "none",
    marginRight: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  passBtn: {
    background: "#6c757d",
    color: "white",
    padding: "10px 18px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
  },
};
