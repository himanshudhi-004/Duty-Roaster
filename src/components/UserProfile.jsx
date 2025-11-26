  import React, { useEffect, useState } from "react";
  import { useUserStore } from "../context/UserContext";
  import axios from "axios";
  import { useNavigate } from "react-router-dom";
  import { jwtDecode } from "jwt-decode";


  const BASE_URL = process.env.REACT_APP_BASE_URL;

  export default function UserProfile() {
    const navigate = useNavigate();
    const { handle_us_Edit } = useUserStore();
    const { setSelectedUser } = useUserStore();
    console.log("UserProfile Component Rendered",setSelectedUser);

    /* ------------------ STATE ------------------ */
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    /* ------------------ FETCH PROFILE ------------------ */
    useEffect(() => {
      fetchProfile();
    }, []);

    const fetchProfile = async () => {
      try {
      const token = localStorage.getItem("userToken");
        if (!token) return;

        const decoded = jwtDecode(token);
        const userName = decoded.sub;

        const res = await axios.get(`${BASE_URL}/auth/profile`, {
          params: { userName },
          headers: { Authorization: `Bearer ${token}` },
        });

        const profile = Array.isArray(res.data) ? res.data[0] : res.data;

        setUserDetails(profile);
        setSelectedUser(profile);   // <-- STORE IN CONTEXT
      } catch (err) {
        console.log("Profile Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    /* ------------------ LOADING UI ------------------ */
    if (loading) {
      return (
        <div className="text-center py-5">
          <i className="fa fa-spinner fa-spin fa-2x text-primary mb-3"></i>
          <h5>Loading profile...</h5>
        </div>
      );
    }

    /* ------------------ NO PROFILE ------------------ */
    if (!userDetails) {
      return (
        <div className="text-center py-5 text-danger">
          <h4>Unable to load profile.</h4>
        </div>
      );
    }

    /* ------------------ MAIN UI ------------------ */
    return (
      <div style={styles.pageContainer}>
        {/* HEADER */}
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>
            <i className="fa fa-user-circle me-2"></i> User Profile
          </h2>
          <p style={styles.headerSubtitle}>Overview of admin account details</p>
        </div>

        {/* PROFILE CARD */}
        <div style={styles.card}>
          <div style={styles.cardBody}>
            <div style={styles.profileRow}>
              {/* LEFT SECTION */}
              <div style={styles.leftBox}>
                <h4 style={styles.name}>{userDetails.username}</h4>
                <p style={styles.role}>User</p>
              </div>

              {/* RIGHT DETAILS */}
              <div style={styles.rightBox}>
                {[
                  ["User ID", userDetails.id],
                  ["Username", userDetails.username],
                  ["Email", userDetails.email],
                  ["Contact No", userDetails.contactno],
                  [
                    "Role",
                    <span
                      style={{
                        ...styles.statusBadge,
                        background:
                          userDetails.role === "Active"
                            ? "#28a745"
                            : "#dc3545",
                      }}
                    >
                      {userDetails.role}
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
                    style={styles.editBtn}
                    onClick={() => {
                      handle_us_Edit(userDetails);   // save data in context
                      navigate("/useredit");    // navigate to edit page
                    }}
                  >
                    <i className="fa fa-edit me-1"></i> Edit Profile
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ------------------ UI THEME STYLES ------------------ */
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
      cursor: "pointer",
      fontWeight: "600",
    },
  };
