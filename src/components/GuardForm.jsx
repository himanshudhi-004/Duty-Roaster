// // import React, { useState, useEffect } from "react";
// // import FormInput from "./FormInput";
// // import SubmitButton from "./SubmitButton";
// // import { submit_gd_FormData, updateGuard } from "../api/vipform";
// // import { getAllCategory } from "../api/designation";
// // import { toast } from "react-toastify";

// // export default function GuardForm() {
// //   const [guardformData, setGuardFormData] = useState({
// //     id: "",
// //     name: "",
// //     email: "",
// //     username: "",
// //     password: "",
// //     rank: "",
// //     experience: "",
// //     contactno: "",
// //     status: "Inactive",
// //   });

// //   const [ranks, setRanks] = useState([]);
// //   const [isEditMode, setIsEditMode] = useState(false);
// //   const [selectedGuard, setSelectedGuard] = useState(null);
// //   const [refreshTrigger, setRefreshTrigger] = useState(false);
// //   const [otherRank, setOtherRank] = useState("");

// //   useEffect(() => {
// //     const fetchRanks = async () => {
// //       try {
// //         const data = await getAllCategory();
// //         if (data) {
// //           setRanks(data);
// //         } else {
// //           setRanks(["A Grade", "B Grade", "C Grade", "D Grade", "E Grade"]);
// //         }
// //       } catch (error) {
// //         console.error("Failed to fetch ranks:", error);
// //         setRanks(["A Grade", "B Grade", "C Grade", "D Grade", "E Grade"]);
// //       }
// //     };
// //     fetchRanks();
// //   }, []);

// //   const handle_gd_Change = (e) => {
// //     const { name, value } = e.target;

// //     if (name === "rank") {
// //       setGuardFormData((prev) => ({ ...prev, rank: value }));
// //       if (value !== "Other") {
// //         setOtherRank("");
// //       }
// //     } else {
// //       setGuardFormData((prev) => ({ ...prev, [name]: value }));
// //     }
// //   };

// //   const handle_gd_Submit = async (e) => {
// //     e.preventDefault();

// //     const finalData = {
// //       ...guardformData,
// //       rank: guardformData.rank === "Other" ? otherRank : guardformData.rank,
// //       status: "Inactive",
// //     };

// //     try {
// //       if (isEditMode) {
// //         const res = await updateGuard(finalData.id, finalData);
// //         toast.success(res?.message || "Guard details updated successfully!");
// //       } else {
// //         const res = await submit_gd_FormData(finalData);
// //         toast.success(res?.message || "Guard registered successfully!");
// //       }

// //       resetForm();
// //       setRefreshTrigger((prev) => !prev);
// //     } catch (err) {
// //       const errorMsg =
// //         err?.response?.data?.message ||
// //         err?.response?.data?.error ||
// //         "Error while saving data";
// //       toast.error(errorMsg);
// //       console.error("Form submission failed:", err);
// //     }
// //   };

// //   const resetForm = () => {
// //     setGuardFormData({
// //       id: "",
// //       name: "",
// //       email: "",
// //       username: "",
// //       password: "",
// //       rank: "",
// //       experience: "",
// //       contactno: "",
// //       status: "Inactive",
// //     });
// //     setOtherRank("");
// //     setIsEditMode(false);
// //     setSelectedGuard(null);
// //   };

// //   return (
// //     <div style={styles.page}>
// //       <div style={styles.container}>
// //         {/* LEFT INFO PANEL */}
// //         <div style={styles.leftBox}>
// //           <h2 style={styles.leftTitle}>INFORMATION</h2>

// //           <p style={styles.desc}>
// //             Register Guard details for duty assignment, experience tracking,
// //             and verification.
// //           </p>

// //           <p style={styles.desc}>
// //             <b>Includes:</b> Full Name, Experience, Email ID, Rank & Contact No.
// //           </p>

// //           <button style={styles.haveBtn}>Need Help?</button>
// //         </div>

// //         {/* RIGHT FORM PANEL */}
// //         <div style={styles.formBox}>
// //           <h2 style={styles.formTitle}>
// //             {isEditMode ? "Edit Guard Details" : "Guard Registration Form"}
// //           </h2>

// //           <form onSubmit={handle_gd_Submit}>
// //             <FormInput label="Full Name" name="name" type="text" value={guardformData.name} onChange={handle_gd_Change} required />

// //             <FormInput label="Email ID" name="email" type="email" value={guardformData.email} onChange={handle_gd_Change} required />

// //             <FormInput label="Username" name="username" type="text" value={guardformData.username} onChange={handle_gd_Change} required />

// //             <FormInput label="Password" name="password" type="text" value={guardformData.password} onChange={handle_gd_Change} required />

// //             <div className="form-group">
// //               <label>Guard Rank</label>
// //               <select name="rank" value={guardformData.rank} onChange={handle_gd_Change} style={styles.select} >
// //                 <option value="">Select Rank</option>
// //                 {ranks.map((rank, i) => (
// //                   <option key={i} value={rank}>{rank}</option>
// //                 ))}
// //                 <option value="Other">Other</option>
// //               </select>
// //             </div>

// //             {guardformData.rank === "Other" && (
// //               <FormInput
// //                 label="Enter Other Rank"
// //                 name="otherRank"
// //                 type="text"
// //                 value={otherRank}
// //                 onChange={(e) => setOtherRank(e.target.value)}
// //                 required
// //               />
// //             )}

// //             <FormInput label="Guard Experience (Years)" name="experience" type="number" value={guardformData.experience} onChange={handle_gd_Change} required />

// //             <FormInput label="Contact Number" name="contactno" type="text" value={guardformData.contactno} onChange={handle_gd_Change} required />

// //             <SubmitButton label={isEditMode ? "Update Guard Details" : "Submit Guard Details"} />

// //             {isEditMode && (
// //               <button type="button" onClick={resetForm} style={styles.cancelBtn}>
// //                 Cancel Updation
// //               </button>
// //             )}
// //           </form>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // /* ----------------- CSS ----------------- */

// // const styles = {
// //   container: {
// //     width: "100%",
// //     minHeight: "100vh",
// //     display: "flex",
// //     overflow: "hidden",
// //     background: "white",
// //     flexWrap: "wrap",
// //     boxShadow: "0 0 25px rgba(0,0,0,0.15)",
// //   },

// //   leftBox: {
// //     width: "40%",
// //     minWidth: "300px",
// //     background: "#fafcfd",
// //     padding: "40px",
// //     color: "black",
// //   },

// //   leftTitle: {
// //     fontSize: "28px",
// //     fontWeight: "700",
// //     marginBottom: "20px",
// //   },

// //   desc: {
// //     fontSize: "15px",
// //     marginBottom: "20px",
// //     lineHeight: "1.5",
// //   },

// //   haveBtn: {
// //     background: "gray",
// //     color: "white",
// //     border: "none",
// //     padding: "12px 25px",
// //     borderRadius: "5px",
// //     cursor: "pointer",
// //     marginTop: "20px",
// //   },

// //   formBox: {
// //     width: "60%",
// //     minWidth: "300px",
// //     padding: "40px",
// //     background: "white",
// //   },

// //   formTitle: {
// //     fontSize: "26px",
// //     fontWeight: "700",
// //     color: "#1e73be",
// //     marginBottom: "20px",
// //     textAlign: "left",
// //   },

// //   select: {
// //     width: "100%",
// //     padding: "10px",
// //     borderRadius: "5px",
// //     border: "1px solid #ccc",
// //     marginTop: "5px",
// //   },

// //   cancelBtn: {
// //     marginTop: "10px",
// //     backgroundColor: "gray",
// //     color: "white",
// //     border: "none",
// //     padding: "10px",
// //     borderRadius: "5px",
// //     width: "100%",
// //   },
// // };


// import React, { useState, useEffect } from "react";
// import FormInput from "./FormInput";
// import SubmitButton from "./SubmitButton";
// import { submit_gd_FormData, updateGuard } from "../api/vipform";
// import { getAllCategory } from "../api/designation";
// import { toast } from "react-toastify";

// export default function GuardForm() {
//   const [guardformData, setGuardFormData] = useState({
//     id: "",
//     name: "",
//     email: "",
//     username: "",
//     password: "",
//     rank: "",
//     experience: "",
//     contactno: "",
//     status: "Inactive",
//   });

//   const [ranks, setRanks] = useState([]);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [selectedGuard, setSelectedGuard] = useState(null);
//   const [refreshTrigger, setRefreshTrigger] = useState(false);
//   const [otherRank, setOtherRank] = useState("");

//   //  NEW STATES FOR ERRORS
//   const [emailError, setEmailError] = useState("");
//   const [contactError, setContactError] = useState("");

//   useEffect(() => {
//     const fetchRanks = async () => {
//       try {
//         const data = await getAllCategory();
//         if (data) {
//           setRanks(data);
//         } else {
//           setRanks(["A Grade", "B Grade", "C Grade", "D Grade", "E Grade"]);
//         }
//       } catch (error) {
//         console.error("Failed to fetch ranks:", error);
//         setRanks(["A Grade", "B Grade", "C Grade", "D Grade", "E Grade"]);
//       }
//     };
//     fetchRanks();
//   }, []);

//   //  UPDATED CHANGE HANDLER (ONLY EMAIL + CONTACT VALIDATION ADDED)
//   const handle_gd_Change = (e) => {
//     const { name, value } = e.target;

//     //  EMAIL VALIDATION (WITH DELAY)
//     if (name === "email") {
//       setGuardFormData((prev) => ({ ...prev, email: value }));

//       setTimeout(() => {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//         if (!emailRegex.test(value)) {
//           setEmailError(
//             "Invalid Email! Examples: example@gmail.com | user123@yahoo.com"
//           );
//         } else {
//           setEmailError("");
//         }
//       }, 1200);
//       return;
//     }

//     //  CONTACT NUMBER: ONLY 10 DIGITS
//     if (name === "contactno") {
//       if (/^\d{0,10}$/.test(value)) {
//         setGuardFormData((prev) => ({ ...prev, contactno: value }));

//         if (value.length !== 10) {
//           setContactError("Contact number must be exactly 10 digits");
//         } else {
//           setContactError("");
//         }
//       }
//       return;
//     }

//     //  RANK HANDLING (UNCHANGED)
//     if (name === "rank") {
//       setGuardFormData((prev) => ({ ...prev, rank: value }));
//       if (value !== "Other") {
//         setOtherRank("");
//       }
//     } else {
//       setGuardFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   //  UPDATED SUBMIT HANDLER (BLOCKS INVALID DATA)
//   const handle_gd_Submit = async (e) => {
//     e.preventDefault();

//     if (emailError || contactError) {
//       toast.error("Please fix the form errors before submission!");
//       return;
//     }

//     if (guardformData.contactno.length !== 10) {
//       toast.error("Contact number must be 10 digits!");
//       return;
//     }

//     const finalData = {
//       ...guardformData,
//       rank: guardformData.rank === "Other" ? otherRank : guardformData.rank,
//       status: "Inactive",
//     };

//     try {
//       if (isEditMode) {
//         const res = await updateGuard(finalData.id, finalData);
//         toast.success(res?.message || "Guard details updated successfully!");
//       } else {
//         const res = await submit_gd_FormData(finalData);
//         toast.success(res?.message || "Guard registered successfully!");
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
//     setGuardFormData({
//       id: "",
//       name: "",
//       email: "",
//       username: "",
//       password: "",
//       rank: "",
//       experience: "",
//       contactno: "",
//       status: "Inactive",
//     });
//     setOtherRank("");
//     setIsEditMode(false);
//     setSelectedGuard(null);
//     setEmailError("");
//     setContactError("");
//   };

//   return (
//     <div style={styles.page}>
//       <div style={styles.container}>
//         {/* LEFT INFO PANEL */}
//         <div style={styles.leftBox}>
//           <h2 style={styles.leftTitle}>INFORMATION</h2>

//           <p style={styles.desc}>
//             Register Guard details for duty assignment, experience tracking,
//             and verification.
//           </p>

//           <p style={styles.desc}>
//             <b>Includes:</b> Full Name, Experience, Email ID, Rank & Contact No.
//           </p>

//           <button style={styles.haveBtn}>Need Help?</button>
//         </div>

//         {/* RIGHT FORM PANEL */}
//         <div style={styles.formBox}>
//           <h2 style={styles.formTitle}>
//             {isEditMode ? "Edit Guard Details" : "Guard Registration Form"}
//           </h2>

//           <form onSubmit={handle_gd_Submit}>
//             <FormInput
//               label="Full Name"
//               name="name"
//               type="text"
//               value={guardformData.name}
//               onChange={handle_gd_Change}
//               required
//             />

//             <FormInput
//               label="Email ID"
//               name="email"
//               type="email"
//               value={guardformData.email}
//               onChange={handle_gd_Change}
//               required
//             />

//             {emailError && (
//               <p style={{ color: "red", fontSize: "13px", marginTop: "5px" }}>
//                 {emailError}
//               </p>
//             )}

//             <FormInput
//               label="Username"
//               name="username"
//               type="text"
//               value={guardformData.username}
//               onChange={handle_gd_Change}
//               required
//             />

//             <FormInput
//               label="Password"
//               name="password"
//               type="text"
//               value={guardformData.password}
//               onChange={handle_gd_Change}
//               required
//             />

//             <div className="form-group">
//               <label>Guard Rank</label>
//               <select
//                 name="rank"
//                 value={guardformData.rank}
//                 onChange={handle_gd_Change}
//                 style={styles.select}
//               >
//                 <option value="">Select Rank</option>
//                 {ranks.map((rank, i) => (
//                   <option key={i} value={rank}>
//                     {rank}
//                   </option>
//                 ))}
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             {guardformData.rank === "Other" && (
//               <FormInput
//                 label="Enter Other Rank"
//                 name="otherRank"
//                 type="text"
//                 value={otherRank}
//                 onChange={(e) => setOtherRank(e.target.value)}
//                 required
//               />
//             )}

//             <FormInput
//               label="Guard Experience (Years)"
//               name="experience"
//               type="number"
//               value={guardformData.experience}
//               onChange={handle_gd_Change}
//               required
//             />

//             <FormInput
//               label="Contact Number"
//               name="contactno"
//               type="text"
//               value={guardformData.contactno}
//               onChange={handle_gd_Change}
//               required
//             />

//             {contactError && (
//               <p style={{ color: "red", fontSize: "13px", marginTop: "5px" }}>
//                 {contactError}
//               </p>
//             )}

//             <SubmitButton
//               label={isEditMode ? "Update Guard Details" : "Submit Guard Details"}
//             />

//             {isEditMode && (
//               <button
//                 type="button"
//                 onClick={resetForm}
//                 style={styles.cancelBtn}
//               >
//                 Cancel Updation
//               </button>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ----------------- CSS ----------------- */

// const styles = {
//   container: {
//     width: "100%",
//     minHeight: "100vh",
//     display: "flex",
//     overflow: "hidden",
//     background: "white",
//     flexWrap: "wrap",
//     boxShadow: "0 0 25px rgba(0,0,0,0.15)",
//   },

//   leftBox: {
//     width: "40%",
//     minWidth: "300px",
//     background: "#fafcfd",
//     padding: "40px",
//     color: "black",
//   },

//   leftTitle: {
//     fontSize: "28px",
//     fontWeight: "700",
//     marginBottom: "20px",
//   },

//   desc: {
//     fontSize: "15px",
//     marginBottom: "20px",
//     lineHeight: "1.5",
//   },

//   haveBtn: {
//     background: "gray",
//     color: "white",
//     border: "none",
//     padding: "12px 25px",
//     borderRadius: "5px",
//     cursor: "pointer",
//     marginTop: "20px",
//   },

//   formBox: {
//     width: "60%",
//     minWidth: "300px",
//     padding: "40px",
//     background: "white",
//   },

//   formTitle: {
//     fontSize: "26px",
//     fontWeight: "700",
//     color: "#1e73be",
//     marginBottom: "20px",
//     textAlign: "left",
//   },

//   select: {
//     width: "100%",
//     padding: "10px",
//     borderRadius: "5px",
//     border: "1px solid #ccc",
//     marginTop: "5px",
//   },

//   cancelBtn: {
//     marginTop: "10px",
//     backgroundColor: "gray",
//     color: "white",
//     border: "none",
//     padding: "10px",
//     borderRadius: "5px",
//     width: "100%",
//   },
// };

import React, { useState, useEffect } from "react";
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
    experience: 0,
    contactno: "",
    status: "Inactive",
  });

  const [ranks, setRanks] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [otherRank, setOtherRank] = useState("");
  const [emailError, setEmailError] = useState("");
  const [contactError, setContactError] = useState("");
  const [showOtherRank, setShowOtherRank] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRanks = async () => {
      try {
        const data = await getAllCategory();
        setRanks(
          data?.length
            ? data
            : ["A Grade", "B Grade", "C Grade", "D Grade", "E Grade"]
        );
      } catch {
        setRanks(["A Grade", "B Grade", "C Grade", "D Grade", "E Grade"]);
      }
    };
    fetchRanks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setGuardFormData((prev) => ({ ...prev, email: value }));

      setTimeout(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailError(emailRegex.test(value) ? "" : "Invalid email format");
      }, 600);
      return;
    }

    if (name === "contactno") {
      if (/^\d{0,10}$/.test(value)) {
        setGuardFormData((prev) => ({ ...prev, contactno: value }));
        setContactError(
          value.length === 10 ? "" : "Contact number must be exactly 10 digits"
        );
      }
      return;
    }

    if (name === "rank") {
      setGuardFormData((prev) => ({ ...prev, rank: value }));
      setShowOtherRank(value === "Other");
      if (value !== "Other") setOtherRank("");
      return;
    }

    setGuardFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (emailError || contactError) {
      toast.error("Please fix all form errors");
      return;
    }

    const finalData = {
      ...guardformData,
      rank: guardformData.rank === "Other" ? otherRank : guardformData.rank,
      status: "Inactive",
    };

    try {
      setLoading(true);

      if (isEditMode) {
        const res = await updateGuard(finalData.id, finalData);
        toast.success(res?.message || "Guard updated successfully!");
      } else {
        const res = await submit_gd_FormData(finalData);
        toast.success(res?.message || "Guard registered successfully!");
      }

      resetForm();
    } catch (err) {
      //  SHOW REAL DATABASE ERROR HERE
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
    setGuardFormData({
      id: "",
      name: "",
      email: "",
      username: "",
      password: "",
      rank: "",
      experience: 0,
      contactno: "",
      status: "Inactive",
    });
    setOtherRank("");
    setShowOtherRank(false);
    setEmailError("");
    setContactError("");
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
                {isEditMode ? "Edit Guard Details" : "Guard Registration Form"}
              </h1>
              <p className="header-description">
                Register new security personnel with complete details.
              </p>
            </div>

            <div
              className={`mode-display ${isEditMode ? "edit-mode" : ""}`}
            >
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
                    value={guardformData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Email *</label>
                  <input
                    name="email"
                    value={guardformData.email}
                    onChange={handleChange}
                    required
                  />
                  {emailError && (
                    <div className="error-message visible">
                      {emailError}
                    </div>
                  )}
                </div>

                <div className="form-field">
                  <label className="field-label">Username *</label>
                  <input
                    name="username"
                    value={guardformData.username}
                    onChange={handleChange}
                    required
                    
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Password *</label>
                  <input
                    type="text"
                    name="password"
                    value={guardformData.password}
                    onChange={handleChange}
                      required
                    
                  />
                </div>

                <div className="form-field full-width-field">
                  <label className="field-label">Guard Rank *</label>
                  <select
                    name="rank"
                    value={guardformData.rank}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Rank</option>
                    {ranks.map((rank, i) => (
                      <option key={i}>{rank}</option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                </div>

                {showOtherRank && (
                  <div className="other-rank-wrapper visible">
                    <input
                      placeholder="Enter Custom Rank"
                      value={otherRank}
                      onChange={(e) => setOtherRank(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="form-field">
                  <label className="field-label">Experience *</label>
                  <input
                    type="number"
                    name="experience"
                    value={guardformData.experience}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Contact *</label>
                  <input
                    name="contactno"
                    value={guardformData.contactno}
                    onChange={handleChange}
                    required
                  />
                  {contactError && (
                    <div className="error-message visible">
                      {contactError}
                    </div>
                  )}
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
                    ? "Update Guard"
                    : "Submit Guard"}
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

/* ------------------ UI CSS ------------------ */
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

.error-message {
  color:red;
  font-size:13px;
  margin-top:6px;
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
