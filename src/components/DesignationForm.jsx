// src/components/DesignationForm.jsx
import React, { useState } from "react";
import { submit_vip_FormData } from "../api/vipform";
import { toast } from "react-toastify";

export default function DesignationForm() {
  const [designation, setDesignation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!designation.trim()) {
      alert("Please enter a designation name.");
      return;
    }

    try {
      setLoading(true);
      await submit_vip_FormData({ name: designation });
      toast.success("Designation created successfully!");
      setDesignation("");
    } catch (error) {
      console.error("Error creating designation:", error);
      toast.error("Failed to create designation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Create VIP Designation</h2>
        <p style={subTitleStyle}>Add a new VIP role or title</p>

        <form onSubmit={handleSubmit}>
          <div style={inputGroup}>
            <label style={labelStyle}>Designation Name</label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="e.g. Minister, Governor, Chief Guest"
              style={inputStyle}
            />
          </div>

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "Saving..." : "Add Designation"}
          </button>
        </form>
      </div>
    </div>
  );
}

/*  Styles */

const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  background: "linear-gradient(135deg, #e3f2fd, #f5f5f5)",
};

const cardStyle = {
  width: "100%",
  maxWidth: "420px",
  background: "#fff",
  padding: "30px",
  borderRadius: "14px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
};

const titleStyle = {
  textAlign: "center",
  marginBottom: "5px",
  color: "#2c3e50",
};

const subTitleStyle = {
  textAlign: "center",
  color: "#7f8c8d",
  marginBottom: "25px",
  fontSize: "14px",
};

const inputGroup = {
  marginBottom: "20px",
};

const labelStyle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#34495e",
  marginBottom: "6px",
  display: "block",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  outline: "none",
  fontSize: "14px",
  transition: "0.3s",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "linear-gradient(135deg, #007bff, #0056b3)",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "0.3s",
  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
};
