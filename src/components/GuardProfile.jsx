//------------------------------------3----------------------------------------

import React, { useEffect } from "react";
import { useGuardStore } from "../context/GuardContext";
import { useNavigate } from "react-router-dom";

export default function GuardProfile() {
  const navigate = useNavigate();
  const {
    selectedGuard,
    profileImage,
    loading,
    fetchGuardProfile,
    uploadGuardImage,
    handleEdit,
  } = useGuardStore();

  useEffect(() => {
    fetchGuardProfile();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    uploadGuardImage(file);
  };

  if (loading) {
    return (
      <div style={styles.loaderWrap}>
        <i className="fa fa-spinner fa-spin fa-3x"></i>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!selectedGuard) {
    return (
      <div style={styles.errorWrap}>
        <h4>Unable to load profile.</h4>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>
          <i className="fa fa-shield-alt me-2"></i> Guard Profile
        </h2>
        <p style={styles.headerSubtitle}>Professional Identity & Account Info</p>
      </div>

      {/* Card */}
      <div style={styles.card}>
        <div style={styles.profileRow}>
          {/* LEFT SECTION */}
          <div style={styles.leftBox}>
            <div style={styles.imageWrapper}>
              <img
                src={
                  profileImage ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="Profile"
                style={styles.profileImage}
              />
              <label style={styles.uploadBtn}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  hidden
                />
                <i className="fa fa-camera"></i>
              </label>
            </div>

            <h4 style={styles.name}>{selectedGuard.name}</h4>
            <p style={styles.role}>Security Guard</p>
          </div>

          {/* RIGHT SECTION */}
          <div style={styles.rightBox}>
            {[
              ["Guard ID", selectedGuard.id],
              ["Username", selectedGuard.username],
              ["Email", selectedGuard.email],
              ["Contact No", selectedGuard.contactno],
              [
                "Status",
                <span
                  style={{
                    ...styles.statusBadge,
                    background:
                      selectedGuard.status === "Active"
                        ? "#28a745"
                        : "#dc3545",
                  }}
                >
                  {selectedGuard.status}
                </span>,
              ],
            ].map(([label, value], i) => (
              <div style={styles.detailRow} key={i}>
                <div style={styles.detailLabel}>{label}</div>
                <div style={styles.detailValue}>{value}</div>
              </div>
            ))}

            <div style={styles.actionRow}>
              <button
                style={styles.editBtn}
                onClick={() => {
                  handleEdit(selectedGuard);
                  navigate("/guardedit");
                }}
              >
                <i className="fa fa-edit me-2"></i> Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================== WHITE MODERN RESPONSIVE THEME ================== */
const styles = {
  pageContainer: {
    padding: "25px",
    minHeight: "92.5vh",
    background: "#f4f6f9",
  },

  header: {
    marginBottom: "25px",
    padding: "22px",
    background: "linear-gradient(135deg,#1e73be,#4facfe)",
    borderRadius: "16px",
    color: "white",
    boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  headerTitle: { margin: 0, fontSize: "26px", fontWeight: "800" },
  headerSubtitle: { marginTop: "6px", opacity: 0.9 },

  card: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
  },

  profileRow: {
    display: "flex",
    gap: "35px",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },

  leftBox: {
    flex: "1",
    minWidth: "260px",
    textAlign: "center",
  },

  imageWrapper: {
    position: "relative",
    width: "150px",
    height: "150px",
    margin: "0 auto",
  },

  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #1e73be",
    boxShadow: "0 8px 22px rgba(30,115,190,0.4)",
  },

  uploadBtn: {
    position: "absolute",
    bottom: "8px",
    right: "8px",
    background: "#1e73be",
    color: "white",
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
  },

  name: {
    fontSize: "22px",
    fontWeight: "800",
    marginTop: "14px",
    color: "#222",
  },

  role: {
    fontSize: "15px",
    color: "#777",
  },

  rightBox: {
    flex: "2",
    minWidth: "280px",
  },

  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #eee",
  },

  detailLabel: {
    fontWeight: "600",
    color: "#555",
  },

  detailValue: {
    fontWeight: "600",
    color: "#222",
  },

  statusBadge: {
    padding: "6px 14px",
    borderRadius: "30px",
    color: "white",
    fontWeight: "700",
    fontSize: "13px",
  },

  actionRow: {
    marginTop: "25px",
    textAlign: "right",
  },

  editBtn: {
    background: "linear-gradient(135deg,#1e73be,#4facfe)",
    color: "white",
    padding: "12px 22px",
    borderRadius: "30px",
    border: "none",
    cursor: "pointer",
    fontWeight: "700",
    letterSpacing: "0.4px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
  },

  loaderWrap: {
    minHeight: "100vh",
    background: "#f4f6f9",
    color: "#1e73be",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },

  errorWrap: {
    minHeight: "100vh",
    background: "#f4f6f9",
    color: "#dc3545",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};



//-------------------------------------------1-------------------------------------
// import React, { useEffect, useState } from "react";
// import { useGuardStore } from "../context/GuardContext";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

// export default function GuardProfile() {
//   const navigate = useNavigate();
//   const { handleEdit, setSelectedGuard } = useGuardStore();

//   const [userDetails, setUserDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [profileImage, setProfileImage] = useState(null);

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const token = localStorage.getItem("guardToken");
//       if (!token) return;

//       const decoded = jwtDecode(token);
//       const username = decoded.username || decoded.sub || decoded.email;

//       const res = await axios.get(`${BASE_URL}/api/officer/profile`, {
//         params: { username },
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const profile = Array.isArray(res.data) ? res.data[0] : res.data;

//       setUserDetails(profile);
//       setSelectedGuard(profile); //  STORE IN CONTEXT

//       if (profile?.image) {
//         setProfileImage(`${BASE_URL}/${profile.image}`);
//       }
//     } catch (err) {
//       console.log("Profile Fetch Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------------- IMAGE UPLOAD ----------------- */
//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const token = localStorage.getItem("guardToken");
//     const formData = new FormData();
//     formData.append("image", file);

//     try {
//       const res = await axios.post(
//         `${BASE_URL}/api/officer/upload-profile-image/${userDetails.id}`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       setProfileImage(`${BASE_URL}/${res.data.image}`);
//     } catch (err) {
//       console.log("Image Upload Error:", err);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="text-center py-5">
//         <i className="fa fa-spinner fa-spin fa-2x text-primary mb-3"></i>
//         <h5>Loading profile...</h5>
//       </div>
//     );
//   }

//   if (!userDetails) {
//     return (
//       <div className="text-center py-5 text-danger">
//         <h4>Unable to load profile.</h4>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.pageContainer}>
//       <div style={styles.header}>
//         <h2 style={styles.headerTitle}>
//           <i className="fa fa-user-circle me-2"></i> Guard Profile
//         </h2>
//         <p style={styles.headerSubtitle}>Overview of Guard account details</p>
//       </div>

//       <div style={styles.card}>
//         <div style={styles.cardBody}>
//           <div style={styles.profileRow}>
//             {/* ----------- IMAGE SECTION (ADDED ONLY) ----------- */}
//             <div style={styles.leftBox}>
//               <img
//                 src={
//                   profileImage ||
//                   "https://cdn-icons-png.flaticon.com/512/149/149071.png"
//                 }
//                 alt="Profile"
//                 style={styles.profileImage}
//               />

//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageUpload}
//                 style={{ marginTop: "10px" }}
//               />

//               <h4 style={styles.name}>{userDetails.name}</h4>
//               <p style={styles.role}>Guard Detail</p>
//             </div>

//             {/* ----------- DETAILS SECTION (UNCHANGED) ----------- */}
//             <div style={styles.rightBox}>
//               {[
//                 ["Guard ID", userDetails.id],
//                 ["Username", userDetails.username],
//                 ["Email", userDetails.email],
//                 ["Contact No", userDetails.contactno],
//                 [
//                   "Status",
//                   <span
//                     style={{
//                       ...styles.statusBadge,
//                       background:
//                         userDetails.status === "Active"
//                           ? "#28a745"
//                           : "#dc3545",
//                     }}
//                   >
//                     {userDetails.status}
//                   </span>,
//                 ],
//               ].map(([label, value], i) => (
//                 <div style={styles.detailRow} key={i}>
//                   <div style={styles.detailLabel}>{label}:</div>
//                   <div style={styles.detailValue}>{value}</div>
//                 </div>
//               ))}

//               <div style={{ marginTop: "20px" }}>
//                 <button
//                   style={styles.editBtn}
//                   onClick={() => {
//                     handleEdit(userDetails);
//                     navigate("/guardedit");
//                   }}
//                 >
//                   <i className="fa fa-edit me-1"></i> Edit Profile
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

//----------------------------------------2---------------------------------------------------------------
// import React, { useEffect } from "react";
// import { useGuardStore } from "../context/GuardContext";
// import { useNavigate } from "react-router-dom";

// export default function GuardProfile() {
//   const navigate = useNavigate();
//   const {
//     selectedGuard,
//     profileImage,
//     loading,
//     fetchGuardProfile,
//     uploadGuardImage,
//     handleEdit,
//   } = useGuardStore();

//   useEffect(() => {
//     fetchGuardProfile();
//   }, []);

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     uploadGuardImage(file);
//   };

//   if (loading) {
//     return (
//       <div className="text-center py-5">
//         <i className="fa fa-spinner fa-spin fa-2x text-primary mb-3"></i>
//         <h5>Loading profile...</h5>
//       </div>
//     );
//   }

//   if (!selectedGuard) {
//     return (
//       <div className="text-center py-5 text-danger">
//         <h4>Unable to load profile.</h4>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.pageContainer}>
//       <div style={styles.header}>
//         <h2 style={styles.headerTitle}>
//           <i className="fa fa-user-circle me-2"></i> Guard Profile
//         </h2>
//         <p style={styles.headerSubtitle}>Overview of Guard account details</p>
//       </div>

//       <div style={styles.card}>
//         <div style={styles.profileRow}>
//           <div style={styles.leftBox}>
//             <img
//               src={
//                 profileImage ||
//                 "https://cdn-icons-png.flaticon.com/512/149/149071.png"
//               }
//               alt="Profile"
//               style={styles.profileImage}
//             />

//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageUpload}
//               style={{ marginTop: "10px" }}
//             />

//             <h4 style={styles.name}>{selectedGuard.name}</h4>
//             <p style={styles.role}>Guard Detail</p>
//           </div>

//           <div style={styles.rightBox}>
//             {[
//               ["Guard ID", selectedGuard.id],
//               ["Username", selectedGuard.username],
//               ["Email", selectedGuard.email],
//               ["Contact No", selectedGuard.contactno],
//               [
//                 "Status",
//                 <span
//                   style={{
//                     ...styles.statusBadge,
//                     background:
//                       selectedGuard.status === "Active"
//                         ? "#28a745"
//                         : "#dc3545",
//                   }}
//                 >
//                   {selectedGuard.status}
//                 </span>,
//               ],
//             ].map(([label, value], i) => (
//               <div style={styles.detailRow} key={i}>
//                 <div style={styles.detailLabel}>{label}:</div>
//                 <div style={styles.detailValue}>{value}</div>
//               </div>
//             ))}

//             <div style={{ marginTop: "20px" }}>
//               <button
//                 style={styles.editBtn}
//                 onClick={() => {
//                   handleEdit(selectedGuard);
//                   navigate("/guardedit");
//                 }}
//               >
//                 <i className="fa fa-edit me-1"></i> Edit Profile
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




// /* ------------------ UI THEME STYLES (UNCHANGED + IMAGE STYLE ADDED) ------------------ */
// const styles = {
//   pageContainer: {
//     padding: "30px",
//     minHeight: "100vh",
//     background: "rgba(255,255,255,0.15)",
//     backdropFilter: "blur(6px)",
//   },
//   header: {
//     marginBottom: "25px",
//     padding: "20px",
//     background: "linear-gradient(135deg, #4e54c8, #8f94fb)",
//     borderRadius: "14px",
//     color: "white",
//     boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
//   },
//   headerTitle: { margin: 0, fontSize: "26px", fontWeight: "700" },
//   headerSubtitle: { marginTop: "5px", opacity: 0.9 },
//   card: {
//     background: "rgba(255,255,255,0.55)",
//     borderRadius: "18px",
//     padding: "25px",
//     backdropFilter: "blur(8px)",
//     boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
//   },
//   profileRow: {
//     display: "flex",
//     gap: "40px",
//     flexWrap: "wrap",
//     alignItems: "center",
//   },
//   leftBox: { flex: "1", textAlign: "center" },

//   /*  IMAGE STYLE ADDED */
//   profileImage: {
//     width: "140px",
//     height: "140px",
//     borderRadius: "50%",
//     objectFit: "cover",
//     border: "3px solid #4e54c8",
//   },

//   name: { fontSize: "22px", fontWeight: "700", marginTop: "10px" },
//   role: { fontSize: "15px", color: "#777" },
//   rightBox: { flex: "2" },
//   detailRow: { display: "flex", marginBottom: "12px" },
//   detailLabel: { width: "150px", fontWeight: "600", color: "#333" },
//   detailValue: { flex: 1, fontWeight: "500", color: "#444" },
//   statusBadge: {
//     padding: "6px 12px",
//     borderRadius: "20px",
//     color: "white",
//     fontWeight: "600",
//   },
//   editBtn: {
//     background: "#1e73be",
//     color: "white",
//     padding: "10px 18px",
//     borderRadius: "10px",
//     border: "none",
//     cursor: "pointer",
//     fontWeight: "600",
//   },
// };
