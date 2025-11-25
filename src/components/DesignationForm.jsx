// src/components/DesignationForm.jsx
import React, { useState } from "react";
import { submit_vip_FormData } from "../api/vipform"; //  use existing API

export default function DesignationForm() {
  const [designation, setDesignation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!designation.trim()) {
      alert("Please enter a designation name.");
      return;
    }

    try {
      //  Using same /api/categories endpoint as VIP form
      await submit_vip_FormData({ name: designation });

      alert("Designation created successfully!");
      setDesignation("");
    } catch (error) {
      console.error("Error creating designation:", error);
      alert("Failed to create designation.");
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "600px",
        margin: "auto",
        background: "white",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Create New VIP Designation
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Designation Name</label>
          <input
            type="text"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            placeholder="Enter designation (e.g., Minister)"
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            marginTop: "15px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: "5px",
            width: "100%",
            cursor: "pointer",
          }}
        >
          Add Designation
        </button>
      </form>
    </div>
  );
}
