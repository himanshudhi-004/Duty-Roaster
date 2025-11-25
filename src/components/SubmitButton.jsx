import React from "react";

export default function SubmitButton({ label, disabled }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      style={{
        width: "100%",
        padding: "10px",
        backgroundColor: disabled ? "gray" : "#007BFF",
        color: "white",
        border: "none",
        borderRadius: "5px",
        fontSize: "16px",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {label}
    </button>
  );
}
