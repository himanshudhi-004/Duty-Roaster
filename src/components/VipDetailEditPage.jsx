import React, { useState } from "react";
import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";
import { updateVip } from "../api/vipform";
import { toast } from "react-toastify";

export default function VipEditForm({ vipData, onBack }) {
   // -------- INITIAL STATE --------
   const [vipformData, setVipformData] = useState({
     ...vipData,
     password: "",       // always start empty
   });
 
// -------- INPUT CHANGE HANDLER --------
  const handlechange = (e) => {
    const { name, value } = e.target;
    setVipformData((prev) => ({ ...prev, [name]: value }));
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    // Remove password if empty
    const payload = { ...vipformData };
    if (!payload.password) {
      delete payload.password;
    }

    try {
      await updateVip(vipformData.id, payload);
      toast.success("Vip updated successfully!");
      onBack();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update Vip");
    }
  };

  return (
    <form onSubmit={handlesubmit}>
      <h2>Edit VIP</h2>

      <FormInput
        label="Full Name"
        name="name"
        value={vipformData.name}
        onChange={handlechange}
        isEdit={true}
      />

      <FormInput
        label="Email"
        name="email"
        value={vipformData.email}
        onChange={handlechange}
        isEdit={true}
      />

      <FormInput
        label="Username"
        name="username"
        value={vipformData.username}
        onChange={handlechange}
        isEdit={true}
      />

      {/* PASSWORD FIELD (EMPTY ALWAYS ON LOAD) */}
      <FormInput
        label="Password"
        name="password"
        type="text"
        value={vipformData.password}   // empty initially, updates normally
        onChange={handlechange}
        isEdit={true}
      />


      <FormInput
        label="Contact No"
        name="contactno"
        value={vipformData.contactno}
        onChange={handlechange}
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
  );
}

const selectStyle = {
  width: "100%",
  padding: "8px",
  marginTop: "5px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};
