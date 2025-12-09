// components/AdminEditForm.jsx
import React, { useState } from "react";
import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";
import { updateUser } from "../api/vipform";
import { toast } from "react-toastify";

export default function UserDetailEditPage({ userData, onBack }) {

  // -------- INITIAL STATE --------
  const [userformData, setUserFormData] = useState({
    ...userData,
    password: "",       // always start empty
  });

  // -------- INPUT CHANGE HANDLER --------
  const handle_us_change = (e) => {
    const { name, value } = e.target;
    setUserFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -------- SUBMIT --------
  const handle_us_submit = async (e) => {
    e.preventDefault();

    // Remove password if empty
    const payload = { ...userformData };
    if (!payload.password) {
      delete payload.password;
    }

    try {
      await updateUser(userformData.id, payload);
      toast.success("User updated successfully!");
      onBack();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update User");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* LEFT BLUE SIDEBAR */}
        <div style={styles.leftBox}>
          <h2 style={styles.leftTitle}>User PROFILE</h2>
          <p style={styles.desc}>Update your user details securely and easily.</p>

          <button style={styles.haveBtn} onClick={onBack}>
            Back to Profile
          </button>
        </div>

        {/* RIGHT FORM */}
        <div style={styles.formBox}>
          <h2 style={styles.formTitle}>Edit User Details</h2>

          <form onSubmit={handle_us_submit}>

            <FormInput
              label="Full Name"
              name="name"
              value={userformData.name}
              onChange={handle_us_change}
              isEdit={true}
            />

            <FormInput
              label="Username"
              name="username"
              value={userformData.username}
              onChange={handle_us_change}
              isEdit={true}
            />

            <FormInput
              label="Email"
              name="email"
              value={userformData.email}
              onChange={handle_us_change}
              isEdit={true}
            />

            {/* PASSWORD FIELD (EMPTY ALWAYS ON LOAD) */}
            <FormInput
              label="Password"
              name="password"
              type="text"
              value={userformData.password}   // empty initially, updates normally
              onChange={handle_us_change}
              isEdit={true}
            />

            <FormInput
              label="Contact Number"
              name="contactno"
              value={userformData.contactno}
              onChange={handle_us_change}
              isEdit={true}
            />

             <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={userformData.status}
                onChange={handle_us_change}
                style={styles.select}
                isEdit={true}
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="InActive">InActive</option>
              </select>
            </div>

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

// ---------- STYLES ----------
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
