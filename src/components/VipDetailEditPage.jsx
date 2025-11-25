import React, { useState } from "react";
import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";
import { updateVip } from "../api/vipform";
import { toast } from "react-toastify";

export default function VIPEditForm({ vipData, onBack }) {
  const [formData, setFormData] = useState(vipData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateVip(formData.id, formData);
      toast.success("VIP updated successfully!");
      onBack();
    } catch (error) {
      console.error(error);
      toast.success("Failed to update VIP");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit VIP</h2>
      <FormInput label="Full Name" name="name" value={formData.name} onChange={handleChange} />
      <FormInput label="Email" name="email" value={formData.email} onChange={handleChange} />
      <FormInput label="Username" name="username" value={formData.username} onChange={handleChange} />
      <FormInput label="Password" name="password" value={formData.password} onChange={handleChange} />
      <div className="form-group">
          <label>Designation Level</label>
          <select name="designation" value={formData.designation} onChange={handleChange} style={{   width: "100%",   padding: "8px",   marginTop: "5px",   borderRadius: "5px",   border: "1px solid #ccc", }} required >
            <option value="">Select Designation</option>
            <option value="Bollywood Actor">Bollywood Actor</option>
            <option value="Cricketers">Cricketers</option>
            <option value="Chessmaster">Chessmaster</option>
            <option value="User">User</option>
          </select>
        </div>
      <FormInput label="Contact No" name="contactno" value={formData.contactno} onChange={handleChange} />
       {/* Grade DROPDOWN */}
             <div className="form-group">
              <label>Vip Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
      <SubmitButton label="Update" />
       <button type="button" onClick={onBack} className="btn btn-secondary w-100 mt-3">Cancel</button>
    </form>
  );
}
