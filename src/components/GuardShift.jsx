// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import { useGuardStore } from "../context/GuardContext";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

// export default function GuardShift() {
//   const navigate = useNavigate();
//   const { guardId } = useParams();
//   const { selectedGuard } = useGuardStore();

//   const finalGuardId = guardId || selectedGuard?.id;

//   const [vip, setVip] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!finalGuardId) {
//       navigate("/guardshift");
//       return;
//     }

//     async function fetchVip() {
//       try {
//         const res = await axios.get(
//           `${BASE_URL}/api/assignments/getvip/${finalGuardId}`
//         );

//         const extracted =
//           res.data?.data || res.data?.vip || res.data || null;

//         setVip(extracted);
//       } catch (error) {
//         console.error("VIP Fetch Error:", error);
//         setVip(null);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchVip();
//   }, [finalGuardId, navigate]);

//   if (loading) {
//     return (
//       <div className="text-center py-5">
//         <i className="fa fa-spinner fa-spin fa-2x text-primary mb-3"></i>
//         <h5>Loading Shift...</h5>
//       </div>
//     );
//   }

//   if (!vip) {
//     return (
//       <div style={styles.emptyBox}>
//         <h2>No VIP Assignment Found</h2>
//         <button style={styles.backBtn} onClick={() => navigate("/guardshift")}>
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.pageContainer}>
//       <div style={styles.header}>
//         <h2 style={styles.headerTitle}>
//           <i className="fa fa-shield me-2"></i> Guard Shift Details
//         </h2>
//         <p style={styles.headerSubtitle}>
//           Assigned VIP & Duty Schedule Overview
//         </p>
//       </div>

//       <div style={styles.card}>
//         <div style={styles.profileRow}>
//           <div style={styles.leftBox}>
//             <h4 style={styles.name}>{vip.name || "N/A"}</h4>
//             <p style={styles.role}>{vip.designation || "N/A"}</p>
//           </div>

//           <div style={styles.rightBox}>
//             {[
//               ["Guard Assignment ID", vip.id],
//               ["VIP Name", vip.name],
//               ["Designation", vip.designation],
//               ["Start Time", vip.startAt || "N/A"],
//               ["End Time", vip.endAt || "N/A"],
//               ["Status", vip.status || "Assigned"],
//             ].map(([label, value], i) => (
//               <div style={styles.detailRow} key={i}>
//                 <div style={styles.detailLabel}>{label}:</div>
//                 <div style={styles.detailValue}>{value}</div>
//               </div>
//             ))}

//             <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
//               <button style={styles.backBtn} onClick={() => navigate(-1)}>
//                 ← Back
//               </button>

//               {/*  SEND vip.id TO GuardLeaveRequest */}
//               <button
//                 style={{ ...styles.backBtn, background: "#28a745" }}
//                 onClick={() => navigate(`/guarddecision/${vip.id}`)}
//               >
//                 Duty-Decision ➡
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ================== UI STYLES ================== */

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
//   },
//   headerTitle: { margin: 0, fontSize: "26px", fontWeight: "700" },
//   headerSubtitle: { marginTop: "5px", opacity: 0.9 },
//   card: {
//     background: "#fff",
//     borderRadius: "18px",
//     padding: "31px",
//   },
//   profileRow: { display: "flex", gap: "40px", flexWrap: "wrap" },
//   leftBox: { flex: "1", textAlign: "center" },
//   name: { fontSize: "22px", fontWeight: "700", marginTop: "50px" },
//   role: { fontSize: "15px", color: "#777" },
//   rightBox: { flex: "2" },
//   detailRow: { display: "flex", marginBottom: "12px" },
//   detailLabel: { width: "150px", fontWeight: "600" },
//   detailValue: { flex: 1 },
//   backBtn: {
//     background: "#1e73be",
//     color: "white",
//     padding: "10px 18px",
//     borderRadius: "10px",
//     border: "none",
//     cursor: "pointer",
//   },
//   emptyBox: { padding: "50px", textAlign: "center" },
// };




import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useGuardStore } from "../context/GuardContext";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function GuardShift() {
  const navigate = useNavigate();
  const { guardId } = useParams();
  const { selectedGuard } = useGuardStore();

  const finalGuardId = guardId || selectedGuard?.id;

  const [vip, setVip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!finalGuardId) {
      navigate("/guardshift");
      return;
    }

    async function fetchVip() {
      try {
        const token = localStorage.getItem("guardToken"); //  GET GUARD TOKEN

        const res = await axios.get(
          `${BASE_URL}/api/assignments/getvip/${finalGuardId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, //  TOKEN SENT
            },
          }
        );

        const extracted =
          res.data?.data || res.data?.vip || res.data || null;

        setVip(extracted);
      } catch (error) {
        console.error("VIP Fetch Error:", error);
        setVip(null);
      } finally {
        setLoading(false);
      }
    }

    fetchVip();
  }, [finalGuardId, navigate]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <i className="fa fa-spinner fa-spin fa-2x text-primary mb-3"></i>
        <h5>Loading Shift...</h5>
      </div>
    );
  }

  if (!vip) {
    return (
      <div style={styles.emptyBox}>
        <h2>No VIP Assignment Found</h2>
        <button
          style={styles.backBtn}
          onClick={() => navigate("/guardshift")}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>
          <i className="fa fa-shield me-2"></i> Guard Shift Details
        </h2>
        <p style={styles.headerSubtitle}>
          Assigned VIP & Duty Schedule Overview
        </p>
      </div>

      <div style={styles.card}>
        <div style={styles.profileRow}>
          <div style={styles.leftBox}>
            <h4 style={styles.name}>{vip.name || "N/A"}</h4>
            <p style={styles.role}>{vip.designation || "N/A"}</p>
          </div>

          <div style={styles.rightBox}>
            {[
              ["Guard Assignment ID", vip.id],
              ["VIP Name", vip.name],
              ["Designation", vip.designation],
              ["Start Time", vip.startAt || "N/A"],
              ["End Time", vip.endAt || "N/A"],
              ["Status", vip.status || "Assigned"],
            ].map(([label, value], i) => (
              <div style={styles.detailRow} key={i}>
                <div style={styles.detailLabel}>{label}:</div>
                <div style={styles.detailValue}>{value}</div>
              </div>
            ))}

            <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
              <button style={styles.backBtn} onClick={() => navigate(-1)}>
                ← Back
              </button>

              {/*  SEND vip.id TO Guard Decision */}
              <button
                style={{ ...styles.backBtn, background: "#28a745" }}
                onClick={() => navigate(`/guarddecision/${vip.id}`)}
              >
                Duty-Decision ➡
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================== UI STYLES ================== */

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
    background: "linear-gradient(135deg, #4e54c8, #8f94fb)",
    borderRadius: "14px",
    color: "white",
  },
  headerTitle: { margin: 0, fontSize: "26px", fontWeight: "700" },
  headerSubtitle: { marginTop: "5px", opacity: 0.9 },
  card: {
    background: "#fff",
    borderRadius: "18px",
    padding: "31px",
  },
  profileRow: { display: "flex", gap: "40px", flexWrap: "wrap" },
  leftBox: { flex: "1", textAlign: "center" },
  name: { fontSize: "22px", fontWeight: "700", marginTop: "50px" },
  role: { fontSize: "15px", color: "#777" },
  rightBox: { flex: "2" },
  detailRow: { display: "flex", marginBottom: "12px" },
  detailLabel: { width: "150px", fontWeight: "600" },
  detailValue: { flex: 1 },
  backBtn: {
    background: "#1e73be",
    color: "white",
    padding: "10px 18px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
  },
  emptyBox: { padding: "50px", textAlign: "center" },
};
