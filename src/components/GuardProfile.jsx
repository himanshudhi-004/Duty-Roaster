
// src/components/VipProfile.jsx
import React, { useEffect, useState } from "react";

export default function GuardProfile() {
  const [userDetails, setUserDetails] = useState(null);

  // Load sample admin data
  useEffect(() => {
    const sampleGuard = {
      id: "ADM001",
      name: "John Doe",
      username: "johndoe",
      email: "guard@example.com",
      contactno: "9876543210",
      status: "Active",
      profileimg: "/assets/img/profile.jpg",
    };
    setUserDetails(sampleGuard);
  }, []);

  if (!userDetails) {
    return (
      <div className="text-center py-5">
        <i className="fa fa-spinner fa-spin fa-2x text-primary mb-3"></i>
        <h5>Loading profile...</h5>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>

      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>
          <i className="fa fa-user-circle me-2"></i> Guard Profile
        </h2>
        <p style={styles.headerSubtitle}>Preview of guard account information</p>
      </div>

      {/* PROFILE CARD */}
      <div style={styles.card}>
        <div style={styles.cardBody}>
          <div style={styles.profileRow}>

            {/* LEFT SIDE IMAGE */}
            <div style={styles.leftBox}>
              <img
                src={userDetails.profileimg}
                alt="Profile"
                style={styles.profileImage}
              />

              <h4 style={styles.name}>{userDetails.guardname}</h4>
              <p style={styles.role}>Guard</p>
            </div>

            {/* RIGHT SIDE DETAILS */}
            <div style={styles.rightBox}>
              {[
                ["Guard ID", userDetails.id],
                ["Username", userDetails.username],
                ["Email", userDetails.email],
                ["Contact No", userDetails.contactno],
                [
                  "Status",
                  <span
                    style={{
                      ...styles.statusBadge,
                      background:
                        userDetails.status === "Active"
                          ? "#28a745"
                          : "#dc3545",
                    }}
                  >
                    {userDetails.status}
                  </span>,
                ],
              ].map(([label, value], index) => (
                <div style={styles.detailRow} key={index}>
                  <div style={styles.detailLabel}>{label}:</div>
                  <div style={styles.detailValue}>{value}</div>
                </div>
              ))}

              {/* ACTION BUTTONS */}
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

/* ------------------- CSS ----------------- */

const styles = {
  // pageContainer: {
  //   padding: "30px",
  //   marginLeft: "270px", // space for sidebar
  //   background: "rgba(255,255,255,0.2)",
  //   backdropFilter: "blur(6px)",
  //   minHeight: "100vh",
  // },

  /* Header */
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
    margin: "5px 0 0",
    opacity: 0.85,
  },

  /* Card */
  card: {
    background: "rgba(255,255,255,0.55)",
    backdropFilter: "blur(8px)",
    borderRadius: "18px",
    padding: "25px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  },

  cardBody: {},

  profileRow: {
    display: "flex",
    gap: "40px",
    alignItems: "center",
    flexWrap: "wrap",
  },

  /* Left Box */
  leftBox: {
    textAlign: "center",
    flex: "1",
  },

  profileImage: {
    width: "155px",
    height: "155px",
    borderRadius: "50%",
    objectFit: "cover",
    boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
    marginBottom: "10px",
  },

  name: {
    margin: "10px 0 0",
    fontSize: "22px",
    fontWeight: "700",
  },

  role: {
    color: "#777",
    fontSize: "15px",
  },

  /* Right Box */
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
    color: "#444",
    fontWeight: "500",
  },

  statusBadge: {
    padding: "6px 12px",
    borderRadius: "20px",
    color: "white",
    fontWeight: "600",
  },

  /* Buttons */
  editBtn: {
    background: "#1e73be",
    color: "white",
    padding: "10px 18px",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    marginRight: "10px",
    cursor: "pointer",
  },

  passBtn: {
    background: "#6c757d",
    color: "white",
    padding: "10px 18px",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
  },
};
