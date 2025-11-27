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
    status: "",
  });

  const [designations, setDesignations] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedVip, setSelectedVip] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const data = await getAllDesignations();
        if (getAllDesignations) {
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await updateVip(formData.id, formData);
        toast.success("VIP detail Updated successfully!");
      } else {
        await submit_vip_FormData(formData);

        toast.success("VIP registered successfully!");
      }
      resetForm();
      setRefreshTrigger((prev) => !prev);
    } catch (err) {
      console.error("Form submission failed:", err);
      alert("Error while saving data");
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
      status: "",
    });
    setIsEditMode(false);
    setSelectedVip(null);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* LEFT BLUE INFO PANEL */}
        <div style={styles.leftBox}>
          <h2 style={styles.leftTitle}>INFORMATION</h2>

          <p style={styles.desc}>
            Register VIP details for visit scheduling, security assignment, and
            identity verification.
          </p>

          <p style={styles.desc}>
            <b>Includes:</b> Full Name, Email, Contact Number, and Designation Level.
          </p>

          <button style={styles.haveBtn}>
            Need Help?
          </button>
        </div>

        {/* RIGHT WHITE FORM PANEL */}
        <div style={styles.formBox}>
          <h2 style={styles.formTitle}>
            {isEditMode ? "Edit VIP Details" : "VIP Visit Registration"}
          </h2>

          <form onSubmit={handleSubmit}>
            <FormInput
              label="VIP ID"
              name="id"
              type="text"
              value={formData.id}
              onChange={handleChange}
            />

            <FormInput
              label="Full Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
            />

            <FormInput
              label="Email ID"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />

            <FormInput
              label="UserName"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
            />

            <FormInput
              label="Password"
              name="password"
              type="text"
              value={formData.password}
              onChange={handleChange}
            />

            {/* DESIGNATION DROPDOWN */}
            <div className="form-group">
              <label>Designation Level</label>
              <select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                style={styles.select}
                required
              >
                <option value="">Select Designation</option>
                {designations.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <FormInput
              label="Contact Number"
              name="contactno"
              type="text"
              value={formData.contactno}
              onChange={handleChange}
            />
            {/* Grade DROPDOWN */}
            <div className="form-group">
              <label>Vip Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={styles.select}
                required
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <SubmitButton label={isEditMode ? "Update VIP Details" : "Submit VIP Details"} />

            {isEditMode && (<button type="button" onClick={resetForm} style={styles.cancelBtn}>Cancel Updation</button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

/* ----------------- RESPONSIVE FULL-SCREEN STYLES ----------------- */

const styles = {
  // page: {
  //   minHeight: "100vh",
  //   width: "100%",
  //   background: "#7bd3e2",
  //   display: "flex",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   padding: "20px",
  // },

  container: {
    width: "100%",
    minHeight: "100vh",
    maxWidth: "100%",
    display: "flex",
    // borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 0 25px rgba(0,0,0,0.15)",
    background: "white",
    flexWrap: "wrap", // ⭐ Responsive
  },

  leftBox: {
    width: "40%",
    minWidth: "300px",
    background: "#fafcfdff",
    padding: "40px",
    color: "black",
  },

  leftTitle: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "20px",
  },

  desc: {
    fontSize: "15px",
    marginBottom: "20px",
    lineHeight: "1.5",
  },

  haveBtn: {
    background: "gray",
    color: "white",
    border: "none",
    padding: "12px 25px",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
  },

  formBox: {
    width: "60%",
    minWidth: "300px",
    padding: "40px",
    background: "white",
  },

  formTitle: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#1e73be",
    marginBottom: "20px",
    textAlign: "left",
  },

  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginTop: "5px",
  },

  cancelBtn: {
    marginTop: "10px",
    backgroundColor: "gray",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "5px",
    width: "100%",
  },
};
