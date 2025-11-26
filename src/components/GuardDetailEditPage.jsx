import React, { useState } from "react";
import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";
import { updateGuard } from "../api/vipform";
import { toast } from "react-toastify";

export default function GuardEditForm({ guardData, onBack }) {
  const [guardformData, setGuardFormData] = useState(guardData);

  const handle_gd_change = (e) => {
    const { name, value } = e.target;
    setGuardFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handle_gd_submit = async (e) => {
    e.preventDefault();
    try {
      await updateGuard(guardformData.id, guardformData);
      toast.success("Guard updated successfully!");
      onBack();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update Guard");
    }
  };

  return (
    <form onSubmit={handle_gd_submit}>
      <h2>Edit Guard</h2>

      <FormInput
        label="Full Name"
        name="name"
        value={guardformData.name}
        onChange={handle_gd_change}
      />

      <FormInput
        label="Email"
        name="email"
        value={guardformData.email}
        onChange={handle_gd_change}
      />

      <FormInput
        label="Username"
        name="username"
        value={guardformData.username}
        onChange={handle_gd_change}
      />

      {/* PASSWORD FIELD (EMPTY ALWAYS ON LOAD) */}
      <FormInput
        label="Password"
        name="Password"
        type="text"
        value={guardformData.Password}   // empty initially, updates normally
        onChange={handle_gd_change}
      />

      {/* RANK */}
      <div className="form-group">
        <label>Guard Rank</label>
        <select
          name="rank"
          value={guardformData.rank || ""}
          onChange={handle_gd_change}
          style={selectStyle}
          required
        >
          <option value="">Select Rank</option>
          <option value="A Grade">A Grade</option>
          <option value="B Grade">B Grade</option>
          <option value="C Grade">C Grade</option>
          <option value="D Grade">D Grade</option>
          <option value="E Grade">E Grade</option>
        </select>
      </div>

      <FormInput
        label="Guard Experience"
        name="experience"
        type="number"
        value={guardformData.experience || ""}
        onChange={handle_gd_change}
      />

      <FormInput
        label="Contact No"
        name="contactno"
        value={guardformData.contactno}
        onChange={handle_gd_change}
      />

      {/* ✅ STATUS FIXED */}
      <div className="form-group">
        <label>Guard Status</label>
        <select
          name="status"
          value={guardformData.status || ""}
          onChange={handle_gd_change}
          style={selectStyle}
          required
        >
          <option value="">Select status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
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
  );
}

const selectStyle = {
  width: "100%",
  padding: "8px",
  marginTop: "5px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};
