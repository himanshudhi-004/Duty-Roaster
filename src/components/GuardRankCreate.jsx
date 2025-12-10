// components/DesignationForm.jsx
import React, { useState } from "react";
import { createCategory } from "../api/designation";
import { toast } from "react-toastify";

export default function GuardRankCreate() {
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category.trim()) {
      alert("Please enter a Category name.");
      return;
    }

    try {
      setLoading(true);
      await createCategory({ name: category });
      toast.success("Rank created successfully!");
      setCategory("");
    } catch (error) {
      console.error("Error creating Rank:", error);
      toast.error("Failed to create category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Create Guard Grade</h2>
        <p style={subTitleStyle}>Add new guard rank or grade</p>

        <form onSubmit={handleSubmit}>
          <div style={inputGroup}>
            <label style={labelStyle}>Grade Name</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. A Grade, B Grade"
              style={inputStyle}
            />
          </div>

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "Saving..." : "Add Grade"}
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
