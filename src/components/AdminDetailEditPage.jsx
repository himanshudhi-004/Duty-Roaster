// components/AdminEditForm.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";
import { updateAdmin } from "../api/vipform";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";   // ✅ ADD THIS

export default function AdminEditForm({ adminData, onBack }) {
  const navigate = useNavigate(); // ✅ INITIALIZE NAVIGATE

  // -------- INITIAL STATE --------
  const [adminformData, setAdminFormData] = useState({
    ...adminData,
    adminPassword: "", // always start empty
  });

  // -------- INPUT CHANGE HANDLER --------
  const handle_ad_change = (e) => {
    const { name, value } = e.target;
    setAdminFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -------- SUBMIT --------
  const handle_ad_submit = async (e) => {
    e.preventDefault();

    const payload = { ...adminformData };

    // Don't send empty password
    if (!payload.adminPassword) delete payload.adminPassword;

    try {
      await updateAdmin(adminformData.id, payload);
      toast.success("Admin updated successfully!");

      // 🔥 Redirect to login after update
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      console.error(error);
      toast.error("Failed to update Admin");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* LEFT BLUE SIDEBAR */}
        <div style={styles.leftBox}>
          <h2 style={styles.leftTitle}>ADMIN PROFILE</h2>
          <p style={styles.desc}>
            Update your admin details securely and easily.
          </p>

          <button style={styles.haveBtn} onClick={onBack}>
            Back to Profile
          </button>
        </div>

        {/* RIGHT FORM */}
        <div style={styles.formBox}>
          <h2 style={styles.formTitle}>Edit Admin Details</h2>

          <form onSubmit={handle_ad_submit}>
            <FormInput
              label="Full Name"
              name="adminName"
              value={adminformData.adminName}
              onChange={handle_ad_change}
              isEdit={true}
            />

            <FormInput
              label="Username"
              name="adminUsername"
              value={adminformData.adminUsername}
              onChange={handle_ad_change}
              isEdit={true}
            />

            <FormInput
              label="Email"
              name="adminEmail"
              value={adminformData.adminEmail}
              onChange={handle_ad_change}
              isEdit={true}
            />

            {/* PASSWORD FIELD */}
            <FormInput
              label="Password"
              name="adminPassword"
              type="text"
              value={adminformData.adminPassword}
              onChange={handle_ad_change}
              isEdit={true}
            />

            <FormInput
              label="Contact Number"
              name="contactNo"
              value={adminformData.contactNo}
              onChange={handle_ad_change}
              isEdit={true}
            />

            <SubmitButton label="Update" />

            <button
              type="button"
              onClick={onBack}
              className="btn btn-secondary w-100 mt-3"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ---------- PROP VALIDATION ---------- */
AdminEditForm.propTypes = {
  adminData: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
};

/* ---------- STYLES ---------- */
const styles = {
  page: {
    width: "100%",
    background: "#f4f6f9",
  },

  container: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    boxShadow: "0 0 25px rgba(0,0,0,0.15)",
  },

  leftBox: {
    width: "40%",
    background: "#1e73be",
    padding: "40px",
    color: "white",
  },

  leftTitle: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "20px",
  },

  desc: {
    fontSize: "15px",
    marginBottom: "20px",
    lineHeight: "1.5",
  },

  haveBtn: {
    background: "white",
    color: "#1e73be",
    border: "none",
    padding: "12px 25px",
    borderRadius: "5px",
    cursor: "pointer",
  },

  formBox: {
    width: "60%",
    padding: "40px",
    background: "#fff",
  },

  formTitle: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#1e73be",
    marginBottom: "20px",
    textAlign: "left",
  },
};
