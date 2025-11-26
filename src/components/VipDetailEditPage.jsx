import React, { useState } from "react";
import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";
import { updateVip } from "../api/vipform";
import { toast } from "react-toastify";

export default function VipEditForm({ vipData, onBack }) {
  const [vipformData, setVipformData] = useState(vipData);

  const handle_vp_change = (e) => {
    const { name, value } = e.target;
    setVipformData((prev) => ({ ...prev, [name]: value }));
  };

  const handle_vp_submit = async (e) => {
    e.preventDefault();
    try {
      await updateVip(vipformData.id, vipformData);
      toast.success("Vip updated successfully!");
      onBack();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update Vip");
    }
  };

  return (
    <form onSubmit={handle_vp_submit}>
      <h2>Edit VIP</h2>

      <FormInput
        label="Full Name"
        name="name"
        value={vipformData.name}
        onChange={handle_vp_change}
      />

      <FormInput
        label="Email"
        name="email"
        value={vipformData.email}
        onChange={handle_vp_change}
      />

      <FormInput
        label="Username"
        name="username"
        value={vipformData.username}
        onChange={handle_vp_change}
      />

      {/* PASSWORD FIELD (EMPTY ALWAYS ON LOAD) */}
      <FormInput
        label="Password"
        name="Password"
        type="text"
        value={vipformData.Password}   // empty initially, updates normally
        onChange={handle_vp_change}
      />

      {/* RANK */}
      {/* <div className="form-group">
        <label>Vip Designation</label>
        <select
          name="rank"
          value={vipformData.designation || ""}
          onChange={handle_vp_change}
          style={selectStyle}
          required
        >
          <option value="">Select Rank</option>
          <option value="">A Grade</option>
          <option value="">B Grade</option>
          <option value="">C Grade</option>
          <option value="">D Grade</option>
          <option value="E Grade">E Grade</option>
        </select>
      </div> */}

      <FormInput
        label="Contact No"
        name="contactno"
        value={vipformData.contactno}
        onChange={handle_vp_change}
      />

      {/* ✅ STATUS FIXED */}
      <div className="form-group">
        <label>Vip Status</label>
        <select
          name="status"
          value={vipformData.status || ""}
          onChange={handle_vp_change}
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
