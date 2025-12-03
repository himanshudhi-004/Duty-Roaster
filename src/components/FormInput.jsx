import React from 'react';

export default function FormInput({ label, name, value, onChange, type = "text" }) {
  return (
    <div className="form-group" style={{ marginBottom: "15px" }}>
      <label htmlFor={name} style={{ display: "block", marginBottom: "5px" }}>{label}</label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
    </div>
  );
}