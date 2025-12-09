import React, { useEffect, useRef, useState } from "react";
import { useGuardStore } from "../context/GuardContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function GuardProfile() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const {
    selectedGuard,
    loading,
    fetchGuardProfile,
    handleEdit,
  } = useGuardStore();

  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    fetchGuardProfile();
  }, []);

  //  LOAD IMAGE FROM GUARD DATA JUST LIKE VIP
  useEffect(() => {
    if (selectedGuard?.url) {
      setProfileImage(selectedGuard.url);
    }
  }, [selectedGuard]);

  /*  IMAGE UPLOAD (VIP LOGIC + GUARD API) */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedGuard?.id) return;

    const token = localStorage.getItem("guardToken");

    const formData = new FormData();
    formData.append("imaged", file);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/profile/upload/${selectedGuard.id}/guard`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = res.data;

      if (imageUrl) {
        //  INSTANT UI UPDATE
        setProfileImage(imageUrl);

        //  UPDATE CONTEXT + LOCAL STORAGE
        const updatedGuard = {
          ...selectedGuard,
          url: imageUrl,
        };

        localStorage.setItem(
          "selectedGuard",
          JSON.stringify(updatedGuard)
        );
      }
    } catch (err) {
      console.log(
        "Image Upload Error:",
        err.response?.data || err.message
      );
    }
  };

  /*  IMAGE PREVIEW */
  const openImage = () => {
    if (profileImage) {
      window.open(profileImage, "_blank");
    }
  };

  if (loading) {
    return (
      <div style={styles.loaderWrap}>
        <i className="fa fa-spinner fa-spin fa-3x"></i>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!selectedGuard) {
    return (
      <div style={styles.errorWrap}>
        <h4>Unable to load profile.</h4>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>
          <i className="fa fa-shield-alt me-2"></i> Guard Profile
        </h2>
        <p style={styles.headerSubtitle}>
          Professional Identity & Account Info
        </p>
      </div>

      {/* Card */}
      <div style={styles.card}>
        <div style={styles.profileRow}>
          {/* LEFT SECTION */}
          <div style={styles.leftBox}>
            <div style={styles.imageWrapper}>
              <img
                src={
                  profileImage 
                }
                alt="Profile"
                style={styles.profileImage}
                onClick={openImage}
              />

              <div
                style={styles.uploadBtn}
                onClick={() => fileRef.current.click()}
              >
                <i className="fa fa-camera"></i>
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileRef}
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />

            <h4 style={styles.name}>{selectedGuard.name}</h4>
            <p style={styles.role}>Security Guard</p>
          </div>

          {/* RIGHT SECTION */}
          <div style={styles.rightBox}>
            {[
              ["Guard ID", selectedGuard.id],
              ["Username", selectedGuard.username],
              ["Email", selectedGuard.email],
              ["Contact No", selectedGuard.contactno],
              [
                "Status",
                <span
                  style={{
                    ...styles.statusBadge,
                    background:
                      selectedGuard.status === "Active"
                        ? "#28a745"
                        : "#dc3545",
                  }}
                >
                  {selectedGuard.status}
                </span>,
              ],
            ].map(([label, value], i) => (
              <div style={styles.detailRow} key={i}>
                <div style={styles.detailLabel}>{label}</div>
                <div style={styles.detailValue}>{value}</div>
              </div>
            ))}

            <div style={styles.actionRow}>
              <button
                style={styles.editBtn}
                onClick={() => {
                  handleEdit(selectedGuard);
                  navigate("/guardedit");
                }}
              >
                <i className="fa fa-edit me-2"></i> Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================== STYLES (UNCHANGED) ================== */
const styles = {
  pageContainer: {
    padding: "25px",
    minHeight: "92.5vh",
    background: "#f4f6f9",
  },
  header: {
    marginBottom: "25px",
    padding: "22px",
    background: "linear-gradient(135deg,#1e73be,#4facfe)",
    borderRadius: "16px",
    color: "white",
    boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  headerTitle: { margin: 0, fontSize: "26px", fontWeight: "800" },
  headerSubtitle: { marginTop: "6px", opacity: 0.9 },

  card: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
  },

  profileRow: {
    display: "flex",
    gap: "35px",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },

  leftBox: { flex: "1", minWidth: "260px", textAlign: "center" },

  imageWrapper: {
    position: "relative",
    width: "150px",
    height: "150px",
    margin: "0 auto",
  },

  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #1e73be",
    boxShadow: "0 8px 22px rgba(30,115,190,0.4)",
    cursor: "pointer",
  },

  uploadBtn: {
    position: "absolute",
    bottom: "8px",
    right: "8px",
    background: "#1e73be",
    color: "white",
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
  },

  name: { fontSize: "22px", fontWeight: "800", marginTop: "14px" },
  role: { fontSize: "15px", color: "#777" },

  rightBox: { flex: "2", minWidth: "280px" },

  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #eee",
  },

  detailLabel: { fontWeight: "600", color: "#555" },
  detailValue: { fontWeight: "600", color: "#222" },

  statusBadge: {
    padding: "6px 14px",
    borderRadius: "30px",
    color: "white",
    fontWeight: "700",
    fontSize: "13px",
  },

  actionRow: { marginTop: "25px", textAlign: "right" },

  editBtn: {
    background: "linear-gradient(135deg,#1e73be,#4facfe)",
    color: "white",
    padding: "12px 22px",
    borderRadius: "30px",
    border: "none",
    cursor: "pointer",
    fontWeight: "700",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
  },

  loaderWrap: {
    minHeight: "100vh",
    background: "#f4f6f9",
    color: "#1e73be",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },

  errorWrap: {
    minHeight: "100vh",
    background: "#f4f6f9",
    color: "#dc3545",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
