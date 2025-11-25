import React, { useState, useEffect } from "react";
import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";
import { submit_gd_FormData, updateGuard } from "../api/vipform";
import { getAllCategory } from "../api/designation";
import { toast } from "react-toastify";

export default function GuardForm() {
  const [guardformData, setGuardFormData] = useState({
    id: "",
    name: "",
    email: "",
    username: "",
    password: "",
    rank: "",
    experience: "",
    contactno: "",
    status: "",
  });

  const [ranks, setRanks] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGuard, setSelectedGuard] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    const fetchRanks = async () => {
      try {
        if (getAllCategory) {
          const data = await getAllCategory();
          setRanks(data);
        } else {
          setRanks(["A Grade", "B Grade", "C Grade", "D Grade", "E Grade"]);
        }
      } catch (error) {
        console.error("Failed to fetch ranks:", error);
        setRanks(["A Grade", "B Grade", "C Grade", "D Grade", "E Grade"]);
      }
    };
    fetchRanks();
  }, []);

  const handle_gd_Change = (e) => {
    const { name, value } = e.target;
    setGuardFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handle_gd_Submit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await updateGuard(guardformData.id, guardformData);
        toast.success("Guard details updated successfully!");
      } else {
        await submit_gd_FormData(guardformData);
        toast.success("Guard registered successfully!");
      }
      resetForm();
      setRefreshTrigger((prev) => !prev);
    } catch (err) {
      console.error("Form submission failed:", err);
      alert("Error while saving data");
    }
  };

  const resetForm = () => {
    setGuardFormData({
      id: "",
      name: "",
      email: "",
      username: "",
      password: "",
      rank: "",
      experience: "",
      contactno: "",
      status: "",
    });
    setIsEditMode(false);
    setSelectedGuard(null);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* LEFT INFO PANEL */}
        <div style={styles.leftBox}>
          <h2 style={styles.leftTitle}>INFORMATION</h2>

          <p style={styles.desc}>
            Register Guard details for duty assignment, experience tracking,
            and verification.
          </p>

          <p style={styles.desc}>
            <b>Includes:</b> Full Name, Experience, Email ID, Rank & Contact No.
          </p>

          <button style={styles.haveBtn}>
            Need Help?
          </button>
        </div>

        {/* RIGHT FORM PANEL */}
        <div style={styles.formBox}>
          <h2 style={styles.formTitle}>
            {isEditMode ? "Edit Guard Details" : "Guard Registration Form"}
          </h2>

          <form onSubmit={handle_gd_Submit}>
            <FormInput
              label="Guard ID"
              name="id"
              type="text"
              value={guardformData.id}
              onChange={handle_gd_Change}
            />

            <FormInput
              label="Full Name"
              name="name"
              type="text"
              value={guardformData.name}
              onChange={handle_gd_Change}
            />

            <FormInput
              label="Email ID"
              name="email"
              type="email"
              value={guardformData.email}
              onChange={handle_gd_Change}
            />

            <FormInput
              label="Username"
              name="username"
              type="text"
              value={guardformData.username}
              onChange={handle_gd_Change}
            />

            <FormInput
              label="Password"
              name="password"
              type="text"
              value={guardformData.password}
              onChange={handle_gd_Change}
            />

            {/* RANK DROPDOWN */}
            <div className="form-group">
              <label>Guard Rank</label>
              <select
                name="rank"
                value={guardformData.rank}
                onChange={handle_gd_Change}
                style={styles.select}
                required
              >
                <option value="">Select Rank</option>
                {ranks.map((rank, i) => (
                  <option key={i} value={rank}>
                    {rank}
                  </option>
                ))}
              </select>
            </div>

            <FormInput
              label="Guard Experience (Years)"
              name="experience"
              type="number"
              value={guardformData.experience}
              onChange={handle_gd_Change}
            />

            <FormInput
              label="Contact Number"
              name="contactno"
              type="text"
              value={guardformData.contactno}
              onChange={handle_gd_Change}
            />
            {/* Grade DROPDOWN */}
            <div className="form-group">
              <label>Guard Status</label>
              <select
                name="status"
                value={guardformData.status}
                onChange={handle_gd_Change}
                style={styles.select}
                required
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <SubmitButton
              label={isEditMode ? "Update Guard Details" : "Submit Guard Details"}
            />

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

/* ----------------- CSS ----------------- */

const styles = {
  // page: {
  //   minHeight: "100vh",
  //   width: "100%",
  //   // background: "#7bd3e2",
  //   display: "flex",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   padding: "20px",
  // },

  container: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    overflow: "hidden",
    background: "white",
    flexWrap: "wrap",
    boxShadow: "0 0 25px rgba(0,0,0,0.15)",
  },

  leftBox: {
    width: "40%",
    minWidth: "300px",
    background: "#fafcfd",
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
