import React, { useEffect, useState, useRef } from "react";
import { useVipStore } from "../context/VipContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function VipProfile() {
  const navigate = useNavigate();
  const { handleEdit, setSelectedVip, selectedVip } = useVipStore();

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);

  const fileRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  /* ---------------- FETCH PROFILE ---------------- */
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("vipToken");
      if (!token) return;

      const decoded = jwtDecode(token);
      const username = decoded.username || decoded.sub || decoded.email;

      const res = await axios.get(`${BASE_URL}/api/categories/profile`, {
        params: { username },
        headers: { Authorization: `Bearer ${token}` },
      });

      const profile = Array.isArray(res.data) ? res.data[0] : res.data;

      setUserDetails(profile);
      setSelectedVip(profile);
      localStorage.setItem("selectedVip", JSON.stringify(profile));

      //  SET PROFILE IMAGE FROM URL
      if (profile?.url) {
        setProfileImage(profile.url);
      }
    } catch (err) {
      console.log("Profile Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- IMAGE UPLOAD ---------------- */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedVip?.id) return;

    const token = localStorage.getItem("vipToken");
    const formData = new FormData();
    formData.append("imaged", file);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/profile/upload/${selectedVip.id}/vip`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // console.log("UPLOAD RESPONSE:",await res.data);

      //  YOUR API RETURNS res.data.url
      const imageUrl = res.data;

      if (imageUrl) {
        //  UPDATE UI INSTANTLY
        setProfileImage(imageUrl);

        //  UPDATE CONTEXT + LOCALSTORAGE
        const updatedVip = {
          ...selectedVip,
          url: imageUrl,
        };

        setSelectedVip(updatedVip);
        localStorage.setItem(
          "selectedVip",
          JSON.stringify(updatedVip)
        );
      }
    } catch (err) {
      console.log(
        "Image Upload Error:",
        err.response?.data || err.message
      );
    }
  };

  /* ---------------- IMAGE PREVIEW ---------------- */
  const openImage = () => {
    if (profileImage) {
      window.open(profileImage, "_blank");
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="text-center py-5">
        <i className="fa fa-spinner fa-spin fa-2x text-primary mb-3"></i>
        <h5>Loading profile...</h5>
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (!userDetails) {
    return (
      <div className="text-center py-5 text-danger">
        <h4>Unable to load profile.</h4>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>
          <i className="fa fa-user-circle me-2"></i> Vip Profile
        </h2>
        <p style={styles.headerSubtitle}>
          Overview of Vip account details
        </p>
      </div>

      <div style={styles.card}>
        <div style={styles.cardBody}>
          <div style={styles.profileRow}>
            {/* -------- IMAGE -------- */}
            <div style={styles.leftBox}>
              <div style={styles.imageWrapper}>
                {/*  CLICK IMAGE TO OPEN */}
                <img
                  src={
                    profileImage 
                  }
                  alt="Profile"
                  style={styles.profileImage}
                  onClick={openImage}
                />

                {/*  CAMERA BUTTON FOR UPLOAD */}
                <div
                  style={styles.cameraOverlay}
                  onClick={() => fileRef.current.click()}
                >
                  <i className="fa fa-camera"></i>
                </div>
              </div>

              {/*  HIDDEN INPUT */}
              <input
                type="file"
                accept="image/*"
                ref={fileRef}
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />

              <h4 style={styles.name}>{userDetails.name}</h4>
              <p style={styles.role}>Vip Detail</p>
            </div>

            {/* -------- DETAILS -------- */}
            <div style={styles.rightBox}>
              {[
                ["Vip ID", userDetails.id],
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
              ].map(([label, value], i) => (
                <div style={styles.detailRow} key={i}>
                  <div style={styles.detailLabel}>{label}:</div>
                  <div style={styles.detailValue}>{value}</div>
                </div>
              ))}

              <div style={{ marginTop: "20px" }}>
                <button
                  style={styles.editBtn}
                  onClick={() => {
                    handleEdit(userDetails);
                    navigate("/vipedit");
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

/* ---------------- STYLES ---------------- */
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
  headerTitle: { margin: 0, fontSize: "26px", fontWeight: "700" },
  headerSubtitle: { marginTop: "5px", opacity: 0.9 },

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

  leftBox: { flex: "1", textAlign: "center" },

  imageWrapper: {
    position: "relative",
    width: "140px",
    margin: "auto",
  },

  profileImage: {
    width: "140px",
    height: "140px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #4e54c8",
    cursor: "pointer",
  },

  cameraOverlay: {
    position: "absolute",
    bottom: "5px",
    right: "5px",
    background: "#1e73be",
    color: "white",
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    cursor: "pointer",
  },

  name: { fontSize: "22px", fontWeight: "700", marginTop: "10px" },
  role: { fontSize: "15px", color: "#777" },

  rightBox: { flex: "2" },

  detailRow: { display: "flex", marginBottom: "12px" },
  detailLabel: { width: "150px", fontWeight: "600", color: "#333" },
  detailValue: { flex: 1, fontWeight: "500", color: "#444" },

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
