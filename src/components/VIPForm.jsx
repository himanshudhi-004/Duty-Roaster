// import React, { useState, useEffect } from "react";
// import FormInput from "./FormInput";
// import SubmitButton from "./SubmitButton";
// import { submit_vip_FormData, updateVip } from "../api/vipform";
// import { getAllDesignations } from "../api/designation";
// import { toast } from "react-toastify";

// export default function VIPForm() {
//   const [formData, setFormData] = useState({
//     id: "",
//     name: "",
//     email: "",
//     username: "",
//     password: "",
//     designation: "",
//     contactno: "",
//     status: "Inactive",
//   });

//   const [designations, setDesignations] = useState([]);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [selectedVip, setSelectedVip] = useState(null);
//   const [refreshTrigger, setRefreshTrigger] = useState(false);
//   const [otherDesignation, setOtherDesignation] = useState("");

//   useEffect(() => {
//     const fetchDesignations = async () => {
//       try {
//         const data = await getAllDesignations();
//         if (data) {
//           setDesignations(data);
//         } else {
//           setDesignations([
//             { id: 1, name: "Bollywood Actor" },
//             { id: 2, name: "Cricketers" },
//             { id: 3, name: "Chessmaster" },
//             { id: 4, name: "User" },
//           ]);
//         }
//       } catch (error) {
//         setDesignations([
//           { id: 1, name: "Bollywood Actor" },
//           { id: 2, name: "Cricketers" },
//           { id: 3, name: "Chessmaster" },
//           { id: 4, name: "User" },
//         ]);
//       }
//     };
//     fetchDesignations();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "designation") {
//       setFormData((prev) => ({ ...prev, designation: value }));
//       if (value !== "Other") {
//         setOtherDesignation("");
//       }
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const finalData = {
//       ...formData,
//       designation:
//         formData.designation === "Other"
//           ? otherDesignation
//           : formData.designation,
//       status: "Inactive",
//     };

//     try {
//       if (isEditMode) {
//         const res = await updateVip(formData.id, finalData);
//         toast.success(res?.message || "VIP detail Updated successfully!");
//       } else {
//         const res = await submit_vip_FormData(finalData);
//         toast.success(res?.message || "VIP registered successfully!");
//       }

//       resetForm();
//       setRefreshTrigger((prev) => !prev);
//     } catch (err) {
//       const errorMsg =
//         err?.response?.data?.message ||
//         err?.response?.data?.error ||
//         "Error while saving data";
//       toast.error(errorMsg);
//       console.error("Form submission failed:", err);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       id: "",
//       name: "",
//       email: "",
//       username: "",
//       password: "",
//       designation: "",
//       contactno: "",
//       status: "Inactive",
//     });
//     setOtherDesignation("");
//     setIsEditMode(false);
//     setSelectedVip(null);
//   };

//   return (
//     <div style={styles.page}>
//       <div style={styles.container}>
//         {/* LEFT PANEL */}
//         <div style={styles.leftBox}>
//           <h2 style={styles.leftTitle}>INFORMATION</h2>
//           <p style={styles.desc}>
//             Register VIP details for visit scheduling, security assignment, and
//             identity verification.
//           </p>
//           <p style={styles.desc}>
//             <b>Includes:</b> Full Name, Email, Contact Number, and Designation
//             Level.
//           </p>
//           <button style={styles.haveBtn}>Need Help?</button>
//         </div>

//         {/* RIGHT FORM PANEL */}
//         <div style={styles.formBox}>
//           <h2 style={styles.formTitle}>
//             {isEditMode ? "Edit VIP Details" : "VIP Visit Registration"}
//           </h2>

//           <form onSubmit={handleSubmit}>
//             <FormInput label="Full Name" name="name" type="text" value={formData.name} onChange={handleChange} required />

//             <FormInput label="Email ID" name="email" type="email" value={formData.email} onChange={handleChange} required />

//             <FormInput label="UserName" name="username" type="text" value={formData.username} onChange={handleChange} required />

//             <FormInput label="Password" name="password" type="text" value={formData.password} onChange={handleChange} required />

//             <div className="form-group">
//               <label>Designation Level</label>
//               <select name="designation" value={formData.designation} onChange={handleChange} style={styles.select} required>
//                 <option value="">Select Designation</option>
//                 {designations.map((d) => (
//                   <option key={d.id} value={d.name}>{d.name}</option>
//                 ))}
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             {formData.designation === "Other" && (
//               <FormInput
//                 label="Enter Other Designation"
//                 name="otherDesignation"
//                 type="text"
//                 value={otherDesignation}
//                 onChange={(e) => setOtherDesignation(e.target.value)}
//                 required
//               />
//             )}

//             <FormInput label="Contact Number" name="contactno" type="text" value={formData.contactno} onChange={handleChange} required />

//             <SubmitButton label={isEditMode ? "Update VIP Details" : "Submit VIP Details"} />

//             {isEditMode && (
//               <button type="button" onClick={resetForm} style={styles.cancelBtn}>
//                 Cancel Updation
//               </button>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ----------------- STYLES ----------------- */

// const styles = {
//   container: {
//     width: "100%",
//     minHeight: "94vh",
//     maxWidth: "100%",
//     display: "flex",
//     overflow: "hidden",
//     boxShadow: "0 0 25px rgba(0,0,0,0.15)",
//     background: "white",
//     flexWrap: "wrap",
//   },
//   leftBox: { width: "40%", minWidth: "300px", background: "#fafcfdff", padding: "40px", color: "black" },
//   leftTitle: { fontSize: "28px", fontWeight: "700", marginBottom: "20px" },
//   desc: { fontSize: "15px", marginBottom: "20px", lineHeight: "1.5" },
//   haveBtn: { background: "gray", color: "white", border: "none", padding: "12px 25px", borderRadius: "5px", cursor: "pointer", marginTop: "20px" },
//   formBox: { width: "60%", minWidth: "300px", padding: "40px", background: "white" },
//   formTitle: { fontSize: "26px", fontWeight: "700", color: "#1e73be", marginBottom: "20px", textAlign: "left" },
//   select: { width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", marginTop: "5px" },
//   cancelBtn: { marginTop: "10px", backgroundColor: "gray", color: "white", border: "none", padding: "10px", borderRadius: "5px", width: "100%" },
// };



import React, { useState, useEffect } from "react";
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
  const [otherDesignation, setOtherDesignation] = useState("");
  const [showOtherDesignation, setShowOtherDesignation] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const data = await getAllDesignations();
        setDesignations(
          data?.length
            ? data
            : [
                { id: 1, name: "Bollywood Actor" },
                { id: 2, name: "Cricketers" },
                { id: 3, name: "Chessmaster" },
                { id: 4, name: "User" },
              ]
        );
      } catch {
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
      setShowOtherDesignation(value === "Other");
      if (value !== "Other") setOtherDesignation("");
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
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
      setLoading(true);

      if (isEditMode) {
        const res = await updateVip(formData.id, finalData);
        toast.success(res?.message || "VIP details updated successfully!");
      } else {
        const res = await submit_vip_FormData(finalData);
        toast.success(res?.message || "VIP registered successfully!");
      }

      resetForm();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to save data";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
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
    setShowOtherDesignation(false);
    setIsEditMode(false);
  };

  return (
    <>
      <style>{CSS}</style>

      <div className="container">
        <div className="registration-card">
          {/* HEADER */}
          <div className="header-section">
            <div className="header-content">
              <h1 className="header-title">
                {isEditMode ? "Edit VIP Details" : "VIP Registration Form"}
              </h1>
              <p className="header-description">
                Register VIP visitors with complete personal details.
              </p>
            </div>

            <div className={`mode-display ${isEditMode ? "edit-mode" : ""}`}>
              {isEditMode ? "Edit Mode" : "Registration Mode"}
            </div>
          </div>

          {/* FORM */}
          <div className="form-section">
            <form onSubmit={handleSubmit}>
              <div className="form-layout">
                <div className="form-field">
                  <label className="field-label">Full Name *</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Email *</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Username *</label>
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Password *</label>
                  <input
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-field full-width-field">
                  <label className="field-label">Designation *</label>
                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Designation</option>
                    {designations.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                </div>

                {showOtherDesignation && (
                  <div className="other-rank-wrapper visible ">
                    <input className="w-100"
                      placeholder="Examples:- Bollywood Actor, Chessmaster, Minister, Cricketers, User, etc..."
                      value={otherDesignation}
                      onChange={(e) => setOtherDesignation(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="form-field">
                  <label className="field-label">Contact *</label>
                  <input
                    name="contactno"
                    value={formData.contactno}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="actions-section">
                <button
                  className="submit-btn"
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? "Processing..."
                    : isEditMode
                    ? "Update VIP"
                    : "Submit VIP"}
                </button>

                {isEditMode && (
                  <button
                    type="button"
                    className="cancel-btn visible"
                    onClick={resetForm}
                  >
                    Cancel Update
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------ SAME UI CSS AS GUARDFORM ------------------ */
const CSS = `
* { margin:0; padding:0; box-sizing:border-box; }

body {
  font-family: 'Segoe UI', sans-serif;
  background: linear-gradient(135deg,#f5f7fa,#e4e8f0);
}

.container {
  max-width:1100px;
  margin:auto;
  padding:20px;
}

.registration-card {
  background:#fff;
  border-radius:20px;
  box-shadow:0 15px 40px rgba(0,0,0,.1);
  overflow:hidden;
  border:1px solid #e5e7eb;
}

.header-section {
  background:linear-gradient(135deg,#1e3a8a,#3b82f6);
  padding:35px 40px 45px;
  color:#fff;
  position:relative;
}

.header-title { font-size:32px; font-weight:700; color:#fff; }

.header-description {
  margin-top:8px;
  opacity:0.9;
  max-width:600px;
}

.mode-display {
  position:absolute;
  right:40px;
  bottom:-18px;
  background:linear-gradient(135deg,#fbbf24,#f59e0b);
  padding:10px 22px;
  border-radius:50px;
  color:white;
  font-weight:600;
  border:2px solid white;
}

.mode-display.edit-mode {
  background:linear-gradient(135deg,#10b981,#059669);
}

.form-section { padding:50px 40px; }

.form-layout {
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:28px 32px;
}

.form-field { display:flex; flex-direction:column; }

.full-width-field { grid-column:span 2; }

.other-rank-wrapper {
  grid-column:span 2;
}

input, select {
  padding:15px 20px;
  border:2px solid #e5e7eb;
  border-radius:12px;
  font-size:15px;
}

.actions-section {
  margin-top:40px;
  display:flex;
  gap:12px;
}

.submit-btn {
  flex:1;
  background:#2563eb;
  color:white;
  padding:18px;
  border:none;
  border-radius:12px;
  font-weight:600;
}

.cancel-btn {
  background:#f3f4f6;
  padding:18px;
  border-radius:12px;
  border:2px solid #ddd;
}

/* ------------------ TABLET ------------------ */
@media (max-width: 768px) {
  .form-layout {
    grid-template-columns: 1fr;
  }

  .full-width-field,
  .other-rank-wrapper {
    grid-column: span 1;
  }

  .header-title {
    font-size:26px;
  }

  .mode-display {
    right:25px;
    bottom:-16px;
    font-size:13px;
    padding:8px 18px;
  }
}

/* ------------------ MOBILE ------------------ */
@media (max-width: 480px) {
  .container {
    padding:10px;
  }

  .header-section {
    padding:25px 25px 35px;
  }

  .form-section {
    padding:30px 25px;
  }

  .header-title {
    font-size:22px;
  }

  input, select {
    font-size:14px;
    padding:14px 16px;
  }

  .actions-section {
    flex-direction:column;
  }

  .submit-btn,
  .cancel-btn {
    width:100%;
  }

  .mode-display {
    position:relative;
    right:auto;
    bottom:auto;
    margin-top:12px;
  }
}
`;
