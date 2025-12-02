// import React, { useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

// export default function AdminLeaveRequestTheme() {
//   const [requestList, setRequestList] = useState([]);
//   const [activeTab, setActiveTab] = useState("MY");

//   //  PAGINATION STATES (20-20 FOR ALL TABS)
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 20;

//   const role = localStorage.getItem("role");
//   const token = localStorage.getItem(`${role}Token`);
//   const isAdmin = role === "admin" || role === "user";

//   /* ---------------- FETCH ---------------- */
//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const fetchRequests = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/duty/decision/all`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (Array.isArray(res.data)) setRequestList(res.data);
//       else if (Array.isArray(res.data?.data))
//         setRequestList(res.data.data);
//     } catch {
//       toast.error("Failed to load requests");
//     }
//   };

//   /* ---------------- ACCEPT / REJECT ---------------- */
//   const handleDecision = async (item, decisionStatus) => {
//     try {
//       const dutyPayload = {
//         officer: item.officer,
//         status: decisionStatus,
//         message: item.message || "",
//       };

//       await axios.post(`${BASE_URL}/api/duty/decision`, dutyPayload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       toast.success(`Request ${decisionStatus}`);
//       fetchRequests();
//     } catch {
//       toast.error("Action failed");
//     }
//   };

//   /* ---------------- TAB FILTER ---------------- */
//   const tabFilteredData = useMemo(() => {
//     return requestList.filter((item) => {
//       if (activeTab === "MY") return true;

//       if (activeTab === "PENDING")
//         return (
//           item.status?.includes("Guard Rejected") &&
//           !item.status?.includes("Manager Accepted") &&
//           !item.status?.includes("Manager Rejected")
//         );

//       if (activeTab === "APPROVED")
//         return item.status?.includes("Manager Accepted");

//       if (activeTab === "REJECTED")
//         return item.status?.includes("Manager Rejected");

//       return true;
//     });
//   }, [requestList, activeTab]);

//   /* ----------------  AUTO SORT ONLY FOR "ALL REQUESTS" ---------------- */
//   const sortedData = useMemo(() => {
//     if (activeTab !== "MY") return tabFilteredData;

//     return [...tabFilteredData].sort((a, b) => {
//       const aStatus = a.status || "";
//       const bStatus = b.status || "";

//       const getPriority = (status) => {
//         if (status.includes("Guard Rejected")) return 1;
//         if (status.includes("Manager Rejected")) return 2;
//         return 3;
//       };

//       return getPriority(aStatus) - getPriority(bStatus);
//     });
//   }, [tabFilteredData, activeTab]);

//   /* ----------------  PAGINATION FOR ALL TABS ---------------- */
//   const totalPages = Math.ceil(sortedData.length / rowsPerPage);

//   const paginatedData = useMemo(() => {
//     const start = (currentPage - 1) * rowsPerPage;
//     return sortedData.slice(start, start + rowsPerPage);
//   }, [sortedData, currentPage]);

//   //  Reset page when tab changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [activeTab]);

//   return (
//     <div style={styles.page}>
//       {/* ---------------- HEADER ---------------- */}
//       <div style={styles.headerRow}>
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <span style={styles.backBox}><i class="fa fa-fas fa-calendar-times" aria-hidden="true"></i></span>
//           <h2 style={styles.title}>Leave Requests</h2>
//         </div>
//       </div>

//       {/* ---------------- TABS ---------------- */}
//       <div style={styles.tabRow}>
//         <button
//           style={activeTab === "MY" ? styles.activeTab : styles.tabBtn}
//           onClick={() => setActiveTab("MY")}
//         >
//           All Requests
//         </button>

//         <button
//           style={activeTab === "PENDING" ? styles.activeTab : styles.tabBtn}
//           onClick={() => setActiveTab("PENDING")}
//         >
//           Pending Approvals
//         </button>

//         <button
//           style={activeTab === "APPROVED" ? styles.activeTab : styles.tabBtn}
//           onClick={() => setActiveTab("APPROVED")}
//         >
//           Approved Requests
//         </button>

//         <button
//           style={activeTab === "REJECTED" ? styles.activeTab : styles.tabBtn}
//           onClick={() => setActiveTab("REJECTED")}
//         >
//           Rejected Requests
//         </button>
//       </div>

//       {/* ---------------- CARD ---------------- */}
//       <div style={styles.card}>
//         <h3 style={styles.cardTitle}>
//           {activeTab === "MY" && "My Leave Requests"}
//           {activeTab === "PENDING" && "Pending Approvals"}
//           {activeTab === "APPROVED" && "Approved Requests"}
//           {activeTab === "REJECTED" && "Rejected Requests"}
//         </h3>

//         {paginatedData.length === 0 ? (
//           <div style={styles.emptyBox}>
//             <div style={styles.infoIcon}>i</div>
//             <p style={styles.emptyText}>
//               You have not applied for any leave yet.
//             </p>
//           </div>
//         ) : (
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th style={styles.th}>#</th>
//                 <th style={styles.th}>Guard</th>
//                 <th style={styles.th}>Grade</th>
//                 <th style={styles.th}>Status</th>
//                 <th style={styles.th}>Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {paginatedData.map((item, index) => {
//                 const isPending =
//                   item.status?.includes("Guard Rejected") &&
//                   !item.status?.includes("Manager Accepted") &&
//                   !item.status?.includes("Manager Rejected");

//                 const statusStyle =
//                   item.status?.includes("Manager Accepted")
//                     ? styles.statusApproved
//                     : item.status?.includes("Manager Rejected")
//                     ? styles.statusRejected
//                     : styles.statusPending;

//                 return (
//                   <tr key={item._id}>
//                     {/*  SERIAL NUMBER WITH PAGINATION */}
//                     <td style={styles.td}>
//                       {index + 1 + (currentPage - 1) * rowsPerPage}
//                     </td>

//                     <td style={styles.td}>{item.officer?.name}</td>
//                     <td style={styles.td}>{item.officer?.rank}</td>

//                     <td style={styles.td}>
//                       <span style={statusStyle}>{item.status}</span>
//                     </td>

//                     <td style={styles.td}>
//                       {isPending && isAdmin ? (
//                         <>
//                           <button
//                             style={styles.acceptBtn}
//                             onClick={() =>
//                               handleDecision(item, "Manager Accepted")
//                             }
//                           >
//                             Accept
//                           </button>

//                           <button
//                             style={styles.rejectBtn}
//                             onClick={() =>
//                               handleDecision(item, "Manager Rejected")
//                             }
//                           >
//                             Reject
//                           </button>
//                         </>
//                       ) : (
//                         <span style={styles.locked}>Finalized</span>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         )}

//         {/* ----------------  PAGINATION UI FOR ALL TABS ---------------- */}
//         {totalPages > 1 && (
//           <div style={styles.paginationRow}>
//             <button
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage((p) => p - 1)}
//               style={styles.pageBtn}
//             >
//               Prev
//             </button>

//             {[...Array(totalPages)].map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setCurrentPage(i + 1)}
//                 style={{
//                   ...styles.pageBtn,
//                   ...(currentPage === i + 1 ? styles.activePage : {}),
//                 }}
//               >
//                 {i + 1}
//               </button>
//             ))}

//             <button
//               disabled={currentPage === totalPages}
//               onClick={() => setCurrentPage((p) => p + 1)}
//               style={styles.pageBtn}
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ---------------- SAME THEME STYLES (UNCHANGED) ---------------- */
// const styles = {
//   page: { padding: 30, background: "#f5f7fb", minHeight: "100vh" },

//   headerRow: {
//     display: "flex",
//     justifyContent: "space-between",
//     marginBottom: 20,
//     alignItems: "center",
//   },

//   backBox: {
//     width: 28,
//     height: 28,
//     border: "1px solid #ccc",
//     borderRadius: 6,
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   title: { fontSize: 24, fontWeight: 700 },

//   tabRow: {
//     display: "flex",
//     gap: 20,
//     borderBottom: "1px solid #ddd",
//     marginBottom: 20,
//   },

//   tabBtn: {
//     padding: "10px 0",
//     border: 0,
//     background: "transparent",
//     fontSize: 15,
//     cursor: "pointer",
//   },

//   activeTab: {
//     padding: "10px 0",
//     border: 0,
//     background: "transparent",
//     fontSize: 15,
//     color: "#4f46e5",
//     borderBottom: "2px solid #4f46e5",
//     fontWeight: 600,
//   },

//   card: {
//     background: "#fff",
//     borderRadius: 12,
//     padding: 25,
//     boxShadow: "0 4px 15px rgba(0,0,0,0.12)",
//   },

//   cardTitle: { marginBottom: 20, fontWeight: 600 },

//   emptyBox: {
//     height: 200,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   infoIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: "50%",
//     border: "2px solid #999",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   emptyText: { marginTop: 10, color: "#555" },

//   table: { width: "100%", borderCollapse: "collapse" },
//   th: { padding: 12, background: "#f1f3f6", textAlign: "left" },
//   td: { padding: 12, borderBottom: "1px solid #eee" },

//   acceptBtn: {
//     background: "#2e7d32",
//     color: "#fff",
//     border: 0,
//     padding: "6px 12px",
//     borderRadius: 6,
//     marginRight: 6,
//   },

//   rejectBtn: {
//     background: "#d32f2f",
//     color: "#fff",
//     border: 0,
//     padding: "6px 12px",
//     borderRadius: 6,
//   },

//   locked: { color: "#777" },

//   statusApproved: {
//     background: "#e6ffe6",
//     padding: "5px 10px",
//     borderRadius: 20,
//     color: "#2e7d32",
//   },

//   statusRejected: {
//     background: "#ffe6e6",
//     padding: "5px 10px",
//     borderRadius: 20,
//     color: "#d32f2f",
//   },

//   statusPending: {
//     background: "#fff3cd",
//     padding: "5px 10px",
//     borderRadius: 20,
//     color: "#856404",
//   },

//   paginationRow: {
//     display: "flex",
//     justifyContent: "center",
//     gap: 8,
//     marginTop: 20,
//   },

//   pageBtn: {
//     padding: "6px 12px",
//     borderRadius: 6,
//     border: "1px solid #4f46e5",
//     background: "white",
//     cursor: "pointer",
//   },

//   activePage: {
//     background: "#4f46e5",
//     color: "#fff",
//     fontWeight: 600,
//   },
// };



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

// export default function AdminRequestAccept() {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // SEARCH & FILTER
//   const [searchText, setSearchText] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("");

//   // ROLE & TOKEN
//   const role = localStorage.getItem("role");
//   const token = localStorage.getItem(`${role}Token`);

//   /* ---------------- FETCH ---------------- */
//   const fetchRequests = async () => {
//     try {
//       setLoading(true);

//       const res = await axios.get(`${BASE_URL}/api/duty/decision/all`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (Array.isArray(res.data)) setRequests(res.data);
//       else if (Array.isArray(res.data?.data)) setRequests(res.data.data);
//     } catch (error) {
//       toast.error("Failed to load requests");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//     console.log("role", role);
//   }, []);

//   /* ---------------- ACCEPT / REJECT ---------------- */
//   const handleDecision = async (item, action) => {
//     try {
//       const finalStatus =
//         role === "admin" 
        
//           ? action === "accept"
//             ? "Admin Accepted"
//             : "Admin Rejected"
//           : action === "accept"
//           ? "Manager Accepted"
//           : "Manager Rejected";

//       const payload = {
//         id: item.id,
//         status: finalStatus,
       
//       };

//       await axios.post(`${BASE_URL}/api/duty/decision/management`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       toast.success(finalStatus);
//       fetchRequests();
//     } catch (error) {
//       toast.error("Action Failed");
//     }
//   };

//   /* ---------------- SEARCH + STATUS FILTER ---------------- */
//   const filteredData = requests.filter((item) => {
//     const text = searchText.trim().toLowerCase();

//     const searchMatch = text
//       ? [
//           item.officer?.name,
//           item.officer?.rank,
//           item.status,
//           item.message,
//         ].some((field) =>
//           String(field || "").toLowerCase().includes(text)
//         )
//       : true;

//     const statusMatch = selectedStatus
//       ? item.status?.toLowerCase().includes(selectedStatus)
//       : true;

//     return searchMatch && statusMatch;
//   });

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.title}>Admin / Manager Request Approval</h2>

//       {/* FILTERS */}
//       <div style={styles.filterRow}>
//         <div style={styles.filterCard}>
//           <label style={styles.filterLabel}>Search</label>
//           <input
//             type="text"
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//             placeholder="Search by name, rank, message..."
//             style={styles.input}
//           />
//         </div>

//         <div style={styles.filterCard}>
//           <label style={styles.filterLabel}>Status</label>
//           <select
//             value={selectedStatus}
//             onChange={(e) => setSelectedStatus(e.target.value)}
//             style={styles.select}
//           >
//             <option value="">All</option>
//             <option value="admin accepted">Admin Accepted</option>
//             <option value="admin rejected">Admin Rejected</option>
//             <option value="manager accepted">Manager Accepted</option>
//             <option value="manager rejected">Manager Rejected</option>
//             <option value="pending">Pending</option>
//           </select>
//         </div>
//       </div>

//       {/* TABLE */}
//       <div style={styles.card}>
//         {loading ? (
//           <div style={styles.noData}>Loading...</div>
//         ) : filteredData.length === 0 ? (
//           <div style={styles.noData}>No Requests Found</div>
//         ) : (
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th style={styles.th}>#</th>
//                 <th style={styles.th}>Guard</th>
//                 <th style={styles.th}>Rank</th>
//                 <th style={styles.th}>Message</th>
//                 <th style={styles.th}>Status</th>
//                 <th style={styles.th}>&emsp;Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredData.map((item, index) => {
//                 const statusText = item.status || "Pending";

//                 const statusStyle =
//                   statusText.includes("Accepted")
//                     ? styles.statusActive
//                     : statusText.includes("Rejected")
//                     ? styles.statusInactive
//                     : styles.statusOther;

//                 const isCompleted =
//                   statusText.includes("Admin") ||
//                   statusText.includes("Manager");

//                 return (
//                   <tr key={item.id} style={styles.row}>
//                     <td style={styles.td}>{index + 1}</td>
//                     <td style={styles.td}>{item.officer?.name}</td>
//                     <td style={styles.td}>{item.officer?.rank}</td>
//                     <td style={styles.td}>{item.message || "N/A"}</td>

//                     <td style={styles.td}>
//                       <span style={statusStyle}>
//                         {statusText}
//                       </span>
//                     </td>

//                     <td style={styles.td}>
//                       {isCompleted ? (
//                         <span style={{ color: "#777" }}>Completed</span>
//                       ) : (
//                         <div style={{ display: "flex", gap: 10 }}>
//                           <button
//                             style={styles.acceptBtn}
//                             onClick={() =>
//                               handleDecision(item, "accept")
//                             }
//                           >
//                             Accept
//                           </button>

//                           <button
//                             style={styles.rejectBtn}
//                             onClick={() =>
//                               handleDecision(item, "reject")
//                             }
//                           >
//                             Reject
//                           </button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ---------------- SAME INCIDENT THEME ---------------- */

// const styles = {
//   container: { padding: 30, background: "#fff" },
//   title: { fontSize: 30, fontWeight: 800, marginBottom: 25, color: "#1967d2" },

//   filterRow: { display: "flex", gap: 20, marginBottom: 25 },
//   filterCard: {
//     flex: 1,
//     padding: 18,
//     borderRadius: 12,
//     background: "#fff",
//     boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
//   },
//   filterLabel: { fontSize: 15, fontWeight: 600, marginBottom: 6 },

//   select: {
//     width: "100%",
//     padding: "12px",
//     borderRadius: 8,
//     border: "1.5px solid #1a73e8",
//     fontSize: 15,
//   },

//   input: {
//     width: "100%",
//     padding: 12,
//     borderRadius: 8,
//     border: "1.5px solid #1a73e8",
//     fontSize: 15,
//     outline: "none",
//   },

//   card: {
//     background: "#fff",
//     padding: 10,
//     borderRadius: 15,
//     boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
//   },

//   table: { width: "100%", borderCollapse: "collapse" },
//   th: {
//     background: "#f4f4f6",
//     padding: "16px 10px",
//     textAlign: "left",
//     borderBottom: "2px solid #ddd",
//     fontWeight: 700,
//   },
//   row: { height: 62, transition: "0.25s" },
//   td: { padding: "14px 10px", borderBottom: "1px solid #eee" },

//   statusActive: {
//     background: "#e6ffe6",
//     padding: "6px 12px",
//     borderRadius: 20,
//     color: "#2e7d32",
//     fontWeight: 600,
//   },
//   statusInactive: {
//     background: "#ffe6e6",
//     padding: "6px 12px",
//     borderRadius: 20,
//     color: "#d32f2f",
//     fontWeight: 600,
//   },
//   statusOther: {
//     background: "#fff8e1",
//     padding: "6px 12px",
//     borderRadius: 20,
//     color: "#ff9800",
//     fontWeight: 600,
//   },

//   acceptBtn: {
//     background: "#2e7d32",
//     color: "#fff",
//     border: "none",
//     padding: "7px 14px",
//     borderRadius: 8,
//     cursor: "pointer",
//   },
//   rejectBtn: {
//     background: "#d32f2f",
//     color: "#fff",
//     border: "none",
//     padding: "7px 14px",
//     borderRadius: 8,
//     cursor: "pointer",
//   },

//   noData: { textAlign: "center", padding: 40, fontSize: 18, color: "#777" },
// };




import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function AdminRequestAccept() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // SEARCH & FILTER
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // ROLE & TOKEN
  const role = localStorage.getItem("role");
  const token = localStorage.getItem(`${role}Token`);

  /* ---------------- FETCH ---------------- */
  const fetchRequests = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${BASE_URL}/api/duty/decision/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(res.data)) setRequests(res.data);
      else if (Array.isArray(res.data?.data)) setRequests(res.data.data);
    } catch (error) {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  /* ---------------- ACCEPT / REJECT ---------------- */
  const handleDecision = async (item, action) => {
    try {
      const finalStatus =
        role === "admin"
          ? action === "accept"
            ? "Admin Accepted"
            : "Admin Rejected"
          : action === "accept"
          ? "Manager Accepted"
          : "Manager Rejected";

      const payload = {
        id: item.id,
        status: finalStatus,
      };

      await axios.post(`${BASE_URL}/api/duty/decision/management`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(finalStatus);
      fetchRequests();
    } catch (error) {
      toast.error("Action Failed");
    }
  };

  /* ---------------- SEARCH + STATUS FILTER ---------------- */
  const filteredData = requests.filter((item) => {
    const text = searchText.trim().toLowerCase();

    const searchMatch = text
      ? [
          item.officer?.name,
          item.officer?.rank,
          item.status,
          item.message,
        ].some((field) =>
          String(field || "").toLowerCase().includes(text)
        )
      : true;

    const statusMatch = selectedStatus
      ? item.status?.toLowerCase().includes(selectedStatus)
      : true;

    return searchMatch && statusMatch;
  });

  /*  PENDING REQUESTS ON TOP */
  const sortedData = [...filteredData].sort((a, b) => {
    const aPending = !a.status || a.status.toLowerCase() === "pending";
    const bPending = !b.status || b.status.toLowerCase() === "pending";

    if (aPending && !bPending) return -1;
    if (!aPending && bPending) return 1;
    return 0;
  });

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Admin / Manager Request Approval</h2>

      {/* FILTERS */}
      <div style={styles.filterRow}>
        <div style={styles.filterCard}>
          <label style={styles.filterLabel}>Search</label>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by name, rank, message..."
            style={styles.input}
          />
        </div>

        <div style={styles.filterCard}>
          <label style={styles.filterLabel}>Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={styles.select}
          >
            <option value="">All</option>
            <option value="admin accepted">Admin Accepted</option>
            <option value="admin rejected">Admin Rejected</option>
            <option value="manager accepted">Manager Accepted</option>
            <option value="manager rejected">Manager Rejected</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div style={styles.card}>
        {loading ? (
          <div style={styles.noData}>Loading...</div>
        ) : sortedData.length === 0 ? (
          <div style={styles.noData}>No Requests Found</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Guard</th>
                <th style={styles.th}>Rank</th>
                <th style={styles.th}>Message</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>&emsp;Action</th>
              </tr>
            </thead>

            <tbody>
              {sortedData.map((item, index) => {
                const statusText = item.status || "Pending";
                const isPending = statusText === "Pending";

                const statusStyle =
                  statusText.includes("Accepted")
                    ? styles.statusActive
                    : statusText.includes("Rejected")
                    ? styles.statusInactive
                    : styles.statusOther;

                return (
                  <tr key={item.id} style={styles.row}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>{item.officer?.name}</td>
                    <td style={styles.td}>{item.officer?.rank}</td>
                    <td style={styles.td}>{item.message || "N/A"}</td>

                    <td style={styles.td}>
                      <span style={statusStyle}>{statusText}</span>
                    </td>

                    <td style={styles.td}>
                      {isPending ? (
                        <div style={{ display: "flex", gap: 10 }}>
                          <button
                            style={styles.acceptBtn}
                            onClick={() => handleDecision(item, "accept")}
                          >
                            Accept
                          </button>

                          <button
                            style={styles.rejectBtn}
                            onClick={() => handleDecision(item, "reject")}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: "#777", fontWeight: 600 }}>
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ---------------- SAME INCIDENT THEME ---------------- */

const styles = {
  container: { padding: 30, background: "#fff" },
  title: { fontSize: 30, fontWeight: 800, marginBottom: 25, color: "#1967d2" },

  filterRow: { display: "flex", gap: 20, marginBottom: 25 },
  filterCard: {
    flex: 1,
    padding: 18,
    borderRadius: 12,
    background: "#fff",
    boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
  },
  filterLabel: { fontSize: 15, fontWeight: 600, marginBottom: 6 },

  select: {
    width: "100%",
    padding: "12px",
    borderRadius: 8,
    border: "1.5px solid #1a73e8",
    fontSize: 15,
  },

  input: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "1.5px solid #1a73e8",
    fontSize: 15,
    outline: "none",
  },

  card: {
    background: "#fff",
    padding: 10,
    borderRadius: 15,
    boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
  },

  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    background: "#f4f4f6",
    padding: "16px 10px",
    textAlign: "left",
    borderBottom: "2px solid #ddd",
    fontWeight: 700,
  },
  row: { height: 62, transition: "0.25s" },
  td: { padding: "14px 10px", borderBottom: "1px solid #eee" },

  statusActive: {
    background: "#e6ffe6",
    padding: "6px 12px",
    borderRadius: 20,
    color: "#2e7d32",
    fontWeight: 600,
  },
  statusInactive: {
    background: "#ffe6e6",
    padding: "6px 12px",
    borderRadius: 20,
    color: "#d32f2f",
    fontWeight: 600,
  },
  statusOther: {
    background: "#fff8e1",
    padding: "6px 12px",
    borderRadius: 20,
    color: "#ff9800",
    fontWeight: 600,
  },

  acceptBtn: {
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    padding: "7px 14px",
    borderRadius: 8,
    cursor: "pointer",
  },
  rejectBtn: {
    background: "#d32f2f",
    color: "#fff",
    border: "none",
    padding: "7px 14px",
    borderRadius: 8,
    cursor: "pointer",
  },

  noData: { textAlign: "center", padding: 40, fontSize: 18, color: "#777" },
};
