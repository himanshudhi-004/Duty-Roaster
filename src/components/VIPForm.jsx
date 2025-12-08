import React, { useState, useEffect } from "react";
import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";
import { submit_vip_FormData, updateVip } from "../api/vipform";
import { getAllDesignations } from "../api/designation";
import { toast } from "react-toastify";

export default function VIPForm() {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    username: "",
    password: "",
    designation: "",
    contactno: "",
    status: "Inactive",
  });

  const [designations, setDesignations] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedVip, setSelectedVip] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [otherDesignation, setOtherDesignation] = useState("");

  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const data = await getAllDesignations();
        if (data) {
          setDesignations(data);
        } else {
          setDesignations([
            { id: 1, name: "Bollywood Actor" },
            { id: 2, name: "Cricketers" },
            { id: 3, name: "Chessmaster" },
            { id: 4, name: "User" },
          ]);
        }
      } catch (error) {
        setDesignations([
          { id: 1, name: "Bollywood Actor" },
          { id: 2, name: "Cricketers" },
          { id: 3, name: "Chessmaster" },
          { id: 4, name: "User" },
        ]);
      }
    };
    fetchDesignations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "designation") {
      setFormData((prev) => ({ ...prev, designation: value }));
      if (value !== "Other") {
        setOtherDesignation("");
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalData = {
      ...formData,
      designation:
        formData.designation === "Other"
          ? otherDesignation
          : formData.designation,
      status: "Inactive",
    };

    try {
      if (isEditMode) {
        const res = await updateVip(formData.id, finalData);
        toast.success(res?.message || "VIP detail Updated successfully!");
      } else {
        const res = await submit_vip_FormData(finalData);
        toast.success(res?.message || "VIP registered successfully!");
      }

      resetForm();
      setRefreshTrigger((prev) => !prev);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Error while saving data";
      toast.error(errorMsg);
      console.error("Form submission failed:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      email: "",
      username: "",
      password: "",
      designation: "",
      contactno: "",
      status: "Inactive",
    });
    setOtherDesignation("");
    setIsEditMode(false);
    setSelectedVip(null);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* LEFT PANEL */}
        <div style={styles.leftBox}>
          <h2 style={styles.leftTitle}>INFORMATION</h2>
          <p style={styles.desc}>
            Register VIP details for visit scheduling, security assignment, and
            identity verification.
          </p>
          <p style={styles.desc}>
            <b>Includes:</b> Full Name, Email, Contact Number, and Designation
            Level.
          </p>
          <button style={styles.haveBtn}>Need Help?</button>
        </div>

        {/* RIGHT FORM PANEL */}
        <div style={styles.formBox}>
          <h2 style={styles.formTitle}>
            {isEditMode ? "Edit VIP Details" : "VIP Visit Registration"}
          </h2>

          <form onSubmit={handleSubmit}>
            <FormInput label="Full Name" name="name" type="text" value={formData.name} onChange={handleChange} required />

            <FormInput label="Email ID" name="email" type="email" value={formData.email} onChange={handleChange} required />

            <FormInput label="UserName" name="username" type="text" value={formData.username} onChange={handleChange} required />

            <FormInput label="Password" name="password" type="text" value={formData.password} onChange={handleChange} required />

            <div className="form-group">
              <label>Designation Level</label>
              <select name="designation" value={formData.designation} onChange={handleChange} style={styles.select} required>
                <option value="">Select Designation</option>
                {designations.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>

            {formData.designation === "Other" && (
              <FormInput
                label="Enter Other Designation"
                name="otherDesignation"
                type="text"
                value={otherDesignation}
                onChange={(e) => setOtherDesignation(e.target.value)}
                required
              />
            )}

            <FormInput label="Contact Number" name="contactno" type="text" value={formData.contactno} onChange={handleChange} required />

            <SubmitButton label={isEditMode ? "Update VIP Details" : "Submit VIP Details"} />

            {isEditMode && (
              <button type="button" onClick={resetForm} style={styles.cancelBtn}>
                Cancel Updation
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

/* ----------------- STYLES ----------------- */

const styles = {
  container: {
    width: "100%",
    minHeight: "94vh",
    maxWidth: "100%",
    display: "flex",
    overflow: "hidden",
    boxShadow: "0 0 25px rgba(0,0,0,0.15)",
    background: "white",
    flexWrap: "wrap",
  },
  leftBox: { width: "40%", minWidth: "300px", background: "#fafcfdff", padding: "40px", color: "black" },
  leftTitle: { fontSize: "28px", fontWeight: "700", marginBottom: "20px" },
  desc: { fontSize: "15px", marginBottom: "20px", lineHeight: "1.5" },
  haveBtn: { background: "gray", color: "white", border: "none", padding: "12px 25px", borderRadius: "5px", cursor: "pointer", marginTop: "20px" },
  formBox: { width: "60%", minWidth: "300px", padding: "40px", background: "white" },
  formTitle: { fontSize: "26px", fontWeight: "700", color: "#1e73be", marginBottom: "20px", textAlign: "left" },
  select: { width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", marginTop: "5px" },
  cancelBtn: { marginTop: "10px", backgroundColor: "gray", color: "white", border: "none", padding: "10px", borderRadius: "5px", width: "100%" },
};
