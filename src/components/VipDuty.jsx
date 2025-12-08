//---------------------------1-------------------------
// import React, { useState } from "react";
// import axios from "axios";
// import { useVipStore } from "../context/VipContext";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

// export default function VipDuty() {
//   const { selectedVip, handleBack } = useVipStore();

//   const [loading, setLoading] = useState(false);

//   //  DUTY COMPLETE API CALL
//   const handleDutyComplete = async () => {
//     const confirm = window.confirm(
//       "Are you sure you want to mark this duty as COMPLETED?"
//     );

//     if (!confirm) return;

//     try {
//       setLoading(true);

//       const token = localStorage.getItem("vipToken");
//       if (!token) {
//         toast.error("Token not found. Please login again.");
//         return;
//       }

//       const res = await axios.post(
//         `${BASE_URL}/api/assignments/complete/vip/${selectedVip.id}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       toast.success(" Duty marked as Completed Successfully!");
//       console.log("API Response:", res.data);
//     } catch (err) {
//       console.error("Duty Complete Error:", err);
//       toast.error("❌ Failed to complete duty");
//     } finally {
//       setLoading(false);
//     }
//   };

//   //  DUTY NOT COMPLETE
//   const handleDutyNotComplete = () => {
//     toast.info("❗ Duty marked as Not Completed");
//   };

//   //  NO VIP SELECTED
//   if (!selectedVip) {
//     return (
//       <div style={styles.container}>
//         <h2>No VIP Selected</h2>
//         <p>Please select a VIP first.</p>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.container}>
//       {/* HEADER */}
//       <div style={styles.header}>
//         <h2>VIP Duty Status</h2>
//         <button onClick={handleBack} style={styles.backBtn}>
//           Back
//         </button>
//       </div>

//       {/* VIP INFO CARD */}
//       <div style={styles.vipCard}>
//         <p><strong>Name:</strong> {selectedVip.name}</p>
//         <p><strong>VIP ID:</strong> {selectedVip.id}</p>
//       </div>

//       {/* ACTION BUTTONS */}
//       <div style={styles.actionBox}>
//         <button
//           style={{ ...styles.actionBtn, background: "#22c55e" }}
//           onClick={handleDutyComplete}
//           disabled={loading}
//         >
//           {loading ? "Processing..." : " Duty Completed"}
//         </button>

//         <button
//           style={{ ...styles.actionBtn, background: "#ef4444" }}
//           onClick={handleDutyNotComplete}
//           disabled={loading}
//         >
//           ❌ Not Completed
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ===================== STYLES ===================== */

// const styles = {
//   container: {
//     padding: "20px",
//     maxWidth: "700px",
//     margin: "auto",
//     fontFamily: "sans-serif",
//   },
//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   backBtn: {
//     padding: "8px 16px",
//     border: "none",
//     borderRadius: "6px",
//     cursor: "pointer",
//     background: "#111827",
//     color: "#fff",
//   },
//   vipCard: {
//     marginTop: "15px",
//     padding: "16px",
//     borderRadius: "10px",
//     background: "#f1f5f9",
//     boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//   },
//   actionBox: {
//     marginTop: "40px",
//     display: "flex",
//     gap: "20px",
//     justifyContent: "center",
//   },
//   actionBtn: {
//     padding: "14px 26px",
//     fontSize: "16px",
//     fontWeight: "bold",
//     color: "#fff",
//     border: "none",
//     borderRadius: "10px",
//     cursor: "pointer",
//     minWidth: "200px",
//   },
// };



//-----------------------------------------------2-----------------------------

import React, { useState } from "react";
import axios from "axios";
import { useVipStore } from "../context/VipContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function VipDuty() {
  const { selectedVip, handleBack } = useVipStore();
  const [loading, setLoading] = useState(false);

  //  DUTY COMPLETE API CALL (UNCHANGED)
  const handleDutyComplete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to mark this duty as COMPLETED?"
    );

    if (!confirm) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("vipToken");
      if (!token) {
        toast.error("Token not found. Please login again.");
        return;
      }

      const res = await axios.post(
        `${BASE_URL}/api/assignments/complete/vip/${selectedVip.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(" Duty marked as Completed Successfully!");
      console.log("API Response:", res.data);
    } catch (err) {
      console.error("Duty Complete Error:", err);
      toast.error("❌ Failed to complete duty");
    } finally {
      setLoading(false);
    }
  };

  //  NOT COMPLETE (UNCHANGED)
  const handleDutyNotComplete = () => {
    toast.info("❗ Duty marked as Not Completed");
  };

  //  NO VIP SELECTED (UNCHANGED)
  if (!selectedVip) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h3>No VIP Selected</h3>
          <p>Please select a VIP first.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>VIP Duty Status</h2>
        <button onClick={handleBack} style={styles.backBtn}>
          ⬅ Back
        </button>
      </div>

      {/* VIP INFO CARD */}
      <div style={styles.card}>
        <div style={styles.vipRow}>
          <div>
            <h3 style={styles.vipName}>{selectedVip.name}</h3>
            <p style={styles.vipId}>VIP ID: {selectedVip.id}</p>
          </div>
         <div style={styles.instructionsCard}>
  <h3 style={styles.instructionTitle}>📋 Duty Completion Instructions</h3>

  <ul style={styles.instructionList}>
    <li>
       <strong>Duty Completed:</strong> Click when the VIP duty is finished
      successfully.
    </li>

    <li>
      ❌ <strong>Not Completed:</strong> Click if the duty could not be completed
      due to any issue.
    </li>

    <li>
      🔒 <strong>Final Action:</strong> Once a button is clicked, the duty status
      becomes <strong>Inactive</strong> and cannot be changed again.
    </li>

    <li>
      🔄 <strong>Processing:</strong> Please wait while the system updates the
      duty status.
    </li>

    <li>
      ⚠️ <strong>Confirmation Required:</strong> The system will ask for
      confirmation before marking the duty as completed.
    </li>
  </ul>
</div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div style={styles.actionBox}>
        <button
          style={{ ...styles.actionBtn, background: "#22c55e" }}
          onClick={handleDutyComplete}
          disabled={loading}
        >
          {loading ? "Processing..." : " Duty Completed"}
        </button>

        {/* <button
          style={{ ...styles.actionBtn, background: "#ef4444" }}
          onClick={handleDutyNotComplete}
          disabled={loading}
        >
          ❌ Not Completed
        </button> */}
      </div>
    </div>
  );
}

/* ===================== MODERN UI STYLES ===================== */

const styles = {
  pageContainer: {
    padding: "30px",
    minHeight: "100vh",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(6px)",
  },

  container: {
    padding: "20px",
    maxWidth: "700px",
    margin: "auto",
    fontFamily: "sans-serif",
  },

  header: {
    marginBottom: "25px",
    padding: "20px",
    background: "linear-gradient(135deg, #4e54c8, #8f94fb)",
    borderRadius: "14px",
    color: "white",
    boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: {
    margin: 0,
    fontSize: "26px",
    fontWeight: "700",
  },

  backBtn: {
    padding: "10px 18px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    background: "#111827",
    color: "white",
  },

  card: {
    background: "rgba(255,255,255,0.55)",
    borderRadius: "18px",
    padding: "25px",
    backdropFilter: "blur(8px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  },

  vipRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  vipName: {
    fontSize: "22px",
    fontWeight: "700",
    margin: 0,
  },

  vipId: {
    fontSize: "15px",
    color: "#555",
    marginTop: "6px",
  },

  statusBadge: {
    padding: "8px 18px",
    borderRadius: "20px",
    fontWeight: "700",
    color: "white",
    background: "#22c55e",
  },

  actionBox: {
    marginTop: "40px",
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  actionBtn: {
    padding: "16px 32px",
    fontSize: "16px",
    fontWeight: "700",
    color: "white",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    minWidth: "220px",
    transition: "0.3s",
  },
};
