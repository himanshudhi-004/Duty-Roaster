// import React, { useState } from "react";
// import axios from "axios";
// import { useGuardStore } from "../context/GuardContext";
// import { toast } from "react-toastify";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

// export default function GuardIncident() {
//   const { selectedGuard } = useGuardStore();

//   //  DEFAULT ARISE VALUE
//   const [ariseOption] = useState("Arise");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const token = localStorage.getItem("guardToken");

//   //  SUBMIT HANDLER
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!message) {
//       toast.error("Please enter incident message");
//       return;
//     }

//     if (!selectedGuard) {
//       toast.error("No Guard Selected");
//       return;
//     }

//     const payload = {
//       guardData: selectedGuard,
//       req: ariseOption, //  ALWAYS "Arise"
//       message: message,
//     };

//     try {
//       setLoading(true);

//       await axios.post(
//         `${BASE_URL}/api/duty/accident`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       toast.success("Incident Request Sent Successfully ");
//       setMessage("");
//     } catch (error) {
//       console.error("Incident Error:", error);
//       toast.error("Failed to send incident request ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container-fluid p-4">
//       <div className="row justify-content-center">
//         <div className="col-md-6">
//           <div className="card shadow-lg rounded-4">
//             <div className="card-header bg-dark text-white text-center">
//               <h4 className="mb-0">Guard Incident Report</h4>
//             </div>

//             <div className="card-body">

//               {/*  GUARD DETAILS */}
//               {selectedGuard && (
//                 <div className="mb-3 border rounded p-3 bg-light">
//                   <p><strong>Name:</strong> {selectedGuard.name}</p>
//                   <p><strong>Contact:</strong> {selectedGuard.contactno}</p>
//                   <p><strong>Email:</strong> {selectedGuard.email}</p>
//                 </div>
//               )}

//               <form onSubmit={handleSubmit}>

//                 {/*  DEFAULT ARISE BUTTON (REPLACED SELECT FIELD) */}
//                 <div className="mb-3 text-center">
//                   <label className="form-label d-block mb-2">
//                     Incident Type
//                   </label>
//                   <button
//                     type="button"
//                     className="btn btn-warning fw-bold px-5 py-2"
//                     disabled
//                   >
//                     ARISE
//                   </button>
//                 </div>

//                 {/*  MESSAGE BOX */}
//                 <div className="mb-3">
//                   <label className="form-label">Incident Message</label>
//                   <textarea
//                     className="form-control"
//                     rows="4"
//                     placeholder="Enter incident details..."
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                   ></textarea>
//                 </div>

//                 {/*  SUBMIT BUTTON */}
//                 <button
//                   type="submit"
//                   className="btn btn-dark w-100"
//                   disabled={loading}
//                 >
//                   {loading ? "Sending..." : "Submit Incident"}
//                 </button>

//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import axios from "axios";
import { useGuardStore } from "../context/GuardContext";
import { toast } from "react-toastify";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function GuardIncident() {
  const { selectedGuard } = useGuardStore();

  const [ariseOption] = useState("Arise");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("guardToken");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message) {
      toast.error("Please enter incident message");
      return;
    }

    if (!selectedGuard) {
      toast.error("No Guard Selected");
      return;
    }

    const payload = {
      guardData: selectedGuard,
      req: ariseOption,
      message: message,
    };

    try {
      setLoading(true);

      await axios.post(`${BASE_URL}/api/duty/accident`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Incident Request Sent Successfully ");
      setMessage("");
    } catch (error) {
      console.error("Incident Error:", error);
      toast.error("Failed to send incident request ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* ---------- HEADER ---------- */}
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>
          <i className="fa fa-exclamation-triangle me-2"></i> Guard Incident
        </h2>
        <p style={styles.headerSubtitle}>
          Report any emergency or on-duty incident
        </p>
      </div>

      {/* ---------- CARD ---------- */}
      <div style={styles.card}>
        <div style={styles.cardBody}>
          <div style={styles.profileRow}>
            {/* -------- LEFT SECTION (INSTRUCTIONS) -------- */}
            <div style={styles.leftBox}>
              <h4 style={styles.pointsTitle}>When to Raise Incident?</h4>

              <ul style={styles.pointList}>
                <li>🚨 Accident during duty</li>
                <li>⚠️ Threat from any person</li>
                <li>🛑 VIP in danger</li>
                <li>🚑 Medical emergency</li>
                <li>🔥 Fire or violence</li>
                <li>📞 Any urgent security issue</li>
              </ul>

              <div style={styles.noteBox}>
                ⚠️ Only use <b>ARISE</b> for real emergency situations.
              </div>
            </div>

            {/* -------- RIGHT SECTION (FORM) -------- */}
            <div style={styles.rightBox}>
              {/* --- Guard Details --- */}
              {selectedGuard && (
                <>
                  {[
                    ["Name", selectedGuard.name],
                    ["Contact No", selectedGuard.contactno],
                    ["Email", selectedGuard.email],
                    ["Incident Type", "ARISE"],
                  ].map(([label, value], i) => (
                    <div style={styles.detailRow} key={i}>
                      <div style={styles.detailLabel}>{label}:</div>
                      <div style={styles.detailValue}>{value}</div>
                    </div>
                  ))}
                </>
              )}

              {/* -------- INCIDENT FORM -------- */}
              <form onSubmit={handleSubmit} style={{ marginTop: "25px" }}>
                {/* ARISE BUTTON */}
                <div className="mb-3 text-center">
                  <button
                    type="button"
                    style={{
                      ...styles.ariseBtn,
                      opacity: 0.8,
                      cursor: "not-allowed",
                    }}
                    disabled
                  >
                    ARISE
                  </button>
                </div>

                {/* MESSAGE */}
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Enter incident details..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={styles.textarea}
                  ></textarea>
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  style={{
                    ...styles.submitBtn,
                    opacity: loading ? 0.6 : 1,
                  }}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Submit Incident"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------ RESPONSIVE GLASS UI THEME ------------------ */
const styles = {
  pageContainer: {
    padding: "30px",
    minHeight: "100vh",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(6px)",
  },
  header: {
    marginBottom: "25px",
    padding: "20px",
    background: "linear-gradient(135deg, #ff9966, #ff5e62)",
    borderRadius: "14px",
    color: "white",
    boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
  },
  headerTitle: { margin: 0, fontSize: "26px", fontWeight: "700" },
  headerSubtitle: { marginTop: "5px", opacity: 0.9 },

  card: {
    background: "rgba(255,255,255,0.55)",
    borderRadius: "18px",
    padding: "25px",
    backdropFilter: "blur(8px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  },

  profileRow: {
    display: "flex",
    gap: "40px",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },

  leftBox: {
    flex: "1",
    padding: "20px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.7)",
  },

  pointsTitle: {
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "15px",
  },

  pointList: {
    paddingLeft: "18px",
    fontSize: "15px",
    lineHeight: "1.8",
    fontWeight: "500",
  },

  noteBox: {
    marginTop: "15px",
    padding: "10px",
    background: "#fff3cd",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
  },

  rightBox: { flex: "2" },

  detailRow: {
    display: "flex",
    marginBottom: "12px",
    flexWrap: "wrap",
  },
  detailLabel: { width: "150px", fontWeight: "600", color: "#333" },
  detailValue: { flex: 1, fontWeight: "500", color: "#444" },

  ariseBtn: {
    background: "#ffc107",
    color: "#000",
    padding: "10px 40px",
    borderRadius: "25px",
    border: "none",
    fontWeight: "700",
  },

  textarea: {
    borderRadius: "10px",
    border: "1px solid #ccc",
    padding: "10px",
  },

  submitBtn: {
    width: "100%",
    background: "#ff5e62",
    color: "white",
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
  },
};
